import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
	tr: {
		translation: {
			app: {
				title: 'Hızlı Klarnet Metodu',
				home: 'Ana Sayfa',
				tuner: 'Akorlayıcı',
				metronome: 'Metronom',
				quiz: 'Quiz',
				login: 'Giriş',
				logout: 'Çıkış'
			},
			quiz: {
				portrait: 'Portre Modu (Nota Okuma)',
				performance: 'Performans Modu',
				start: 'Başlat',
				finish: 'Bitir',
				duration: 'Süre',
				oneMin: '1 dakika',
				fiveMin: '5 dakika',
				timeLeft: 'Kalan Süre',
				correct: 'Doğru Cevap',
				wrong: 'Yanlış',
				score: 'Skor',
				completedNotes: 'Tamamlanan Nota',
				accuracy: 'Doğruluk'
			},
			profile: {
				title: 'Profil',
				role: 'Hesap türü',
				portraitResults: 'Portre Quiz Sonuçları',
				performanceResults: 'Performans Quiz Sonuçları',
				noRecords: 'Kayıt bulunamadı.'
			}
		}
	}
}

i18n
	.use(initReactI18next)
	.init({
		resources,
		lng: 'tr',
		fallbackLng: 'tr',
		interpolation: { escapeValue: false }
	})

export default i18n


