import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const LoginIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
		<polyline points="10 17 15 12 10 7" />
		<line x1="15" x2="3" y1="12" y2="12" />
	</svg>
)

const UserIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
		<circle cx="12" cy="7" r="4" />
	</svg>
)

const LockIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
		<path d="M7 11V7a5 5 0 0 1 10 0v4" />
	</svg>
)

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<rect width="20" height="16" x="2" y="4" rx="2" />
		<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
	</svg>
)

const UserPlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
	<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
		<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
		<circle cx="9" cy="7" r="4" />
		<line x1="19" x2="19" y1="8" y2="14" />
		<line x1="22" x2="16" y1="11" y2="11" />
	</svg>
)

/**
 * Giriş ve Kayıt Sayfası
 * 
 * Kullanıcıların sisteme giriş yapmasını (login) veya yeni hesap oluşturmasını (register) sağlar.
 * AuthContext üzerinden kimlik doğrulama işlemlerini yönetir.
 */
const Login: React.FC = () => {
	const { login, register } = useAuth()

	const [loginUsername, setLoginUsername] = useState('')
	const [loginPassword, setLoginPassword] = useState('')
	const [loginError, setLoginError] = useState<string | null>(null)
	const [loginLoading, setLoginLoading] = useState(false)

	const [registerUsername, setRegisterUsername] = useState('')
	const [registerPassword, setRegisterPassword] = useState('')
	const [registerEmail, setRegisterEmail] = useState('')
	const [registerError, setRegisterError] = useState<string | null>(null)
	const [registerLoading, setRegisterLoading] = useState(false)

	const navigate = useNavigate()
	const location = useLocation() as any
	const from = location.state?.from?.pathname || '/profile'

	async function onLoginSubmit(e: React.FormEvent) {
		e.preventDefault()
		setLoginError(null)
		setLoginLoading(true)

		const username = loginUsername.trim()
		const password = loginPassword.trim()

		if (!username || !password) {
			setLoginError('Lütfen kullanıcı adı ve şifre girin')
			setLoginLoading(false)
			return
		}

		const ok = await login(username, password)
		setLoginLoading(false)
		if (!ok) {
			setLoginError('Geçersiz kullanıcı adı veya şifre. Lütfen bilgilerinizi kontrol edin.')
			return
		}
		navigate(from, { replace: true })
	}

	async function onRegisterSubmit(e: React.FormEvent) {
		e.preventDefault()
		setRegisterError(null)
		setRegisterLoading(true)
		const ok = await register(registerUsername, registerPassword, registerEmail)
		setRegisterLoading(false)
		if (!ok) {
			setRegisterError('Kayıt olurken bir hata oluştu. Kullanıcı adı veya e-posta zaten kullanılıyor olabilir.')
			return
		}
		navigate(from, { replace: true })
	}

	return (
		<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
			<div className="max-w-6xl w-full">
				{/* Header */}
				<div className="text-center mb-12">
					<div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gradient-to-r from-teal-500 to-blue-500 mb-4 shadow-lg">
						<LoginIcon className="h-8 w-8 text-white" />
					</div>
					<h2 className="text-4xl font-bold text-gray-900 mb-2">
						Hoş Geldiniz
					</h2>
					<p className="text-gray-600">
						Hızlı Klarnet Metodu'na giriş yapın veya kayıt olun
					</p>
				</div>

				{/* Two Column Layout */}
				<div className="grid md:grid-cols-2 gap-8">
					{/* Left Side - Login */}
					<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
						<h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
							<LoginIcon className="h-6 w-6 text-teal-500" />
							<span>Giriş Yap</span>
						</h3>
						<form onSubmit={onLoginSubmit} className="space-y-6">
							{/* Username Field */}
							<div>
								<label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-2">
									Kullanıcı Adı
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<UserIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="login-username"
										type="text"
										required
										value={loginUsername}
										onChange={e => setLoginUsername(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
										placeholder="Kullanıcı adınızı girin"
									/>
								</div>
							</div>

							{/* Password Field */}
							<div>
								<label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
									Şifre
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<LockIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="login-password"
										type="password"
										required
										value={loginPassword}
										onChange={e => setLoginPassword(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all outline-none"
										placeholder="Şifrenizi girin"
									/>
								</div>
							</div>

							{/* Error Message */}
							{loginError && (
								<div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center space-x-2">
									<svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
									<span className="text-sm font-medium">{loginError}</span>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={loginLoading}
								className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{loginLoading ? (
									<>
										<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span>Giriş yapılıyor...</span>
									</>
								) : (
									<>
										<LoginIcon className="h-5 w-5" />
										<span>Giriş Yap</span>
									</>
								)}
							</button>
						</form>
					</div>

					{/* Right Side - Register */}
					<div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
						<h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
							<UserPlusIcon className="h-6 w-6 text-indigo-500" />
							<span>Kayıt Ol</span>
						</h3>
						<form onSubmit={onRegisterSubmit} className="space-y-6">
							{/* Email Field */}
							<div>
								<label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
									E-posta
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<MailIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="register-email"
										type="email"
										required
										value={registerEmail}
										onChange={e => setRegisterEmail(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
										placeholder="E-posta adresinizi girin"
									/>
								</div>
							</div>

							{/* Username Field */}
							<div>
								<label htmlFor="register-username" className="block text-sm font-medium text-gray-700 mb-2">
									Kullanıcı Adı
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<UserIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="register-username"
										type="text"
										required
										value={registerUsername}
										onChange={e => setRegisterUsername(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
										placeholder="Kullanıcı adınızı girin"
									/>
								</div>
							</div>

							{/* Password Field */}
							<div>
								<label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
									Şifre
								</label>
								<div className="relative">
									<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
										<LockIcon className="h-5 w-5 text-gray-400" />
									</div>
									<input
										id="register-password"
										type="password"
										required
										minLength={6}
										value={registerPassword}
										onChange={e => setRegisterPassword(e.target.value)}
										className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none"
										placeholder="Şifrenizi girin (min. 6 karakter)"
									/>
								</div>
							</div>

							{/* Error Message */}
							{registerError && (
								<div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center space-x-2">
									<svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
									<span className="text-sm font-medium">{registerError}</span>
								</div>
							)}

							{/* Submit Button */}
							<button
								type="submit"
								disabled={registerLoading}
								className="w-full flex justify-center items-center space-x-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 font-medium text-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
							>
								{registerLoading ? (
									<>
										<svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span>Kayıt yapılıyor...</span>
									</>
								) : (
									<>
										<UserPlusIcon className="h-5 w-5" />
										<span>Kayıt Ol</span>
									</>
								)}
							</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	)
}

export default Login


