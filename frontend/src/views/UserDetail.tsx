import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

type PortraitRow = {
    id: number
    duration: number
    correctAnswers: number
    wrongAnswers: number
    scorePercentage: number
    completionTime: number
    createdAt: string
}

type PerformanceRow = {
    id: number
    duration: number
    notesCompleted: number
    accuracyPercentage: number
    timeTaken: number
    createdAt: string
}

/**
 * Kullanıcı Detay Sayfası (Admin)
 * 
 * Adminlerin belirli bir kullanıcının detaylarını ve quiz sonuçlarını
 * görüntülemesini sağlayan sayfa.
 */
const UserDetail: React.FC = () => {
    const { id } = useParams()
    const { token } = useAuth()
    const [profile, setProfile] = useState<any | null>(null)
    const [portrait, setPortrait] = useState<PortraitRow[]>([])
    const [performance, setPerformance] = useState<PerformanceRow[]>([])

    useEffect(() => {
        if (!token || !id) return
        api.get(`/admin/users/${id}`).then(r => setProfile(r.data)).catch((e) => {
            console.error('Fetch Profile Error:', e);
            setProfile(null);
        })
        api.get(`/admin/users/${id}/results/portrait`).then(r => setPortrait(r.data)).catch((e) => {
            console.error('Fetch Portrait Error:', e);
            setPortrait([]);
        })
        api.get(`/admin/users/${id}/results/performance`).then(r => setPerformance(r.data)).catch((e) => {
            console.error('Fetch Performance Error:', e);
            setPerformance([]);
        })
    }, [token, id])

    if (!profile) {
        return (
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent mb-4"></div>
                    <p className="text-gray-600">Yükleniyor...</p>
                </div>
            </div>
        )
    }

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case 'SUPERADMIN':
                return 'bg-gradient-to-r from-purple-500 to-pink-500'
            case 'ADMIN':
                return 'bg-gradient-to-r from-blue-500 to-indigo-500'
            default:
                return 'bg-gradient-to-r from-teal-500 to-blue-500'
        }
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Back Button */}
                <Link
                    to="/profile"
                    className="inline-flex items-center space-x-2 text-teal-600 hover:text-teal-800 transition-colors"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    <span className="font-medium">Geri Dön</span>
                </Link>

                {/* User Header Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="flex items-center space-x-6">
                            <div className="h-20 w-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                                {profile.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-gray-900 mb-2">{profile.username}</h2>
                                <p className="text-gray-600 mb-1">{profile.email}</p>
                                <div className="flex items-center space-x-3">
                                    <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getRoleBadgeColor(profile.accountType)}`}>
                                        {profile.accountType}
                                    </span>
                                    <span className="text-sm text-gray-500">ID: {profile.id}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portrait Quiz Results */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-teal-500 to-blue-500 px-8 py-4">
                        <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Portre Quiz Sonuçları</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doğru</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Yanlış</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skor</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre (sn)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {portrait.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.createdAt).toLocaleString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.duration} dk</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">{r.correctAnswers}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-red-600">{r.wrongAnswers}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${r.scorePercentage >= 80 ? 'bg-green-100 text-green-800' :
                                                r.scorePercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                %{Math.round(r.scorePercentage)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.completionTime} sn</td>
                                    </tr>
                                ))}
                                {portrait.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                                            Kayıt bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Performance Quiz Results */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4">
                        <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span>Performans Quiz Sonuçları</span>
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tarih</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tamamlanan Nota</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doğruluk</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Süre (sn)</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {performance.map(r => (
                                    <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(r.createdAt).toLocaleString('tr-TR')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.duration} dk</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-blue-600">{r.notesCompleted}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${r.accuracyPercentage >= 80 ? 'bg-green-100 text-green-800' :
                                                r.accuracyPercentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-red-100 text-red-800'
                                                }`}>
                                                %{Math.round(r.accuracyPercentage)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{r.timeTaken} sn</td>
                                    </tr>
                                ))}
                                {performance.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                            Kayıt bulunamadı.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserDetail


