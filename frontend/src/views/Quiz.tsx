import React from 'react';

const BookOpenIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" /></svg>
);

const MicrophoneIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="2" x2="12" y1="19" y2="22" /></svg>
);


const Quiz: React.FC = () => {
    return (
        <div className="bg-gray-50 min-h-[calc(100vh-80px)] flex flex-col items-center justify-center p-4 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-5xl font-bold font-serif text-gray-800">Becerilerini Test Et</h1>
                <p className="text-lg text-gray-500 mt-3">Aşağıdaki modlardan birini seçerek pratiğe başla.</p>
            </div>
            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8">
                <a href="/quiz/portrait" className="group block bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-teal-100 text-teal-500 mb-5">
                        <BookOpenIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Portre Modu</h2>
                    <p className="text-gray-600 mb-6">Dizek üzerinde gösterilen notaları ne kadar hızlı ve doğru okuyabildiğini test et.</p>
                    <span className="font-bold text-teal-500 group-hover:text-teal-600 transition-colors">
                        Teste Başla &rarr;
                    </span>
                </a>

                <a href="/quiz/performance" className="group block bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-red-100 text-red-500 mb-5">
                        <MicrophoneIcon className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Performans Modu</h2>
                    <p className="text-gray-600 mb-6">Klarnetinle çalacağın notaların doğruluğunu anlık olarak gör ve entonasyonunu geliştir.</p>
                    <span className="font-bold text-red-500 group-hover:text-red-600 transition-colors">
                        Teste Başla &rarr;
                    </span>
                </a>
            </div>
        </div>
    )
}

export default Quiz

