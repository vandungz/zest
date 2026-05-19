import { useAuth } from '../context/AuthContext'
import Avatar from './common/Avatar'
import Button from './common/Button'

function IconClose() {
    return (
        <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" d="M18 6 6 18M6 6l12 12" />
        </svg>
    )
}

export default function SideMenu({ isOpen, onClose, onLoginClick }) {
    const { user, isLoggedIn, logout } = useAuth()

    const handleLogout = () => {
        logout()
        onClose()
    }

    const handleLoginClick = () => {
        onClose()      // đóng SideMenu trước
        onLoginClick() // mở LoginModal sau
    }

    // Nav items — chỉ render những gì cần
    const navItems = [
        { label: 'Home', onClick: onClose },
        { label: 'Shop', onClick: onClose },
    ]

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

            {/* ── SIDE PANEL ──────────────────────────────────── */}
            <div
                role="dialog"
                aria-label="Navigation menu"
                aria-modal="true"
                className={`
          fixed top-0 left-0 z-50
          w-72 h-full
          bg-[var(--color-bg-surface)]
          border-r border-[var(--color-border)]
          flex flex-col
          transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
            >
                {/* ── HEADER ──────────────────────────────────── */}
                <div className="
          flex items-center justify-between
          px-6 py-4
          border-b border-[var(--color-border)]
          flex-shrink-0
        ">
                    <span className="text-base font-black tracking-[0.25em] uppercase text-[var(--color-text-primary)]">
                        ZEST
                    </span>
                    <button
                        onClick={onClose}
                        aria-label="Close menu"
                        className="
              p-1.5
              text-[var(--color-text-secondary)]
              hover:text-[var(--color-text-primary)]
              transition-colors
            "
                    >
                        <IconClose />
                    </button>
                </div>

                {/* ── USER STATUS ─────────────────────────────── */}
                {isLoggedIn && (
                    <div className="
            px-6 py-4
            border-b border-[var(--color-border)]
            flex items-center gap-3
          ">
                        {/* Avatar */}
                        <Avatar name={user.displayName} size="md" />
                        <div className="min-w-0">
                            <p className="text-sm font-semibold text-[var(--color-text-primary)] truncate">
                                {user.displayName}
                            </p>
                            <p className="text-xs text-[var(--color-text-secondary)] truncate">
                                {user.email}
                            </p>
                        </div>
                    </div>
                )}

                {/* ── NAV ITEMS ───────────────────────────────── */}
                <nav className="flex-1 px-2 py-3">
                    {navItems.map(item => (
                        <button
                            key={item.label}
                            onClick={item.onClick}
                            className="
                w-full text-left
                px-4 py-3
                text-sm font-medium
                text-[var(--color-text-primary)]
                border-b border-[var(--color-border)]
                hover:bg-[var(--color-bg-muted)]
                transition-colors duration-150
              "
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>

                {/* ── FOOTER — Login / Logout ──────────────────── */}
                <div className="
                    flex-shrink-0 px-2 py-4
                    border-t border-[var(--color-border)]
                ">
                    {isLoggedIn ? (
                        <Button variant="danger" fullWidth onClick={handleLogout} className="justify-start">
                            Logout
                        </Button>
                    ) : (
                        <Button variant="ghost" fullWidth onClick={handleLoginClick} className="justify-start">
                            Login
                        </Button>
                    )}
                </div>

            </div>
        </>
    )
}