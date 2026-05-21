/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import { USERS_DB } from "../data/users";

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    // Lazy Initial State
    // try/catch trường hợp JSON bị corrupt
    const [user, setUser] = useState(() => {
        try {
            return JSON.parse(localStorage.getItem('zest-user'))
        } catch {
            return null
        }
    })

    // State lưu lỗi login
    const [authError, setAuthError] = useState(null)

    // sync user đến localStorage mỗi khi user thay đổi
    useEffect(() => {
        if (user) {
            localStorage.setItem('zest-user', JSON.stringify(user))
        } else {
            localStorage.removeItem('zest-user')
        }
    }, [user])

    const login = (email, password) => {
        // Reset thông báo lỗi trước khi validate
        setAuthError(null)

        // Validate
        if (!email || !password) {
            setAuthError('Vui lòng nhập email và password')
            return false
        }

        // Find user trong db
        const found = USERS_DB.find(
            user => user.email.toLowerCase() === email.toLowerCase().trim()
                && user.password === password
        )

        if (!found) {
            setAuthError('Email hoặc password không đúng')
            return false
        }

        // Lưu user vào localStorage, không lưu password
        const safeUser = { ...found }
        delete safeUser.password
        setUser(safeUser)
        return true
    }

    const logout = () => {
        setUser(null)
        setAuthError(null)
    }

    const clearError = () => setAuthError(null)

    const value = {
        user,
        login,
        logout,
        authError,
        clearError,
        isLoggedIn: user !== null,
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (context === null) {
        throw new Error('useAuth phải được dùng bên trong AuthProvider')
    }
    return context
}
