import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import HomePage from './pages/HomePage'

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <CartProvider>
                    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200">
                        <HomePage />
                    </div>
                </CartProvider>
            </AuthProvider>
        </ThemeProvider>
    )
}

export default App