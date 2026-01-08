import React, { useEffect, useRef, useState } from 'react'
import { Renderer, Stave, StaveNote, Accidental, Voice, Formatter } from 'vexflow'
import { PitchDetector } from 'pitchy'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

type DurationOption = 1 | 5

// Pitch stuff
const A4 = 440
function freqToMidi(f: number) { return Math.round(69 + 12 * Math.log2(f / A4)) }
function midiToFreq(m: number) { return A4 * Math.pow(2, (m - 69) / 12) }
function centsOff(freq: number, midi: number) { return Math.round(1200 * Math.log2(freq / midiToFreq(midi))) }

const DEFAULT_RANGE = { min: 52, max: 84 }

function midiToKeySpec(midi: number) {
	const pitchClass = ((midi % 12) + 12) % 12
	const octave = Math.floor(midi / 12) - 1
	const pcToName: Record<number, string> = { 0: 'c', 1: 'c#', 2: 'd', 3: 'd#', 4: 'e', 5: 'f', 6: 'f#', 7: 'g', 8: 'g#', 9: 'a', 10: 'a#', 11: 'b' }
	return { keySpec: `${pcToName[pitchClass]}/${octave}`, pitchClass }
}

function getNoteName(midi: number): string {
	const pitchClass = ((midi % 12) + 12) % 12
	const octave = Math.floor(midi / 12) - 1
	const names = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']
	return `${names[pitchClass]}${octave}`
}

const api = axios.create({ baseURL: '/api' })

// Gear Icon
const GearIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
)

/**
 * Performans Quiz Modu (Enstrüman ile Çalma)
 * 
 * Mikrofon girişini analiz ederek kullanıcının çaldığı notayı tespit eder.
 * Pitch detector kullanarak entonasyon (cents) ve doğruluk analizi yapar.
 */
const QuizPerformance: React.FC = () => {
	const { token } = useAuth()

	// Config
	const [duration, setDuration] = useState<number>(1)

	// Init with localStorage
	const [minMidi, setMinMidi] = useState(() => {
		const stored = localStorage.getItem('quiz_perf_min')
		return stored ? Number(stored) : DEFAULT_RANGE.min
	})
	const [maxMidi, setMaxMidi] = useState(() => {
		const stored = localStorage.getItem('quiz_perf_max')
		return stored ? Number(stored) : DEFAULT_RANGE.max
	})
	const [useAccidentals, setUseAccidentals] = useState(() => {
		const stored = localStorage.getItem('quiz_perf_accidentals')
		return stored ? JSON.parse(stored) : false // Default FALSE
	})

	const [settingsOpen, setSettingsOpen] = useState(false)

	// Persist changes
	useEffect(() => {
		localStorage.setItem('quiz_perf_min', String(minMidi))
		localStorage.setItem('quiz_perf_max', String(maxMidi))
		localStorage.setItem('quiz_perf_accidentals', JSON.stringify(useAccidentals))
	}, [minMidi, maxMidi, useAccidentals])

	// Game State
	const [timeLeft, setTimeLeft] = useState<number | null>(null)
	const [elapsed, setElapsed] = useState(0)
	const [running, setRunning] = useState(false)
	const [targetMidi, setTargetMidi] = useState<number | null>(null)
	const [lastFreq, setLastFreq] = useState<number | null>(null)
	const [lastCents, setLastCents] = useState<number | null>(null)
	const [notesCompleted, setNotesCompleted] = useState(0)
	const [hits, setHits] = useState(0)
	const [attempts, setAttempts] = useState(0)
	const [finished, setFinished] = useState(false)
	const [feedback, setFeedback] = useState<'none' | 'success'>('none')

	// Refs
	const containerRef = useRef<HTMLDivElement | null>(null)
	const rendererRef = useRef<Renderer | null>(null)
	const analyserRef = useRef<AnalyserNode | null>(null)
	const audioCtxRef = useRef<AudioContext | null>(null)
	const detectorRef = useRef<ReturnType<typeof PitchDetector.forFloat32Array> | null>(null)
	const bufRef = useRef<Float32Array<ArrayBuffer> | null>(null)
	const rafRef = useRef<number | null>(null)

	const availableMidis = Array.from({ length: DEFAULT_RANGE.max - DEFAULT_RANGE.min + 1 }, (_, i) => DEFAULT_RANGE.min + i)

	// Init VexFlow
	useEffect(() => {
		if (!containerRef.current) return
		containerRef.current.innerHTML = ''
		const renderer = new Renderer(containerRef.current, Renderer.Backends.SVG)
		renderer.resize(420, 160)
		rendererRef.current = renderer
		draw()
	}, [running, finished]) // Re-init on state change if needed

	// Timer Logic
	useEffect(() => {
		if (!running) return

		const t = setInterval(() => {
			if (duration > 0) {
				setTimeLeft(prev => {
					if (prev === null || prev <= 0) {
						clearInterval(t)
						return 0
					}
					return prev - 1
				})
			} else {
				setElapsed(e => e + 1)
			}
		}, 1000)

		return () => clearInterval(t)
	}, [running, duration])

	// Finish on timeout
	useEffect(() => {
		if (duration > 0 && timeLeft !== null && timeLeft <= 0 && running) {
			finish()
		}
	}, [timeLeft, duration, running])

	function draw(noteMidi: number | null = targetMidi) {
		const renderer = rendererRef.current
		if (!renderer) return
		const ctx = renderer.getContext()
		ctx.clear()

		const stave = new Stave(10, 20, 400)
		stave.addClef('treble').setContext(ctx).draw()

		if (noteMidi != null) {
			const { keySpec } = midiToKeySpec(noteMidi)
			const n = new StaveNote({ keys: [keySpec], duration: 'q' })
			if (keySpec.includes('#')) n.addModifier(new Accidental('#'), 0)
			const voice = new Voice({ numBeats: 1, beatValue: 4 })
			voice.addTickables([n])
			new Formatter().joinVoices([voice]).format([voice], 300)
			voice.draw(ctx, stave)
		}
	}

	async function initAudio() {
		if (audioCtxRef.current) return // already active?

		const ac = new (window.AudioContext || (window as any).webkitAudioContext)()
		audioCtxRef.current = ac
		const stream = await navigator.mediaDevices.getUserMedia({
			audio: { echoCancellation: false, noiseSuppression: false },
			video: false
		})
		const source = ac.createMediaStreamSource(stream)
		const analyser = ac.createAnalyser()
		analyser.fftSize = 2048
		analyserRef.current = analyser
		source.connect(analyser)
		bufRef.current = new Float32Array(new ArrayBuffer(analyser.fftSize * 4))
		detectorRef.current = PitchDetector.forFloat32Array(analyser.fftSize)
	}

	function generateNextMidi(): number {
		let attempts = 0
		const maxAttempts = 100
		while (attempts < maxAttempts) {
			const m = Math.floor(Math.random() * (maxMidi - minMidi + 1)) + minMidi
			const spec = midiToKeySpec(m)
			const isAccidental = [1, 3, 6, 8, 10].includes(spec.pitchClass)

			if (!useAccidentals && isAccidental) {
				attempts++
				continue
			}
			return m
		}
		return minMidi
	}

	function loop() {
		const analyser = analyserRef.current
		const ac = audioCtxRef.current
		const detector = detectorRef.current
		const buf = bufRef.current

		if (!analyser || !ac || !detector || !buf) return // Not ready

		analyser.getFloatTimeDomainData(buf)
		const [freq, confidence] = detector.findPitch(buf, ac.sampleRate)

		if (confidence > 0.96 && freq > 30 && freq < 2000) {
			setLastFreq(freq)
			if (targetMidi != null) {
				const cents = centsOff(freq, targetMidi)
				setLastCents(cents)
				setAttempts(a => a + 1)

				// Success window: +/- 15 cents for better UX
				if (Math.abs(cents) <= 15) {
					setHits(h => h + 1)
					setNotesCompleted(n => n + 1)
					setFeedback('success')
					setTimeout(() => setFeedback('none'), 300)
					nextNote()
				}
			}
		}

		rafRef.current = requestAnimationFrame(loop)
	}

	function start() {
		setNotesCompleted(0); setHits(0); setAttempts(0); setFinished(false)
		setElapsed(0)
		setTimeLeft(duration > 0 ? duration * 60 : null)
		setRunning(true)

		const m = generateNextMidi()
		setTargetMidi(m)
		// Need to wait for render to draw? draw() uses ref, so it's fine
		setTimeout(() => draw(m), 50)

		void initAudio().then(() => {
			if (!rafRef.current) loop()
		})
	}

	function stop() {
		setRunning(false)
		if (rafRef.current) {
			cancelAnimationFrame(rafRef.current)
			rafRef.current = null
		}
		audioCtxRef.current?.close().catch(() => { })
		audioCtxRef.current = null
	}

	function finish() {
		stop()
		setFinished(true)
		const acc = Math.round((hits / Math.max(1, attempts)) * 100)

		const authToken = localStorage.getItem('token')

		if (authToken) {
			api.defaults.headers.common['Authorization'] = `Bearer ${authToken}`
			void api.post('/quiz/performance/results', {
				duration,
				notesCompleted,
				accuracyPercentage: acc,
				timeTaken: duration > 0 ? (duration * 60 - (timeLeft ?? 0)) : elapsed
			}).catch(err => console.error("Failed to save result", err))
		}
	}

	function nextNote() {
		const m = generateNextMidi()
		setTargetMidi(m)
		draw(m)
	}

	const accuracy = Math.round((hits / Math.max(1, attempts)) * 100)
	const formatTime = (seconds: number) => {
		const m = Math.floor(seconds / 60)
		const s = seconds % 60
		return `${m}:${s.toString().padStart(2, '0')}`
	}

	// Settings Modal
	const renderSettingsModal = () => {
		if (!settingsOpen) return null
		return (
			<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
				<div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-fade-in-up">
					<div className="bg-gray-50 border-b border-gray-100 p-4 flex items-center justify-between">
						<h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
							<GearIcon className="w-5 h-5 text-gray-500" /> Ayarlar
						</h3>
						<button onClick={() => setSettingsOpen(false)} className="text-gray-400 hover:text-gray-600">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
						</button>
					</div>
					<div className="p-6 space-y-6">
						{/* Range Slider / Select */}
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-2">Nota Aralığı</label>
							<div className="flex gap-2 items-center">
								<select
									value={minMidi}
									onChange={e => {
										const v = Number(e.target.value)
										if (v <= maxMidi) setMinMidi(v)
									}}
									className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
								>
									{availableMidis.map(m => (
										<option key={m} value={m}>{getNoteName(m)}</option>
									))}
								</select>
								<span className="text-gray-400">-</span>
								<select
									value={maxMidi}
									onChange={e => {
										const v = Number(e.target.value)
										if (v >= minMidi) setMaxMidi(v)
									}}
									className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
								>
									{availableMidis.map(m => (
										<option key={m} value={m}>{getNoteName(m)}</option>
									))}
								</select>
							</div>
							<p className="text-xs text-gray-400 mt-1">Sadece bu aralıktaki notalar sorulacak.</p>
						</div>

						{/* Accidentals Toggle */}
						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm font-medium text-gray-700">Arıza Sesler</div>
								<div className="text-xs text-gray-400">Diyez (#) ve Bemoller (b)</div>
							</div>
							<button
								onClick={() => setUseAccidentals(!useAccidentals)}
								className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${useAccidentals ? 'bg-red-500' : 'bg-gray-300'}`}
							>
								<div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${useAccidentals ? 'translate-x-6' : 'translate-x-0'}`} />
							</button>
						</div>

						<button
							onClick={() => setSettingsOpen(false)}
							className="w-full py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
						>
							Kaydet ve Kapat
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 1. Initial Start Screen
	if (!running && !finished) {
		return (
			<div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
				{renderSettingsModal()}
				<div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden relative">
					{/* Gear Button */}
					<button
						onClick={() => setSettingsOpen(true)}
						className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
					>
						<GearIcon />
					</button>

					<div className="bg-gradient-to-r from-red-600 to-orange-500 p-8 text-center text-white">
						<h1 className="text-3xl font-bold mb-2">Performans Modu</h1>
						<p className="opacity-90">Mikrofonunu kullan, doğru notayı üfle!</p>
					</div>
					<div className="p-8 space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">Süre Seçimi</label>
							<div className="grid grid-cols-3 gap-3">
								<button
									onClick={() => setDuration(1)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 1
										? 'border-red-500 bg-red-50 text-red-700'
										: 'border-gray-200 hover:border-red-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">1 Dk</div>
									<div className="text-[10px] text-gray-500">Hızlı</div>
								</button>
								<button
									onClick={() => setDuration(5)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 5
										? 'border-red-500 bg-red-50 text-red-700'
										: 'border-gray-200 hover:border-red-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">5 Dk</div>
									<div className="text-[10px] text-gray-500">Maraton</div>
								</button>
								<button
									onClick={() => setDuration(0)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 0
										? 'border-red-500 bg-red-50 text-red-700'
										: 'border-gray-200 hover:border-red-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">∞</div>
									<div className="text-[10px] text-gray-500">Sonsuz</div>
								</button>
							</div>
						</div>

						{/* Quick Settings Preview */}
						<div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors" onClick={() => setSettingsOpen(true)}>
							<span>
								<strong>Aralık:</strong> {getNoteName(minMidi)} - {getNoteName(maxMidi)}
							</span>
							<span>
								<strong>Arızalar:</strong> {useAccidentals ? 'Açık' : 'Kapalı'}
							</span>
						</div>

						<button
							onClick={start}
							className="w-full py-4 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
						>
							Teste Başla (Mikrofon)
						</button>
					</div>
				</div>
			</div>
		)
	}

	// 2. Result Screen
	if (finished) {
		return (
			<div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
				<div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center">
					<div className="bg-gradient-to-r from-red-600 to-orange-600 p-8">
						<h2 className="text-3xl font-bold text-white mb-2">Performans Bitti!</h2>
						<div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm">
							{duration === 0 ? 'Sonsuz Mod' : `${duration} Dakikalık Mod`}
						</div>
					</div>
					<div className="p-8">
						<div className="mb-8">
							<div className="text-6xl font-bold text-red-600 mb-2">{notesCompleted}</div>
							<p className="text-gray-500">Tamamlanan Nota</p>
						</div>

						<div className="mb-8 p-4 bg-gray-50 rounded-xl">
							<div className="flex justify-between text-sm text-gray-600 mb-2">
								<span>Doğruluk</span>
								<span className="font-bold">%{accuracy}</span>
							</div>
							<div className="h-2 bg-gray-200 rounded-full overflow-hidden">
								<div className="h-full bg-red-500" style={{ width: `${accuracy}%` }} />
							</div>
						</div>

						<div className="flex gap-4">
							<button
								onClick={() => { setFinished(false); setRunning(false); }}
								className="flex-1 py-3 px-4 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors"
							>
								Menüye Dön
							</button>
							<button
								onClick={start}
								className="flex-1 py-3 px-4 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors shadow-md"
							>
								Tekrar Oyna
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	// 3. Game Screen
	return (
		<div className={`min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300 ${feedback === 'success' ? 'bg-green-50' : 'bg-gray-50'
			}`}>
			{/* Header / HUD */}
			<div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => finish()}
						className="flex items-center space-x-1 text-gray-500 hover:text-red-600 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
					>
						<span className="text-sm font-bold">BİTİR</span>
					</button>
					<div className="text-lg font-bold text-gray-800 w-16">
						{duration > 0 ? (
							timeLeft !== null ? formatTime(timeLeft) : '...'
						) : (
							formatTime(elapsed)
						)}
					</div>
				</div>

				<div className="flex items-center space-x-2 bg-red-50 px-3 py-1 rounded-lg">
					<span className="text-xs text-red-600 font-bold uppercase">Nota</span>
					<span className="text-xl font-bold text-red-700">{notesCompleted}</span>
				</div>
			</div>

			{/* Game Content */}
			<div className="flex-1 flex flex-col items-center justify-center p-4 space-y-8">
				{/* Staff Card */}
				<div className="bg-white rounded-xl shadow-lg p-4 transform transition-all hover:scale-[1.01]">
					<div ref={containerRef} className="rounded-lg overflow-hidden bg-white" />
				</div>

				{/* Pitch Visualizer */}
				<div className="w-full max-w-md space-y-2">
					<div className="flex justify-between text-xs text-gray-400 font-medium uppercase tracking-wider">
						<span>Flat (Bemol)</span>
						<span>Merkez</span>
						<span>Sharp (Diyez)</span>
					</div>
					<div className="h-6 bg-gray-200 rounded-full relative overflow-hidden shadow-inner">
						{/* Center Marker */}
						<div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gray-400 transform -translate-x-1/2 z-10" />

						{/* Green Zone */}
						<div className="absolute left-1/2 top-0 bottom-0 w-1/4 bg-green-200/50 transform -translate-x-1/2" />

						{/* Indicator */}
						{typeof lastCents === 'number' && (
							<div
								className={`absolute top-0 bottom-0 w-2 rounded-full transform -translate-x-1/2 transition-all duration-100 ${Math.abs(lastCents) <= 15 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-400'
									}`}
								style={{
									left: `${Math.max(5, Math.min(95, 50 + (lastCents / 50) * 50))}%`
								}}
							/>
						)}
					</div>
					<div className="text-center font-mono text-sm text-gray-500">
						{lastFreq ? `${lastFreq.toFixed(1)} Hz` : 'Ses bekleniyor...'}
						{lastCents !== null && (
							<span className={`ml-2 ${Math.abs(lastCents) <= 15 ? 'text-green-600 font-bold' : 'text-red-500'}`}>
								({lastCents > 0 ? '+' : ''}{lastCents}c)
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default QuizPerformance
