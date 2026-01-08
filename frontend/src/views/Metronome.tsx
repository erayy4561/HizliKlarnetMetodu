import React, { useEffect, useRef, useState } from 'react'

type TimeSig = '4/4' | '3/4' | '2/4' | '6/8'

const MIN_BPM = 40
const MAX_BPM = 200

/**
 * Metronom Bileşeni
 * 
 * Web Audio API kullanarak hassas zamanlamalı (scheduling) bir metronom sağlar.
 * BPM, Zaman Ölçüsü (Time Signature) ayarları ve görsel vuruş göstergeleri içerir.
 */
const Metronome: React.FC = () => {
	// --- MEVCUT STATE VE MANTIK BÖLÜMÜNÜZ ---
	// Metronomun çalışma mantığı, ses üretimi ve zamanlaması
	// HİÇBİR DEĞİŞİKLİK YAPILMADAN korunmuştur.
	const [bpm, setBpm] = useState(100)
	const [timeSig, setTimeSig] = useState<TimeSig>('4/4')
	const [isRunning, setIsRunning] = useState(false)
	const [currentBeat, setCurrentBeat] = useState(-1) // Başlangıçta -1, ilk vuruşta 0 olması için

	const audioCtxRef = useRef<AudioContext | null>(null)
	const nextNoteTimeRef = useRef<number>(0)
	const schedulerRafRef = useRef<number | null>(null)
	const beatInBarRef = useRef<number>(0)

	function beatsPerBar(sig: TimeSig) {
		switch (sig) {
			case '3/4': return 3
			case '2/4': return 2
			case '6/8': return 6
			default: return 4
		}
	}

	function scheduleClick(when: number, isAccent: boolean) {
		const ac = audioCtxRef.current
		if (!ac) return
		const osc = ac.createOscillator()
		const gain = ac.createGain()
		osc.type = 'sine' // 'square' yerine daha yumuşak bir ses
		osc.frequency.setValueAtTime(isAccent ? 900 : 700, ac.currentTime)
		gain.gain.setValueAtTime(0.3, when) // Sesi biraz daha yumuşattım
		gain.gain.exponentialRampToValueAtTime(0.0001, when + 0.05)
		osc.connect(gain).connect(ac.destination)
		osc.start(when)
		osc.stop(when + 0.06)
	}

	function scheduler() {
		const ac = audioCtxRef.current
		if (!ac) return
		const secondsPerBeat = 60 / bpm
		while (nextNoteTimeRef.current < ac.currentTime + 0.1) {
			const barBeats = beatsPerBar(timeSig)
			const isAccent = beatInBarRef.current % barBeats === 0
			scheduleClick(nextNoteTimeRef.current, isAccent)

			const beatToShow = beatInBarRef.current;
			setTimeout(() => {
				setCurrentBeat(beatToShow)
			}, Math.max(0, (nextNoteTimeRef.current - ac.currentTime) * 1000 - 15))

			nextNoteTimeRef.current += secondsPerBeat
			beatInBarRef.current = (beatInBarRef.current + 1) % barBeats
		}
		schedulerRafRef.current = requestAnimationFrame(scheduler)
	}

	function start() {
		if (isRunning) return
		const ac = new (window.AudioContext || (window as any).webkitAudioContext)()
		audioCtxRef.current = ac
		nextNoteTimeRef.current = ac.currentTime + 0.05
		beatInBarRef.current = 0
		setCurrentBeat(-1)
		setIsRunning(true)
		scheduler()
	}

	function stop() {
		setIsRunning(false)
		setCurrentBeat(-1)
		if (schedulerRafRef.current) cancelAnimationFrame(schedulerRafRef.current)
		schedulerRafRef.current = null
		// AudioContext'i hemen kapatmak yerine biraz bekleyip kapatalım
		setTimeout(() => {
			audioCtxRef.current?.close()
			audioCtxRef.current = null
		}, 200);
	}

	useEffect(() => {
		return () => stop()
	}, [])

	useEffect(() => {
		if (isRunning) {
			const ac = audioCtxRef.current
			if (ac) {
				nextNoteTimeRef.current = ac.currentTime + 0.05
				beatInBarRef.current = 0
				setCurrentBeat(-1)
			}
		}
	}, [bpm, timeSig])

	// --- YENİ GÖRSEL TASARIM BÖLÜMÜ ---
	// Yukarıdaki mantıktan gelen veriler, aşağıdaki modern arayüzde gösterilir.
	const barBeats = beatsPerBar(timeSig);
	const timeSigOptions: TimeSig[] = ['4/4', '3/4', '2/4', '6/8'];

	return (
		<div className="bg-gray-50 min-h-[calc(100vh-80px)] flex items-center justify-center p-4 font-sans">
			<div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
				<h2 className="text-3xl font-bold font-serif text-gray-800 mb-4">Metronom</h2>

				{/* BPM Göstergesi */}
				<div className="my-6">
					<span className="text-7xl font-bold text-teal-600 tracking-tighter">{bpm}</span>
					<span className="text-xl font-medium text-gray-500 ml-2">BPM</span>
				</div>

				{/* BPM Ayar Çubuğu */}
				<div className="my-8">
					<input
						type="range"
						min={MIN_BPM}
						max={MAX_BPM}
						value={bpm}
						onChange={e => setBpm(Number(e.target.value))}
						className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
					/>
					<div className="flex justify-between text-xs text-gray-400 mt-2 px-1">
						<span>{MIN_BPM}</span>
						<span>{MAX_BPM}</span>
					</div>
				</div>

				{/* Zaman Ölçüsü Seçimi */}
				<div className="mb-8">
					<h3 className="text-lg font-semibold text-gray-600 mb-3">Zaman Ölçüsü</h3>
					<div className="flex justify-center items-center bg-gray-100 rounded-full p-1 space-x-1">
						{timeSigOptions.map(sig => (
							<button
								key={sig}
								onClick={() => setTimeSig(sig)}
								disabled={isRunning}
								className={`w-full py-2 px-4 rounded-full text-sm font-bold transition-colors duration-300 ${timeSig === sig ? 'bg-white text-teal-600 shadow' : 'text-gray-500 hover:bg-gray-200'} disabled:opacity-50 disabled:hover:bg-transparent`}
							>
								{sig}
							</button>
						))}
					</div>
				</div>

				{/* Vuruş Göstergeleri */}
				<div className="flex justify-center space-x-3 h-8 items-center mb-8">
					{Array.from({ length: barBeats }).map((_, i) => (
						<div
							key={i}
							className={`transition-all duration-150 ${i === currentBeat ? (i === 0 ? 'w-6 h-6 bg-teal-500 shadow-lg' : 'w-5 h-5 bg-gray-600') : 'w-4 h-4 bg-gray-200'} rounded-full`}
						/>
					))}
				</div>

				{/* Başlat / Durdur Butonu */}
				<button
					onClick={isRunning ? stop : start}
					className={`w-full py-4 px-8 rounded-xl text-white font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${isRunning ? 'bg-red-500 hover:bg-red-600' : 'bg-teal-500 hover:bg-teal-600'}`}
				>
					{isRunning ? 'Durdur' : 'Başlat'}
				</button>
			</div>
		</div>
	)
}

export default Metronome
