import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { api, setAuthToken } from '../utils/api'

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

	const loadMe = useCallback(async () => {
		if (!token) return
		try {
			const res = await api.get('/auth/profile')
			setUser(res.data)
		} catch (error: any) {
			if (error.response && (error.response.status === 401 || error.response.status === 403)) {
				setUser(null)
				setToken(null)
				localStorage.removeItem('token')
				setAuthToken(null)
			}
		}
	}, [token])

	useEffect(() => {
		if (token) {
			localStorage.setItem('token', token)
			setAuthToken(token)
			void loadMe()
		} else {
			setAuthToken(null)
			localStorage.removeItem('token')
			setUser(null)
		}
	}, [token, loadMe])

	async function login(username: string, password: string) {
		try {
			const res = await api.post('/auth/login', { username, password })
			if (res.data && res.data.token) {
				setToken(res.data.token)
				return true
			}
			return false
		} catch (error: any) {
			return false
		}
	}

	async function register(username: string, password: string, email: string) {
		try {
			const res = await api.post('/auth/register', { username, password, email })
			setToken(res.data.token)
			return true
		} catch (error: any) {
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


