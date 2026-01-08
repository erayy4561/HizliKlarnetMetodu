import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

const Profile: React.FC = () => {
	const { user, token } = useAuth()
	const [portrait, setPortrait] = useState<PortraitRow[]>([])
	const [performance, setPerformance] = useState<PerformanceRow[]>([])

	useEffect(() => {
		if (!token) return
		void api.get('/quiz/portrait/results/me').then(r => setPortrait(r.data)).catch(() => setPortrait([]))
		void api.get('/quiz/performance/results/me').then(r => setPerformance(r.data)).catch(() => setPerformance([]))
	}, [token])

	if (!user) {
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
				<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
					<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
						<div className="flex items-center space-x-6">
							<div className="h-20 w-20 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
								{user.username.charAt(0).toUpperCase()}
							</div>
							<div>
								<h2 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h2>
								<p className="text-gray-600 mb-1">{user.email}</p>
								<span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-semibold ${getRoleBadgeColor(user.accountType)}`}>
									{user.accountType}
								</span>
							</div>
						</div>
					</div>
				</div>

				{(user.accountType === 'ADMIN' || user.accountType === 'SUPERADMIN') && (
					<div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
						<div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-8 py-4">
							<h3 className="text-2xl font-bold text-white flex items-center space-x-2">
								<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
								</svg>
								<span>Yönetici Paneli</span>
							</h3>
						</div>
						<div className="p-8">
							<AdminPanel />
						</div>
					</div>
				)}

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

export default Profile

const AdminPanel: React.FC = () => {
	const { token, user } = useAuth()
	const [users, setUsers] = useState<any[]>([])
	const [pwdById, setPwdById] = useState<Record<number, string>>({})
	const [roleById, setRoleById] = useState<Record<number, string>>({})
	const [loading, setLoading] = useState(true)
	const [saving, setSaving] = useState<Record<string | number, boolean>>({})

	useEffect(() => {
		if (!token) return
		api.get('/admin/users')
			.then(r => setUsers(r.data))
			.catch(() => setUsers([]))
			.finally(() => setLoading(false))
	}, [token])

	async function changePassword(id: number) {
		const password = pwdById[id]
		if (!password || password.length < 6) {
			alert('Şifre en az 6 karakter olmalıdır')
			return
		}
		setSaving(prev => ({ ...prev, [id]: true }))
		try {
			await api.post(`/admin/users/${id}/password`, { password })
			setPwdById(prev => ({ ...prev, [id]: '' }))
			alert('Şifre başarıyla güncellendi')
		} catch (error) {
			alert('Şifre güncellenirken bir hata oluştu')
		} finally {
			setSaving(prev => ({ ...prev, [id]: false }))
		}
	}

	async function changeRole(id: number) {
		const role = roleById[id]
		if (!role) return
		setSaving(prev => ({ ...prev, [`role-${id}`]: true }))
		try {
			await api.post(`/superadmin/users/${id}/role`, { role })
			alert('Rol başarıyla güncellendi')
			const response = await api.get('/admin/users')
			setUsers(response.data)
		} catch (error) {
			alert('Rol güncellenirken bir hata oluştu')
			setSaving(prev => ({ ...prev, [`role-${id}`]: false }))
		}
	}

	async function deleteUser(id: number) {
		if (!window.confirm('Bu kullanıcıyı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) return
		setSaving(prev => ({ ...prev, [`del-${id}`]: true }))
		try {
			await api.delete(`/admin/users/${id}`)
			alert('Kullanıcı başarıyla silindi')
			setUsers(prev => prev.filter(u => u.id !== id))
		} catch (error: any) {
			alert(error?.response?.data?.message || 'Kullanıcı silinirken bir hata oluştu')
		} finally {
			setSaving(prev => ({ ...prev, [`del-${id}`]: false }))
		}
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

	if (loading) {
		return (
			<div className="flex justify-center items-center py-12">
				<div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
			</div>
		)
	}

	return (
		<div className="overflow-x-auto">
			<table className="min-w-full divide-y divide-gray-200">
				<thead className="bg-gray-50">
					<tr>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kullanıcı</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Şifre Değiştir</th>
						<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol Değiştir</th>
						{user?.accountType === 'SUPERADMIN' && (
							<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sil</th>
						)}
					</tr>
				</thead>
				<tbody className="bg-white divide-y divide-gray-200">
					{users.map(u => (
						<tr key={u.id} className="hover:bg-gray-50 transition-colors">
							<td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{u.id}</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<Link
									to={`/users/${u.id}`}
									className="text-sm font-semibold text-teal-600 hover:text-teal-800 transition-colors"
								>
									{u.username}
								</Link>
							</td>
							<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{u.email}</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold text-white ${getRoleBadgeColor(u.accountType)}`}>
									{u.accountType}
								</span>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center space-x-2">
									<input
										type="password"
										placeholder="Yeni şifre"
										value={pwdById[u.id] || ''}
										onChange={e => setPwdById(v => ({ ...v, [u.id]: e.target.value }))}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-sm"
									/>
									<button
										onClick={() => changePassword(u.id)}
										disabled={saving[u.id] || !pwdById[u.id] || pwdById[u.id].length < 6}
										className="px-4 py-2 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg hover:from-teal-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
									>
										{saving[u.id] ? 'Kaydediliyor...' : 'Kaydet'}
									</button>
								</div>
							</td>
							<td className="px-6 py-4 whitespace-nowrap">
								<div className="flex items-center space-x-2">
									<select
										disabled={user?.accountType !== 'SUPERADMIN'}
										value={roleById[u.id] || u.accountType}
										onChange={e => setRoleById(v => ({ ...v, [u.id]: e.target.value }))}
										className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
									>
										<option value="USER">USER</option>
										<option value="ADMIN">ADMIN</option>
										<option value="SUPERADMIN">SUPERADMIN</option>
									</select>
									<button
										disabled={user?.accountType !== 'SUPERADMIN' || saving[`role-${u.id}`] || (roleById[u.id] || u.accountType) === u.accountType}
										onClick={() => changeRole(u.id)}
										className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
									>
										{saving[`role-${u.id}`] ? 'Güncelleniyor...' : 'Güncelle'}
									</button>
								</div>
							</td>
							{user?.accountType === 'SUPERADMIN' && (
								<td className="px-6 py-4 whitespace-nowrap">
									<button
										disabled={u.id === user.id || saving[`del-${u.id}`]}
										onClick={() => deleteUser(u.id)}
										className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-all"
										title={u.id === user.id ? 'Kendinizi silemezsiniz' : 'Kullanıcıyı sil'}
									>
										{saving[`del-${u.id}`] ? 'Siliniyor...' : 'Sil'}
									</button>
								</td>
							)}
						</tr>
					))}
					{users.length === 0 && (
						<tr>
							<td colSpan={user?.accountType === 'SUPERADMIN' ? 7 : 6} className="px-6 py-8 text-center text-gray-500">
								Kullanıcı bulunamadı.
							</td>
						</tr>
					)}
				</tbody>
			</table>
		</div>
	)
}

export { AdminPanel }


