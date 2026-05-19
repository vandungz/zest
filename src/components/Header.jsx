import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import CartDrawer from './CartDrawer'
import LoginModal from './LoginModal'
import SideMenu from './SideMenu'
import Avatar from './common/Avatar'
import Button from './common/Button'

function IconSun() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4V2M12 20V22M6.41421 6.41421L5 5M17.728 17.728L19.1422 19.1422M4 12H2M20 12H22M17.7285 6.41421L19.1427 5M6.4147 17.728L5.00049 19.1422M12 17C9.23858 17 7 14.7614 7 12C7 9.23858 9.23858 7 12 7C14.7614 7 17 9.23858 17 12C17 14.7614 14.7614 17 12 17Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg> }
function IconMoon() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 6C9 10.9706 13.0294 15 18 15C18.9093 15 19.787 14.8655 20.6144 14.6147C19.4943 18.3103 16.0613 20.9999 12 20.9999C7.02944 20.9999 3 16.9707 3 12.0001C3 7.93883 5.69007 4.50583 9.38561 3.38574C9.13484 4.21311 9 5.09074 9 6Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg> }
function IconSearch() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25824)"><path d="M21 21L16.6569 16.6569M16.6569 16.6569C18.1046 15.2091 19 13.2091 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C13.2091 19 15.2091 18.1046 16.6569 16.6569Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2497_25824"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }
function IconMenu() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 17H21M3 12H21M3 7H21" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg> }
function IconUser() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M17.2166 19.3323C15.9349 17.9008 14.0727 17 12 17C9.92734 17 8.06492 17.9008 6.7832 19.3323M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21ZM12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></svg> }
function IconCart() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_26252)"><path d="M4 9H20L19.1654 18.1811C19.0717 19.2112 18.208 20 17.1736 20H6.82643C5.79202 20 4.92829 19.2112 4.83464 18.1811L4 9Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round" /><path d="M8 11V8C8 5.79086 9.79086 4 12 4C14.2091 4 16 5.79086 16 8V11" stroke="currentColor" stroke-width="2" stroke-linecap="round" /></g><defs><clipPath id="clip0_2497_26252"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }

export default function Header({ isLoginOpen = false, onLoginOpenChange }) {
    const { isDark, toggleTheme } = useTheme()
    const { user, isLoggedIn } = useAuth()
    const { totalItems } = useCart()

    // UI state - Header và các component children consumed
    const [isCartOpen, setIsCartOpen] = useState(false)
    const [isSideOpen, setIsSideOpen] = useState(false)

    // Lock body scrolling khi có overlay mở (một side effect)
    const isAnyOpen = isCartOpen || isLoginOpen || isSideOpen
    useEffect(() => {
        document.body.style.overflow = isAnyOpen ? 'hidden' : ''
        // Cleanup sau khi component unmount
        return () => { document.body.style.overflow = '' }
    }, [isAnyOpen])

    // ESC key đóng overlay
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') {
                setIsCartOpen(false)
                onLoginOpenChange?.(false)
                setIsSideOpen(false)
            }
        }
        document.addEventListener('keydown', handleEsc)
        // Cleanup event sau khi unmount
        return () => document.removeEventListener('keydown', handleEsc)
    }, [onLoginOpenChange])

    return (
        <>
            {/* ── HEADER BAR ───────────────────────────────────────── */}
            <header className="
                sticky top-0 z-40
                bg-[var(--color-bg-surface)]
                border-b border-[var(--color-border)]
                transition-colors duration-200
            ">
                <div className="max-w-screen-xl mx-auto px-6 h-14 flex items-center justify-between">

                    {/* LEFT — Hamburger */}
                    <button
                        aria-label="Open menu"
                        onClick={() => setIsSideOpen(true)}
                        className="p-2 -ml-2 text-[var(--color-text-primary)] hover:opacity-60 transition-opacity"
                    >
                        <IconMenu />
                    </button>

                    {/* CENTER*/}
                    <span className="
                        absolute left-1/2 -translate-x-1/2
                        text-lg font-black tracking-[0.25em] uppercase
                        text-[var(--color-text-primary)]
                        select-none
                    ">
                        ZEST
                    </span>

                    {/* RIGHT*/}
                    <div className="flex items-center gap-1">

                        {/* Theme Toggle */}
                        <button
                            aria-label="Toggle theme"
                            onClick={toggleTheme}
                            className="p-2 text-[var(--color-text-primary)] hover:opacity-60 transition-opacity"
                        >
                            {isDark ? <IconSun /> : <IconMoon />}
                        </button>

                        {/* Auth — Login button HOẶC Avatar tùy trạng thái */}
                        {isLoggedIn ? (
                            <button onClick={() => { }} aria-label="Account" className="ml-1">
                                <Avatar name={user.displayName} size="sm" />
                            </button>
                        ) : (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onLoginOpenChange?.(true)}
                                className="ml-1"
                            >
                                Login
                            </Button>
                        )}

                        {/* Cart Icon + Badge — luôn hiển thị */}
                        <button
                            aria-label={`Cart, ${totalItems} items`}
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-2 text-[var(--color-text-primary)] hover:opacity-60 transition-opacity"
                        >
                            <IconCart />
                            {totalItems > 0 && (
                                <span className="
                                    absolute -top-0.5 -right-0.5
                                    min-w-[18px] h-[18px] px-1
                                    bg-[var(--color-accent)]
                                    text-black text-[10px] font-bold
                                    rounded-full flex items-center justify-center
                                    leading-none
                                ">
                                    {totalItems > 99 ? '99+' : totalItems}
                                </span>
                            )}
                        </button>

                    </div>
                </div>
            </header>

            {/* ── OVERLAYS (render ngoài header flow) ─────────────── */}
            {/* Conditional rendering — chỉ mount khi cần, unmount khi đóng */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
            />
            <LoginModal
                isOpen={isLoginOpen}
                onClose={() => onLoginOpenChange?.(false)}
            />
            <SideMenu
                isOpen={isSideOpen}
                onClose={() => setIsSideOpen(false)}
                onLoginClick={() => onLoginOpenChange?.(true)}
            />
        </>
    )
}