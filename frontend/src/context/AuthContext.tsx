import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'

type User = {
	id: number
	username: string
	email: string
	accountType: 'USER' | 'ADMIN' | 'SUPERADMIN'
} | null

type AuthContextType = {
	user: User
	token: string | null
	login: (username: string, password: string) => Promise<boolean>
	register: (username: string, password: string, email: string) => Promise<boolean>
	logout: () => void
	loadMe: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'))
	const [user, setUser] = useState<User>(null)

	const api = useMemo(() => axios.create({ baseURL: '/api' }), [])

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token)
			api.defaults.headers.common['Authorization'] = `Bearer ${token}`
			void loadMe()
		} else {
			delete api.defaults.headers.common['Authorization']
			localStorage.removeItem('token')
			setUser(null)
		}
	}, [token])

	async function loadMe() {
		if (!token) return
		console.log('[loadMe] Token:', token)
		console.log('[loadMe] Authorization header:', api.defaults.headers.common['Authorization'])
		try {
			const res = await api.get('/me')
			setUser(res.data)
		} catch (error: any) {
			console.error('loadMe error:', error)
			// Sadece yetkilendirme hatalarında çıkış yap
			if (error.response && (error.response.status === 401 || error.response.status === 403)) {
				setUser(null)
				setToken(null)
				localStorage.removeItem('token')
			}
		}
	}

	async function login(username: string, password: string) {
		try {
			console.log('Attempting login with:', { username })
			const res = await api.post('/auth/login', { username, password })
			console.log('Login successful, token received')
			if (res.data && res.data.token) {
				setToken(res.data.token)
				return true
			} else {
				console.error('No token in response:', res.data)
				return false
			}
		} catch (error: any) {
			console.error('Login error:', error)
			console.error('Error message:', error?.message)
			console.error('Response data:', error?.response?.data)
			console.error('Response status:', error?.response?.status)
			console.error('Full error:', JSON.stringify(error, null, 2))
			return false
		}
	}

	async function register(username: string, password: string, email: string) {
		try {
			const res = await api.post('/auth/register', { username, password, email })
			setToken(res.data.token)
			return true
		} catch (error: any) {
			console.error('Register error:', error)
			console.error('Response:', error?.response?.data)
			console.error('Status:', error?.response?.status)
			return false
		}
	}

	function logout() {
		setToken(null)
	}

	return (
		<AuthContext.Provider value={{ user, token, login, register, logout, loadMe }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}


