import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MicIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="24" x2="12" y1="19" y2="22" /></svg>
);
const MusicNoteIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 18V5l12-2v13" /><path d="m9 18 12-2" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></svg>
);
const GamepadIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="6" x2="10" y1="12" y2="12" /><line x1="8" x2="8" y1="10" y2="14" /><path d="M17.5 15C19.4 15 21 13.4 21 11.5C21 9.6 19.4 8 17.5 8C15.6 8 14 9.6 14 11.5C14 13.4 15.6 15 17.5 15Z" /><path d="M4.53 12.47a5 5 0 0 0 5.44 5.44l1.43-1.43a2 2 0 0 1 0-2.83l-2.17-2.17a2 2 0 0 1-2.83 0l-1.87 1.87Z" /><path d="m12.47 4.53 1.87 1.87a2 2 0 0 1 0 2.83l-2.17 2.17a2 2 0 0 1-2.83 0L7.9 9.97a5 5 0 0 0 5.44-5.44Z" /></svg>
);

const Home: React.FC = () => {
    const { token } = useAuth();

    return (
        <div className="bg-gray-50 text-gray-800">
            <section className="text-center py-20 px-4 sm:px-6 lg:px-8 bg-white shadow-sm">
                <div className="animate-fade-in">
                    <h1 className="text-5xl md:text-6xl font-extrabold font-serif leading-tight">
                        Klarnet Sanatında <span className="text-teal-500">Ustalığa</span> Giden Yol
                    </h1>
                    <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-600">
                        Eray Hızlı'nın modern eğitim metodları ve interaktif araçlarıyla müziğinizi bir üst seviyeye taşıyın.
                    </p>
                    <div className="mt-10">
                        <Link
                            to={token ? "/quiz" : "/login"}
                            className="bg-teal-500 text-white font-bold py-4 px-10 rounded-full text-lg hover:bg-teal-600 transform hover:scale-105 transition-all duration-300 shadow-lg inline-block"
                        >
                            {token ? "Teste Başla" : "Giriş Yap"}
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold font-serif">Uygulama Özellikleri</h2>
                        <p className="text-gray-500 mt-3 text-lg">Pratik yapmak hiç bu kadar kolay ve eğlenceli olmamıştı.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <Link to="/tuner" className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-500 mx-auto mb-5"><MicIcon className="w-8 h-8" /></div>
                            <h3 className="text-2xl font-semibold">Canlı Akort Aleti</h3>
                            <p className="mt-2 text-gray-600">Mikrofonunuzu kullanarak anlık geri bildirim alın ve her zaman doğru notayı çalın.</p>
                        </Link>
                        <Link to="/metronome" className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-500 mx-auto mb-5"><MusicNoteIcon className="w-8 h-8" /></div>
                            <h3 className="text-2xl font-semibold">Akıllı Metronom</h3>
                            <p className="mt-2 text-gray-600">Ayarlanabilir tempo ve vuruş vurgularıyla ritim duygunuzu mükemmelleştirin.</p>
                        </Link>
                        <Link to="/quiz" className="text-center p-8 bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer">
                            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-500 mx-auto mb-5"><GamepadIcon className="w-8 h-8" /></div>
                            <h3 className="text-2xl font-semibold">Eğlenceli Testler</h3>
                            <p className="mt-2 text-gray-600">Nota okuma ve çalma becerilerinizi test ederek gelişiminizi takip edin.</p>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <h3 className="text-teal-500 font-bold uppercase">Eğitmeninizle Tanışın</h3>
                        <h2 className="text-4xl font-bold font-serif mt-2">Eray HIZLI</h2>
                        <p className="mt-4 text-gray-600 text-lg">14 Nisan 1999 tarihinde Soma'da doğdu. Üniversite eğitimimi Pamukkale Üniversitesinde tamamladı. Geleneksel metotları modern teknolojiyle birleştirerek, her seviyeden öğrenci için anlaşılır ve keyifli bir öğrenme deneyimi sunmak amacıyla bir metod üretim sürecine girdi.</p>
                    </div>
                    <div className="order-1 md:order-2">
                        <img src="/Eray.hoca.klarnet.jpg" alt="Eray HIZLI" className="rounded-xl shadow-2xl w-full h-auto object-cover" />
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;

