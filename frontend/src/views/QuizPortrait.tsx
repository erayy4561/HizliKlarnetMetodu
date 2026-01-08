import React, { useEffect, useRef, useState } from 'react'
import { Renderer, Stave, StaveNote, Accidental, Voice, Formatter } from 'vexflow'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

type DurationOption = 0 | 1 | 5

const ALL_OPTIONS = [
	'Do', 'Do#', 'Reb', 'Re', 'Re#', 'Mib', 'Mi', 'Fa', 'Fa#', 'Solb', 'Sol', 'Sol#', 'Lab', 'La', 'La#', 'Sib', 'Si'
]

type NoteTarget = { keySpec: string; pitchClass: number; midi: number }

const DEFAULT_RANGE = { min: 52, max: 84 } // E3 to C6

function midiToKeySpec(midi: number): { keySpec: string; pitchClass: number } {
	const pitchClass = ((midi % 12) + 12) % 12
	const octave = Math.floor(midi / 12) - 1
	const baseMap: Record<number, string> = {
		0: 'c', 1: 'c#', 2: 'd', 3: 'd#', 4: 'e', 5: 'f', 6: 'f#', 7: 'g', 8: 'g#', 9: 'a', 10: 'a#', 11: 'b'
	}
	return { keySpec: `${baseMap[pitchClass]}/${octave}`, pitchClass }
}

function getNoteName(midi: number): string {
	const pitchClass = ((midi % 12) + 12) % 12
	const octave = Math.floor(midi / 12) - 1
	const names = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']
	return `${names[pitchClass]}${octave}`
}

function pitchClassFromName(name: string): number {
	switch (name) {
		case 'Do': return 0
		case 'Do#': case 'Reb': return 1
		case 'Re': return 2
		case 'Re#': case 'Mib': return 3
		case 'Mi': return 4
		case 'Fa': return 5
		case 'Fa#': case 'Solb': return 6
		case 'Sol': return 7
		case 'Sol#': case 'Lab': return 8
		case 'La': return 9
		case 'La#': case 'Sib': return 10
		case 'Si': return 11
		default: return -1
	}
}

const GearIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.09a2 2 0 0 1-1-1.74v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
		<circle cx="12" cy="12" r="3" />
	</svg>
)

const QuizPortrait: React.FC = () => {
	const [duration, setDuration] = useState<DurationOption>(1)

	const [minMidi, setMinMidi] = useState(() => {
		const stored = localStorage.getItem('quiz_portrait_min')
		return stored ? Number(stored) : DEFAULT_RANGE.min
	})
	const [maxMidi, setMaxMidi] = useState(() => {
		const stored = localStorage.getItem('quiz_portrait_max')
		return stored ? Number(stored) : DEFAULT_RANGE.max
	})
	const [useAccidentals, setUseAccidentals] = useState(() => {
		const stored = localStorage.getItem('quiz_portrait_accidentals')
		return stored ? JSON.parse(stored) : false // Default FALSE
	})

	const [settingsOpen, setSettingsOpen] = useState(false)

	useEffect(() => {
		localStorage.setItem('quiz_portrait_min', String(minMidi))
		localStorage.setItem('quiz_portrait_max', String(maxMidi))
		localStorage.setItem('quiz_portrait_accidentals', JSON.stringify(useAccidentals))
	}, [minMidi, maxMidi, useAccidentals])

	const [timeLeft, setTimeLeft] = useState<number | null>(null)
	const [running, setRunning] = useState(false)
	const [target, setTarget] = useState<NoteTarget | null>(null)
	const [correct, setCorrect] = useState(0)
	const [wrong, setWrong] = useState(0)
	const [finished, setFinished] = useState(false)
	const [feedback, setFeedback] = useState<'none' | 'success' | 'error'>('none')

	const canvasRef = useRef<HTMLDivElement | null>(null)
	const rendererRef = useRef<Renderer | null>(null)

	const availableMidis = Array.from({ length: DEFAULT_RANGE.max - DEFAULT_RANGE.min + 1 }, (_, i) => DEFAULT_RANGE.min + i)

	useEffect(() => {
		if (!canvasRef.current) return
		canvasRef.current.innerHTML = ''
		const renderer = new Renderer(canvasRef.current, Renderer.Backends.SVG)
		renderer.resize(420, 160)
		rendererRef.current = renderer
		drawStaff(null)
	}, [running, finished])

	useEffect(() => {
		if (!running || timeLeft === null) return
		if (timeLeft <= 0) {
			finish()
			return
		}
		const t = setTimeout(() => setTimeLeft(tl => tl! - 1), 1000)
		return () => clearTimeout(t)
	}, [running, timeLeft])

	useEffect(() => {
		if (running && target) {
			drawStaff(target)
		}
	}, [target, running])

	function drawStaff(note: NoteTarget | null) {
		const renderer = rendererRef.current
		if (!renderer) return
		const ctx = renderer.getContext()
		ctx.clear()

		const stave = new Stave(10, 20, 400)
		stave.addClef('treble')
		stave.setContext(ctx).draw()

		if (note) {
			const vfNote = new StaveNote({ keys: [note.keySpec], duration: 'q' })
			if (note.keySpec.includes('#')) {
				vfNote.addModifier(new Accidental('#'), 0)
			}
			const voice = new Voice({ numBeats: 1, beatValue: 4 })
			voice.addTickables([vfNote])
			new Formatter().joinVoices([voice]).format([voice], 300)
			voice.draw(ctx, stave)
		}
	}

	function generateNextNote(): NoteTarget {
		let attempts = 0
		const maxAttempts = 100
		while (attempts < maxAttempts) {
			const midi = Math.floor(Math.random() * (maxMidi - minMidi + 1)) + minMidi
			const spec = midiToKeySpec(midi)
			const isAccidental = [1, 3, 6, 8, 10].includes(spec.pitchClass)

			if (!useAccidentals && isAccidental) {
				attempts++
				continue
			}
			return { ...spec, midi }
		}
		return { ...midiToKeySpec(minMidi), midi: minMidi }
	}

	function start() {
		setCorrect(0); setWrong(0)
		setFinished(false)
		setTimeLeft(duration * 60)
		setRunning(true)
		setFeedback('none')
		setTimeout(nextNote, 100)
	}

	function finish() {
		stop()
		setFinished(true)
		const total = Math.max(1, correct + wrong)
		const finalScore = Math.round((correct / total) * 100)

		const authToken = localStorage.getItem('token')

		if (authToken) {
			void api.post('/quiz/portrait/results', {
				duration,
				correctAnswers: correct,
				wrongAnswers: wrong,
				scorePercentage: finalScore,
				completionTime: duration > 0 ? (duration * 60 - (timeLeft ?? 0)) : 0
			}).catch(err => console.error("Failed to save result", err))
		}
	}

	function nextNote() {
		setTarget(generateNextNote())
	}

	function onAnswer(name: string) {
		if (!running || !target) return
		const pc = pitchClassFromName(name)
		if (pc === target.pitchClass) {
			setCorrect(c => c + 1)
			setFeedback('success')
			setTimeout(() => setFeedback('none'), 300)
			nextNote()
		} else {
			setWrong(w => w + 1)
			setFeedback('error')
			setTimeout(() => setFeedback('none'), 300)
		}
	}

	const total = Math.max(1, correct + wrong)
	const score = Math.round((correct / total) * 100)

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

						<div className="flex items-center justify-between">
							<div>
								<div className="text-sm font-medium text-gray-700">Arıza Sesler</div>
								<div className="text-xs text-gray-400">Diyez (#) ve Bemoller (b)</div>
							</div>
							<button
								onClick={() => setUseAccidentals(!useAccidentals)}
								className={`w-12 h-6 rounded-full p-1 transition-colors duration-200 ease-in-out focus:outline-none ${useAccidentals ? 'bg-teal-500' : 'bg-gray-300'}`}
							>
								<div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform duration-200 ${useAccidentals ? 'translate-x-6' : 'translate-x-0'}`} />
							</button>
						</div>

						<button
							onClick={() => setSettingsOpen(false)}
							className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-colors"
						>
							Kaydet ve Kapat
						</button>
					</div>
				</div>
			</div>
		)
	}

	if (!running && !finished) {
		return (
			<div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
				{renderSettingsModal()}
				<div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden relative">
					<button
						onClick={() => setSettingsOpen(true)}
						className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors"
					>
						<GearIcon />
					</button>

					<div className="bg-gradient-to-r from-teal-500 to-blue-500 p-8 text-center text-white">
						<h1 className="text-3xl font-bold mb-2">Portre Modu</h1>
						<p className="opacity-90">Notaları dizek üzerinde tanı ve hızını test et!</p>
					</div>
					<div className="p-8 space-y-6">
						<div>
							<label className="block text-sm font-medium text-gray-700 mb-3">Süre Seçimi</label>
							<div className="grid grid-cols-3 gap-3">
								<button
									onClick={() => setDuration(1)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 1
										? 'border-teal-500 bg-teal-50 text-teal-700'
										: 'border-gray-200 hover:border-teal-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">1 Dk</div>
									<div className="text-[10px] text-gray-500">Hızlı</div>
								</button>
								<button
									onClick={() => setDuration(5)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 5
										? 'border-teal-500 bg-teal-50 text-teal-700'
										: 'border-gray-200 hover:border-teal-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">5 Dk</div>
									<div className="text-[10px] text-gray-500">Maraton</div>
								</button>
								<button
									onClick={() => setDuration(0)}
									className={`p-4 rounded-xl border-2 transition-all ${duration === 0
										? 'border-teal-500 bg-teal-50 text-teal-700'
										: 'border-gray-200 hover:border-teal-200'
										}`}
								>
									<div className="text-xl font-bold mb-1">∞</div>
									<div className="text-[10px] text-gray-500">Sonsuz</div>
								</button>
							</div>
						</div>

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
							className="w-full py-4 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all"
						>
							Teste Başla
						</button>
					</div>
				</div>
			</div>
		)
	}

	if (finished) {
		return (
			<div className="min-h-[calc(100vh-4rem)] bg-gray-50 flex items-center justify-center p-4">
				<div className="bg-white max-w-md w-full rounded-2xl shadow-xl overflow-hidden text-center">
					<div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-8">
						<h2 className="text-3xl font-bold text-white mb-2">Test Tamamlandı!</h2>
						<div className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-sm">
							{duration} Dakikalık Mod
						</div>
					</div>
					<div className="p-8">
						<div className="mb-8">
							<span className={`text-6xl font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-red-500'}`}>
								%{score}
							</span>
							<p className="text-gray-500 mt-2">Başarı Puanı</p>
						</div>

						<div className="grid grid-cols-2 gap-4 mb-8">
							<div className="p-4 bg-green-50 rounded-xl">
								<div className="text-2xl font-bold text-green-600">{correct}</div>
								<div className="text-xs text-green-800 uppercase tracking-wide">Doğru</div>
							</div>
							<div className="p-4 bg-red-50 rounded-xl">
								<div className="text-2xl font-bold text-red-600">{wrong}</div>
								<div className="text-xs text-red-800 uppercase tracking-wide">Yanlış</div>
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
								className="flex-1 py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors shadow-md"
							>
								Tekrar Oyna
							</button>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className={`min-h-[calc(100vh-4rem)] flex flex-col transition-colors duration-300 ${feedback === 'success' ? 'bg-green-50' :
			feedback === 'error' ? 'bg-red-50' :
				'bg-gray-50'
			}`}>
			<div className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex items-center justify-between sticky top-0 z-10">
				<div className="flex items-center space-x-4">
					<button
						onClick={() => { setRunning(false); setFinished(false); }}
						className="text-gray-400 hover:text-gray-600"
					>
						<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
					</button>
					<div className="text-lg font-bold text-gray-800">
						{Math.floor(timeLeft! / 60)}:{(timeLeft! % 60).toString().padStart(2, '0')}
					</div>
				</div>

				<div className="flex-1 flex justify-center">
					<div className={`text-2xl font-bold ${score >= 80 ? 'text-green-500' : score >= 60 ? 'text-yellow-500' : 'text-gray-400'}`}>
						%{isNaN(score) ? 0 : score}
					</div>
				</div>

				<div className="flex items-center space-x-6">
					<div className="flex flex-col items-center">
						<span className="text-xs text-gray-400 uppercase">Doğru</span>
						<span className="font-bold text-green-600">{correct}</span>
					</div>
					<div className="flex flex-col items-center">
						<span className="text-xs text-gray-400 uppercase">Yanlış</span>
						<span className="font-bold text-red-600">{wrong}</span>
					</div>
				</div>
			</div>

			<div className="flex-1 flex flex-col items-center justify-center p-4">

				<div className="bg-white rounded-xl shadow-lg p-4 mb-8 transform transition-all hover:scale-[1.01]">
					<div ref={canvasRef} className="rounded-lg overflow-hidden bg-white" />
				</div>

				<div className="w-full max-w-5xl">
					<div className="flex flex-wrap justify-center gap-3">
						{ALL_OPTIONS
							.filter(opt => useAccidentals || (!opt.includes('#') && !opt.includes('b')))
							.map(opt => (
								<button
									key={opt}
									onClick={() => onAnswer(opt)}
									className="w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center rounded-xl bg-white border-2 border-gray-200 shadow-sm text-lg sm:text-xl font-bold text-gray-700 hover:bg-indigo-50 hover:border-indigo-400 hover:text-indigo-600 active:bg-indigo-100 active:scale-95 transition-all"
								>
									{opt}
								</button>
							))
						}
					</div>
				</div>

				<div className="mt-8 text-center text-gray-400 text-sm">
					Doğru notayı seçmek için yukarıdaki tuşlara basın
				</div>
			</div>
		</div>
	)
}

export default QuizPortrait
