import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import HomePage from './pages/HomePage'
import CartPersistenceBridge from './features/cart/CartPersistenceBridge'
import { Provider } from 'react-redux'
import { store } from './app/store'

function App() {
    return (
        <Provider store={store}>
            <ThemeProvider>
                <AuthProvider>
                    <CartPersistenceBridge />
                    <div className="min-h-screen bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] transition-colors duration-200">
                        <HomePage />
                    </div>
                </AuthProvider>
            </ThemeProvider>
        </Provider>
    )
}

export default App