const A4 = 440

export function freqToNoteNumber(frequency: number): number {
	return Math.round(12 * Math.log2(frequency / A4) + 69)
}

export function noteNumberToFrequency(noteNumber: number): number {
	return A4 * Math.pow(2, (noteNumber - 69) / 12)
}

const NOTE_NAMES = ['Do', 'Do#', 'Re', 'Re#', 'Mi', 'Fa', 'Fa#', 'Sol', 'Sol#', 'La', 'La#', 'Si']

export function noteNameFromNumber(noteNumber: number): string {
	const name = NOTE_NAMES[(noteNumber + 1200) % 12]
	const octave = Math.floor(noteNumber / 12) - 1
	return `${name}${octave}`
}

export function centsOffFromPitch(frequency: number, noteNumber: number): number {
	const refFreq = noteNumberToFrequency(noteNumber)
	return Math.floor(1200 * Math.log2(frequency / refFreq))
}

export function detectPitchTimeDomain(buf: Float32Array, sampleRate: number): number | null {
	const SIZE = buf.length
	let rms = 0
	for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i]
	rms = Math.sqrt(rms / SIZE)
	if (rms < 0.008) return null

	let bestOffset = -1
	let bestCorrelation = 0
	let lastCorrelation = 1
	const minLag = Math.floor(sampleRate / 5000) // 5000 Hz
	const maxLag = Math.floor(sampleRate / 50) // 50 Hz

	for (let offset = minLag; offset <= maxLag; offset++) {
		let correlation = 0
		for (let i = 0; i < maxLag; i++) correlation += Math.abs(buf[i] - buf[i + offset])
		correlation = 1 - correlation / maxLag
		if (correlation > 0.9 && correlation > lastCorrelation) bestOffset = offset
		if (correlation > bestCorrelation) {
			bestCorrelation = correlation
			bestOffset = offset
		}
		lastCorrelation = correlation
	}

	if (bestCorrelation > 0.01 && bestOffset > 0) {
		return sampleRate / bestOffset
	}
	return null
}


