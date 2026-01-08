import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

/**
 * Korumalı Rota Bileşeni
 * 
 * İçeriğindeki bileşenleri sadece giriş yapmış kullanıcıların görmesini sağlar.
 * Giriş yapılmamışsa login sayfasına yönlendirir.
 */
export const Protected: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const { token } = useAuth()
	const location = useLocation()
	if (!token) return <Navigate to="/login" replace state={{ from: location }} />
	return <>{children}</>
}


