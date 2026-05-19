import { memo, useState, useCallback } from 'react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Avatar from './common/Avatar'
import Button from './common/Button'
import Badge from './common/Badge'

// React.memo wrap toàn bộ component
// Chỉ re-render khi prop "book" thay đổi reference
// Khi search/filter -> card không match vẫn giữ nguyên output cũ
const ProductCard = memo(function ProductCard({ book, onLoginRequired }) {
    const { addItem, items } = useCart()
    const { isLoggedIn } = useAuth()

    // Kiểm tra book đã có trong cart chưa (derived state)
    // Logic đơn giản nên không cần useMemo
    const cartItem = items.find(i => i.id === book.id)
    const inCart = Boolean(cartItem)
    const quantity = cartItem?.quantity ?? 0
    const [imgError, setImgError] = useState(false)

    // useCallback - tránh tạo function mới mỗi khi re-render card
    const handleAdd = useCallback(() => {
        // Guard: chưa login → mở LoginModal thay vì add
        if (!isLoggedIn) {
            onLoginRequired?.()  // callback từ parent để mở LoginModal
            return
        }
        addItem(book)
    }, [isLoggedIn, addItem, book, onLoginRequired])

    return (
        <article className="
            group flex flex-col
            bg-[var(--color-bg-surface)]
            border border-[var(--color-border)]
            transition-all duration-200
            hover:border-[var(--color-text-secondary)]
            hover:shadow-sm
        ">
            {/* ── COVER IMAGE ─────────────────────────────────── */}
            <div className="
                relative overflow-hidden
                bg-[var(--color-bg-muted)]
                aspect-[2/3]
            ">
                {!imgError ? (
                    <img
                        src={book.cover}
                        alt={`Cover of ${book.title}`}
                        loading="lazy"
                        onError={() => setImgError(true)}
                        className="
                            w-full h-full object-cover
                            transition-transform duration-300
                            group-hover:scale-[1.02]
                        "
                    />
                ) : (
                    // Fallback khi ảnh không load được
                    <div className="
                        w-full h-full flex flex-col items-center justify-center gap-2
                        text-[var(--color-text-secondary)]
                    ">
                        <span className="text-3xl">📖</span>
                        <span className="text-xs text-center px-2 line-clamp-2">
                            {book.title}
                        </span>
                    </div>
                )}

                {/* In cart badge */}
                {inCart && (
                    <div className="
                        absolute top-2 right-2
                        bg-[var(--color-accent)]
                        text-black text-[10px] font-bold
                        px-2 py-0.5 
                    ">
                        IN CART {quantity > 1 && `×${quantity}`}
                    </div>
                )}
            </div>

            {/* ── INFO ────────────────────────────────────────── */}
            <div className="flex flex-col flex-1 p-3 gap-1">
                {/* Category */}
                <Badge>{book.category}</Badge>

                {/* Title */}
                <h3 className="
                    text-sm font-semibold leading-snug
                    text-[var(--color-text-primary)]
                    line-clamp-2 flex-1
                ">
                    {book.title}
                </h3>

                {/* Author */}
                <p className="
                    text-xs text-[var(--color-text-secondary)]
                    truncate
                ">
                    {book.author}
                </p>

                {/* Price + Add to Cart */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-[var(--color-border)]">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        ${book.price}
                    </span>

                    <button
                        onClick={handleAdd}
                        aria-label={`Add ${book.title} to cart`}
                        className="
                            px-3 py-1.5
                            text-xs font-semibold tracking-wide
                            border border-[var(--color-text-primary)]
                            text-[var(--color-text-primary)]
                            bg-transparent
                            transition-all duration-150
                            hover:bg-[var(--color-accent)]
                            hover:border-[var(--color-accent)]
                            hover:text-black
                            active:scale-95
                        ">
                        {inCart ? 'Add More' : 'Add to Cart'}
                    </button>
                </div>
            </div>
        </article>
    )
})

// memo() wrap function làm mất tên
// Dùng displayName để set name ProductCard cho React thấy
ProductCard.displayName = 'ProductCart'

export default ProductCard