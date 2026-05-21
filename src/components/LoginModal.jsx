import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import Button from "./common/Button";

function IconClose() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25965)"><path d="M7 7L17 17M7 17L17 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2497_25965"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }
function IconEye({ open }) {
    return open ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2497_25827)">
                <path d="M15 12C15 13.6569 13.6569 15 12 15C10.3431 15 9 13.6569 9 12C9 10.3431 10.3431 9 12 9C13.6569 9 15 10.3431 15 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M2 12C3.60014 7.90264 7.33603 5 12 5C16.664 5 20.3999 7.90264 22 12C20.3999 16.0974 16.664 19 12 19C7.33603 19 3.60014 16.0974 2 12Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </g>
            <defs>
                <clipPath id="clip0_2497_25827">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    ) : (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_2497_25828)">
                <path d="M10.7302 5.07319C11.1448 5.02485 11.5684 5 11.9999 5C16.6639 5 20.3998 7.90264 21.9999 12C21.6053 13.0104 21.0809 13.9482 20.4446 14.7877M6.51956 6.51944C4.47949 7.76406 2.90105 9.69259 1.99994 12C3.60008 16.0974 7.33597 19 11.9999 19C14.0375 19 15.8979 18.446 17.4805 17.4804M9.87871 9.87859C9.33576 10.4215 8.99994 11.1715 8.99994 12C8.99994 13.6569 10.3431 15 11.9999 15C12.8284 15 13.5785 14.6642 14.1214 14.1212" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M4 4L20 20" stroke="black" stroke-width="2" stroke-linecap="round" />
            </g>
            <defs>
                <clipPath id="clip0_2497_25828">
                    <rect width="24" height="24" fill="white" />
                </clipPath>
            </defs>
        </svg>
    )
}

export default function LoginModal({ isOpen, onClose }) {
    const { login, authError, clearError } = useAuth()

    // Controlled form state
    // Với mỗi field là 1 state riêng
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)

    // useRef để focus email input khi modal mở
    const emailRef = useRef(null)

    // Reset form khi modal đóng
    // Side effect đồng bộ UI state với isOpen prop
    /* eslint-disable react-hooks/set-state-in-effect */
    useEffect(() => {
        if (!isOpen) {
            setEmail('')
            setPassword('')
            setShowPass(false)
            setIsSubmitting(false)
            clearError()
        }
    }, [isOpen, clearError])
    /* eslint-enable react-hooks/set-state-in-effect */

    // Auto focus email input khi modal mở
    useEffect(() => {
        if (isOpen) {
            // setTimeout 0 đảm bảo animation chạy xong trước khi focus
            const t = setTimeout(() => emailRef.current?.focus(), 100)
            return () => clearTimeout(t)
        }
    }, [isOpen])

    // Form submit handler
    // useCallback để không tạo mới mỗi render
    const handleSubmit = useCallback((e) => {
        e.preventDefault() // ngăn page reload do default của form
        if (!email.trim() || !password) return

        setIsSubmitting(true)
        const success = login(email.trim(), password)

        if (success) {
            onClose()
        } else {
            setIsSubmitting(false)
        }
    }, [email, password, login, onClose])

    // Derived state - disable button khi form chưa đủ
    const isFormValid = email.trim().length > 0 && password.length > 0

    return (
        <>
            {/* ── OVERLAY ─────────────────────────────────────── */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className={`
          fixed inset-0 z-50
          bg-black transition-opacity duration-300
          ${isOpen
                        ? 'opacity-40 pointer-events-auto'
                        : 'opacity-0 pointer-events-none'
                    }
        `}
            />

            {/* ── MODAL PANEL ─────────────────────────────────── */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label="Login to Zest"
                className={`
          fixed inset-0 z-50
          flex items-center justify-center
          pointer-events-none
        `}
            >
                <div className={`
          relative w-full max-w-md mx-4
          bg-[var(--color-bg-surface)]
          border border-[var(--color-border)]
          p-8
          pointer-events-auto
          transition-all duration-300
          ${isOpen
                        ? 'opacity-100 translate-y-0 pointer-events-auto'
                        : 'opacity-0 translate-y-4 pointer-events-none'  // ← thêm pointer-events-none
                    }
        `}>

                    {/* Close button */}
                    <button
                        onClick={onClose}
                        aria-label="Close login modal"
                        className="
              absolute top-4 right-4 p-1.5
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-text-primary)]
              transition-colors
            "
                    >
                        <IconClose />
                    </button>

                    {/* ── HEADER ────────────────────────────────── */}
                    <div className="mb-8 text-center">
                        <h2 className="text-xl font-black tracking-tight text-[var(--color-text-primary)]">
                            Login to Zest
                        </h2>
                        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)]">
                            Access your account to continue
                        </p>
                    </div>

                    {/* ── FORM ──────────────────────────────────── */}
                    {/* onSubmit trên form → Enter key cũng submit được */}
                    <form onSubmit={handleSubmit} noValidate className="space-y-4">

                        {/* Email field */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="email"
                                className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-text-primary)]"
                            >
                                Email
                            </label>
                            <input
                                ref={emailRef}
                                id="email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                autoComplete="email"
                                required
                                className="
                  w-full px-4 py-3
                  bg-[var(--color-bg-primary)]
                  border border-[var(--color-border)]
                  text-sm text-[var(--color-text-primary)]
                  placeholder:text-[var(--color-text-secondary)]
                  outline-none
                  focus:border-[var(--color-text-primary)]
                  transition-colors duration-150
                "
                            />
                        </div>

                        {/* Password field */}
                        <div className="space-y-1.5">
                            <label
                                htmlFor="password"
                                className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-text-primary)]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    className="
                    w-full px-4 py-3 pr-12
                    bg-[var(--color-bg-primary)]
                    border border-[var(--color-border)]
                    text-sm text-[var(--color-text-primary)]
                    placeholder:text-[var(--color-text-secondary)]
                    outline-none
                    focus:border-[var(--color-text-primary)]
                    transition-colors duration-150
                  "
                                />
                                {/* Eye toggle */}
                                <button
                                    type="button"
                                    onClick={() => setShowPass(p => !p)}
                                    aria-label={showPass ? 'Hide password' : 'Show password'}
                                    className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    p-1
                    text-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    transition-colors
                  "
                                >
                                    <IconEye open={showPass} />
                                </button>
                            </div>
                        </div>

                        {/* Auth Error */}
                        {authError && (
                            <p
                                role="alert"
                                className="
                  text-xs text-red-500
                  px-3 py-2
                  bg-red-50 dark:bg-red-950/20
                  border border-red-200 dark:border-red-900
                "
                            >
                                {authError}
                            </p>
                        )}

                        {/* Submit button */}
                        <Button
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            disabled={!isFormValid || isSubmitting}
                        >
                            {isSubmitting ? 'Logging in...' : 'Login'}
                        </Button>

                    </form>

                    {/* ── HINT ──────────────────────────────────── */}
                    <div className="
            mt-6 pt-5
            border-t border-[var(--color-border)]
            space-y-1
          ">
                        <p className="text-[11px] text-[var(--color-text-secondary)] font-medium">
                            Test accounts:
                        </p>
                        {[
                            ['dung@zest.com', '123456'],
                            ['admin@zest.com', 'admin123'],
                            ['test@zest.com', 'test123'],
                        ].map(([e, p]) => (
                            <button
                                key={e}
                                type="button"
                                onClick={() => { setEmail(e); setPassword(p) }}
                                className="
                  block w-full text-left
                  text-[11px] text-[var(--color-text-secondary)]
                  hover:text-[var(--color-text-primary)]
                  transition-colors font-mono
                "
                            >
                                {e} / {p}
                            </button>
                        ))}
                    </div>

                </div>
            </div>
        </>
    )
}
