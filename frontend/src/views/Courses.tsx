import React, { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { api } from '../utils/api'

type Course = {
    id: number
    title: string
    description: string
    createdAt: string
}

const Courses: React.FC = () => {
    const { token, user } = useAuth()
    const [courses, setCourses] = useState<Course[]>([])
    const [enrolledIds, setEnrolledIds] = useState<Set<number>>(new Set())
    const [loading, setLoading] = useState(true)

    const [newTitle, setNewTitle] = useState('')
    const [newDesc, setNewDesc] = useState('')
    const [creating, setCreating] = useState(false)

    const isAdmin = user?.accountType === 'ADMIN' || user?.accountType === 'SUPERADMIN'

    const fetchData = async () => {
        if (!token) return
        try {
            const [coursesRes, enrolledRes] = await Promise.all([
                api.get('/courses'),
                api.get('/courses/my-enrollments')
            ])
            setCourses(coursesRes.data)
            setEnrolledIds(new Set(enrolledRes.data))
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [token])

    const handleEnroll = async (id: number) => {
        try {
            await api.post(`/courses/${id}/enroll`)
            setEnrolledIds(prev => new Set(prev).add(id))
        } catch (error) {
            alert('Dirse kaydolurken hata oluştu')
        }
    }

    const handleWithdraw = async (id: number) => {
        try {
            await api.post(`/courses/${id}/withdraw`)
            setEnrolledIds(prev => {
                const next = new Set(prev)
                next.delete(id)
                return next
            })
        } catch (error) {
            alert('Dersten ayrılırken hata oluştu')
        }
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('Bu dersi silmek istediğinize emin misiniz?')) return
        try {
            await api.delete(`/courses/${id}`)
            setCourses(prev => prev.filter(c => c.id !== id))
        } catch (error) {
            alert('Ders silinirken hata oluştu')
        }
    }

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newTitle.trim()) return
        setCreating(true)
        try {
            const res = await api.post('/courses', {
                title: newTitle,
                description: newDesc
            })
            setCourses(prev => [...prev, res.data])
            setNewTitle('')
            setNewDesc('')
        } catch (error) {
            alert('Ders oluşturulurken hata oluştu')
        } finally {
            setCreating(false)
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
        )
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Mevcut Dersler</h1>
                    <p className="text-gray-600 text-lg">Klarnet yolculuğunuzda size rehberlik edecek eğitimler</p>
                </div>

                {isAdmin && (
                    <div className="mb-12 bg-white p-6 rounded-xl shadow-lg border border-indigo-100">
                        <h3 className="text-xl font-bold text-indigo-900 mb-4">Yeni Ders Ekle</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <input
                                    type="text"
                                    placeholder="Ders Başlığı"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Ders Açıklaması"
                                    value={newDesc}
                                    onChange={e => setNewDesc(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows={3}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={creating || !newTitle.trim()}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                            >
                                {creating ? 'Ekleniyor...' : 'Ders Ekle'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(course => {
                        const isEnrolled = enrolledIds.has(course.id)
                        return (
                            <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col">
                                <div className="h-2 bg-gradient-to-r from-teal-400 to-blue-500"></div>
                                <div className="p-6 flex-1 flex flex-col">
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h3>
                                    <p className="text-gray-600 mb-6 flex-1">{course.description}</p>

                                    <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-100">
                                        {isEnrolled ? (
                                            <button
                                                onClick={() => handleWithdraw(course.id)}
                                                className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors font-medium text-sm"
                                            >
                                                Dersten Ayrıl
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnroll(course.id)}
                                                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors font-medium text-sm shadow-sm hover:shadow-md"
                                            >
                                                Derse Katıl
                                            </button>
                                        )}

                                        {isEnrolled && (
                                            <span className="text-teal-600 text-sm font-semibold flex items-center">
                                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                                Katıldınız
                                            </span>
                                        )}

                                        {isAdmin && (
                                            <button
                                                onClick={() => handleDelete(course.id)}
                                                className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                                                title="Dersi Sil"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default Courses
