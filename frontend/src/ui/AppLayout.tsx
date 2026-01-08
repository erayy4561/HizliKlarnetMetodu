import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const HomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
		<polyline points="9 22 9 12 15 12 15 22" />
	</svg>
)

const TunerIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
		<path d="M19 10v2a7 7 0 0 1-14 0v-2" />
		<line x1="12" x2="12" y1="19" y2="22" />
	</svg>
)

const MetronomeIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M9 18V5l12-2v13" />
		<circle cx="6" cy="18" r="3" />
		<circle cx="18" cy="16" r="3" />
	</svg>
)

const QuizIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<circle cx="12" cy="12" r="10" />
		<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
		<path d="M12 17h.01" />
	</svg>
)

const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
		<polyline points="10 17 15 12 10 7" />
		<line x1="15" x2="3" y1="12" y2="12" />
	</svg>
)

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
)

const LogoutIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
		<polyline points="16 17 21 12 16 7" />
		<line x1="21" x2="9" y1="12" y2="12" />
	</svg>
)

const BookIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
		<path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
	</svg>
)

const AppLayout: React.FC = () => {
	const { user, token, logout } = useAuth()
	const { t } = useTranslation()
	return (
		<div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
			<header className="sticky top-0 z-50 backdrop-blur-lg bg-white/80 border-b border-teal-100/50 shadow-sm">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-between h-16 md:h-20">
						<Link
							to="/"
							className="flex items-center space-x-2 group"
						>
							<div className="relative">
								<img
									src="/logo_large.png"
									alt={t('app.title')}
									className="h-10 md:h-12 w-auto object-contain transform group-hover:scale-105 transition-transform drop-shadow-lg"
								/>
							</div>
						</Link>

						<nav className="hidden md:flex items-center space-x-1">
							<NavLink
								to="/"
								className={({ isActive }) =>
									`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-105'
										: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
									}`
								}
							>
								<HomeIcon />
								<span>{t('app.home')}</span>
							</NavLink>

							<NavLink
								to="/tuner"
								className={({ isActive }) =>
									`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-105'
										: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
									}`
								}
							>
								<TunerIcon />
								<span>{t('app.tuner')}</span>
							</NavLink>

							<NavLink
								to="/metronome"
								className={({ isActive }) =>
									`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-105'
										: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
									}`
								}
							>
								<MetronomeIcon />
								<span>{t('app.metronome')}</span>
							</NavLink>

							<NavLink
								to="/quiz"
								className={({ isActive }) =>
									`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-105'
										: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
									}`
								}
							>
								<QuizIcon />
								<span>{t('app.quiz')}</span>
							</NavLink>

							<NavLink
								to="/courses"
								className={({ isActive }) =>
									`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
										? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md transform scale-105'
										: 'text-gray-700 hover:bg-teal-50 hover:text-teal-600'
									}`
								}
							>
								<BookIcon />
								<span>Dersler</span>
							</NavLink>
						</nav>

						<div className="flex items-center space-x-2">
							{token ? (
								<div className="flex items-center space-x-3">
									<Link to="/profile" className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 hover:border-indigo-200 transition-colors">
										<UserIcon className="text-indigo-600" />
										<span className="text-sm font-medium text-indigo-700">{user?.username}</span>
									</Link>
									<button
										onClick={logout}
										className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-lg font-medium hover:from-red-600 hover:to-pink-600 shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200"
									>
										<LogoutIcon />
										<span className="hidden sm:inline">{t('app.logout')}</span>
									</button>
								</div>
							) : (
								<NavLink
									to="/login"
									className={({ isActive }) =>
										`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${isActive
											? 'bg-gradient-to-r from-teal-500 to-blue-500 text-white shadow-md'
											: 'bg-gradient-to-r from-teal-500 to-blue-500 text-white hover:from-teal-600 hover:to-blue-600 shadow-md hover:shadow-lg transform hover:scale-105'
										}`
									}
								>
									<LoginIcon />
									<span>{t('app.login')}</span>
								</NavLink>
							)}
						</div>
					</div>
				</div>

				<div className="md:hidden border-t border-teal-100/50 bg-white/50 backdrop-blur-sm">
					<nav className="flex items-center justify-around px-4 py-2">
						<NavLink
							to="/"
							className={({ isActive }) =>
								`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-600'
								}`
							}
						>
							<HomeIcon />
							<span className="text-xs font-medium">{t('app.home')}</span>
						</NavLink>

						<NavLink
							to="/tuner"
							className={({ isActive }) =>
								`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-600'
								}`
							}
						>
							<TunerIcon />
							<span className="text-xs font-medium">{t('app.tuner')}</span>
						</NavLink>

						<NavLink
							to="/metronome"
							className={({ isActive }) =>
								`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-600'
								}`
							}
						>
							<MetronomeIcon />
							<span className="text-xs font-medium">{t('app.metronome')}</span>
						</NavLink>

						<NavLink
							to="/quiz"
							className={({ isActive }) =>
								`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-600'
								}`
							}
						>
							<QuizIcon />
							<span className="text-xs font-medium">{t('app.quiz')}</span>
						</NavLink>

						<NavLink
							to="/courses"
							className={({ isActive }) =>
								`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all ${isActive ? 'text-teal-600 bg-teal-50' : 'text-gray-600'
								}`
							}
						>
							<BookIcon />
							<span className="text-xs font-medium">Dersler</span>
						</NavLink>
					</nav>
				</div>
			</header>

			<main className="min-h-[calc(100vh-4rem)]">
				<Outlet />
			</main>
		</div>
	)
}

export default AppLayout


