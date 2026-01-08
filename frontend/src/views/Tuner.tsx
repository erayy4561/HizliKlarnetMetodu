import React, { useEffect, useRef, useState } from 'react'
import { centsOffFromPitch, detectPitchTimeDomain, freqToNoteNumber, noteNameFromNumber } from '../utils/pitch'

/**
 * Akort Aleti (Tuner) Bileşeni
 * 
 * Web Audio API kullanarak mikrofon girişini dinler ve
 * pitchy kütüphanesi ile anlık frekans tespiti yapar.
 * Türk Müziği modu (Si bemol klarnet transpozisyonu) desteği içerir.
 */
const Tuner: React.FC = () => {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const [frequency, setFrequency] = useState<number | null>(null)
	const [note, setNote] = useState<string>('—')
	const [cents, setCents] = useState<number | null>(null)
	const [error, setError] = useState<string | null>(null)

	const analyserRef = useRef<AnalyserNode | null>(null)
	const audioCtxRef = useRef<AudioContext | null>(null)
	const rafRef = useRef<number | null>(null)
	const bufferRef = useRef<Float32Array | null>(null)

	const [isTurkishMode, setIsTurkishMode] = useState<boolean>(() => {
		const saved = localStorage.getItem('tuner_mode')
		return saved === 'turkish'
	})

	const isTurkishModeRef = useRef(isTurkishMode)

	useEffect(() => {
		isTurkishModeRef.current = isTurkishMode
	}, [isTurkishMode])

	const toggleMode = (mode: 'piano' | 'turkish') => {
		const isTurkish = mode === 'turkish'
		setIsTurkishMode(isTurkish)
		localStorage.setItem('tuner_mode', isTurkish ? 'turkish' : 'piano')
	}

	useEffect(() => {
		let stream: MediaStream | null = null
		async function init() {
			try {
				const ac = new (window.AudioContext || (window as any).webkitAudioContext)()
				audioCtxRef.current = ac
				stream = await navigator.mediaDevices.getUserMedia({ audio: { echoCancellation: false, noiseSuppression: false }, video: false })
				const source = ac.createMediaStreamSource(stream)
				const analyser = ac.createAnalyser()
				analyser.fftSize = 4096 // Higher resolution for better bass accuracy
				analyserRef.current = analyser
				source.connect(analyser)
				bufferRef.current = new Float32Array(new ArrayBuffer(analyser.fftSize * 4))
				setHasPermission(true)
				loop()
			} catch (e: any) {
				setHasPermission(false)
				setError(e?.message || 'Mikrofon izni reddedildi')
			}
		}

		function loop() {
			const analyser = analyserRef.current
			const ac = audioCtxRef.current
			const buf = bufferRef.current
			if (!analyser || !ac || !buf) return
			(analyser as any).getFloatTimeDomainData(buf)
			const freq = detectPitchTimeDomain(buf, ac.sampleRate)
			if (freq && freq > 25 && freq < 5000) {
				setFrequency(freq)
				const midi = freqToNoteNumber(freq)

				// Apply Transposition Logic here
				const isTurkish = isTurkishModeRef.current
				const displayMidi = isTurkish ? midi + 5 : midi

				setNote(noteNameFromNumber(displayMidi))
				setCents(centsOffFromPitch(freq, midi)) // Cents always relative to real pitch
			} else {
				setFrequency(null)
				setNote('—')
				setCents(null)
			}
			rafRef.current = requestAnimationFrame(loop)
		}

		void init();
		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current)
			if (stream) stream.getTracks().forEach(t => t.stop())
			audioCtxRef.current?.close()
		}
	}, [])

	const inTune = typeof cents === 'number' && Math.abs(cents) <= 5
	const nearTune = typeof cents === 'number' && Math.abs(cents) <= 15
	const centsValue = typeof cents === 'number' ? cents : 0

	const clampedCents = Math.max(-50, Math.min(50, centsValue))
	const needleAngle = (clampedCents / 50) * 90

	return (
		<div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-900 to-slate-800 text-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
			{/* Ambient Background Glow */}
			<div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[100px] transition-colors duration-500 opacity-20 pointer-events-none
				${inTune ? 'bg-teal-400' : nearTune ? 'bg-yellow-400' : 'bg-red-500'}`}
			/>

			{/* Mode Toggle */}
			<div className="z-20 absolute top-8 flex bg-slate-800/50 backdrop-blur-md p-1 rounded-xl border border-slate-700/50">
				<button
					onClick={() => toggleMode('piano')}
					className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${!isTurkishMode ? 'bg-teal-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
				>
					Piyano (Batı)
				</button>
				<button
					onClick={() => toggleMode('turkish')}
					className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${isTurkishMode ? 'bg-red-500 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
				>
					Türk Müziği
				</button>
			</div>

			{/* permission Pending */}
			{hasPermission === null && (
				<div className="z-10 text-center space-y-4 animate-fade-in">
					<div className="w-16 h-16 border-4 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto" />
					<p className="text-xl font-light">Mikrofon başlatılıyor...</p>
				</div>
			)}

			{/* Error State */}
			{hasPermission === false && (
				<div className="z-10 bg-red-500/10 border border-red-500/50 p-6 rounded-2xl max-w-md text-center backdrop-blur-sm">
					<svg className="w-12 h-12 text-red-500 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
					<h3 className="text-xl font-bold text-red-400 mb-2">Mikrofon Hatası</h3>
					<p className="text-red-200">{error || 'Mikrofon izni verilmedi.'}</p>
				</div>
			)}

			{/* Tuner UI */}
			{hasPermission === true && (
				<div className="z-10 w-full max-w-2xl flex flex-col items-center space-y-8 mt-12">

					{/* Gauge Container */}
					<div className="relative w-full aspect-[2/1] max-w-[600px] mb-8">
						<svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-2xl overflow-visible">
							{/* Arc Definition */}
							<defs>
								<linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
									<stop offset="0%" stopColor="#ef4444" />   {/* Red -50 */}
									<stop offset="30%" stopColor="#fbbf24" />   {/* Yellow start */}
									<stop offset="40%" stopColor="#22c55e" />   {/* Green Start (-10 cents) */}
									<stop offset="60%" stopColor="#22c55e" />   {/* Green End (+10 cents) */}
									<stop offset="70%" stopColor="#fbbf24" />   {/* Yellow end */}
									<stop offset="100%" stopColor="#ef4444" />  {/* Red +50 */}
								</linearGradient>
							</defs>

							{/* Background Ticks */}
							{[...Array(11)].map((_, i) => {
								const val = i * 10 - 50 // -50 to +50
								const isCenter = val === 0
								const rot = (val / 50) * 90
								return (
									<g key={i} transform={`translate(100, 100) rotate(${rot})`}>
										{/* Tick Line */}
										<line
											x1="0" y1="-85" x2="0" y2={isCenter ? "-70" : "-80"}
											stroke="currentColor"
											strokeWidth={isCenter ? 1.5 : 0.5}
											className={isCenter ? "text-white" : "text-slate-500"}
										/>
										{/* Text Labels for -50, 0, +50 */}
										{(val === -50 || val === 0 || val === 50) && (
											<text
												x="0" y="-62"
												textAnchor="middle"
												fontSize="4"
												fill="currentColor"
												className={`text-slate-400 font-mono ${isCenter ? 'font-bold' : ''}`}
												transform={`rotate(${-rot} 0 -62)`} // Keep text upright? No, simpler to just rotate with it or better keep simple ticks
											>
												{val > 0 ? `+${val}` : val}
											</text>
										)}
									</g>
								)
							})}

							{/* Main gauge arc for visual guide */}
							<path
								d="M 10 100 A 90 90 0 0 1 190 100"
								fill="none"
								stroke="url(#gaugeGradient)"
								strokeWidth="2"
								strokeLinecap="round"
								className="opacity-50"
							/>

							{/* Needle */}
							{cents !== null && (
								<g
									transform={`translate(100, 100) rotate(${needleAngle})`}
									className="transition-transform duration-150 ease-out will-change-transform"
								>
									{/* Needle Line */}
									<line x1="0" y1="0" x2="0" y2="-90" stroke="currentColor" strokeWidth="2"
										className={`${inTune ? 'text-teal-400' : 'text-white'}`}
									/>
									{/* Needle Head/Circle */}
									<circle r="4" className="fill-slate-800 stroke-white stroke-2" />
								</g>
							)}
						</svg>

						{/* Digital Cents Display overlay */}
						<div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 flex flex-col items-center">
							<div className={`px-4 py-1 rounded-full text-sm font-bold tracking-wider uppercase border backdrop-blur-md shadow-lg transition-colors
								${inTune
									? 'bg-teal-500/20 border-teal-500/50 text-teal-400'
									: 'bg-slate-700/50 border-slate-600 text-slate-400'}`}
							>
								{cents !== null ? (
									<>
										{cents > 0 ? '+' : ''}{cents} cents
									</>
								) : 'Bekleniyor...'}
							</div>
						</div>
					</div>

					{/* Note Name Display */}
					<div className="text-center relative">
						<h1 className={`text-[8rem] leading-none font-bold tracking-tighter transition-all duration-300
							${inTune
								? 'text-teal-400 drop-shadow-[0_0_30px_rgba(45,212,191,0.5)] scale-110'
								: nearTune
									? 'text-white drop-shadow-xl'
									: 'text-slate-500' // Dim when not active/playing
							}`}
						>
							{note.replace(/[0-9]/g, '')}
							<span className="text-3xl ml-1 align-top opacity-50 font-light">
								{note.match(/[0-9]/)?.[0]}
							</span>
						</h1>
						{frequency && (
							<div className="flex flex-col items-center gap-1">
								<p className="text-slate-400 font-mono text-lg mt-2">
									{frequency.toFixed(1)} Hz
								</p>
								<p className="text-xs text-slate-500 font-medium tracking-widest uppercase">
									{isTurkishMode ? 'Konum: Türk Müziği' : 'Konum: Piyano'}
								</p>
							</div>
						)}
					</div>

					{/* Status Text */}
					<div className={`text-lg font-medium transition-colors duration-300 h-8
						${inTune ? 'text-teal-400' : 'text-slate-500'}`}
					>
						{inTune ? '✓ Mükemmel Akort' : ' '}
					</div>

				</div>
			)}
		</div>
	)
}

export default Tuner
