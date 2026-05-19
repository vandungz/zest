import { createContext, useContext, useState, useEffect } from "react";

// Tạo context object
const ThemeContext = createContext(null)

// Tạo Provider
export function ThemeProvider({ children }) {
    // Khởi tạo state từ localStorage nếu có, không thì mặc định 'light'
    // Lazy initial statte - chạy 1 lần lúc mount
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('zest-theme') || 'light'
    })

    // sync theme ra DOM và localStorage mỗi khi theme thay đổi
    // Side effect phải nằm trong useEffect - không viết trong render
    useEffect(() => {
        // Set data-theme lên <html> để CSS variables cascade toàn app
        document.documentElement.setAttribute('data-theme', theme)
        // Persist vào localStorage để giữ theme khi reload
        localStorage.setItem('zest-theme', theme)
    }, [theme]) // Chạy lại khi dep theme thay đổi

    // Toggle light/dark
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light')
    }

    // Value object để các component con đọc
    const value = {
        theme,                      // light | dark
        toggleTheme,                // function để toggle
        isDark: theme === 'dark',   // derived value trong component
    }

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

// Custom hook để consume (nhận) context
// -> Không cần import ThemeContext ở mọi nơi, chỉ cần import useTheme
export function useTheme() {
    const context = useContext(ThemeContext)

    // Phát hiện lỗi sớm trong dev
    if (context === null) {
        throw new Error('useTheme phải được dùng bên trong ThemeProvider')
    }

    return context
}