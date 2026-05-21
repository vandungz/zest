import { useCallback } from "react";
import { useDispatch, useSelector } from 'react-redux'
import { selectCartItems, selectSubtotal, selectIsCartEmpty, selectTotalItems } from '../features/cart/cartSelectors'
import { removeItem, increaseQuantity, decreaseQuantity, clearCart } from '../features/cart/cartSlice'
import Button from "./common/Button";

function IconClose() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25965)"><path d="M7 7L17 17M7 17L17 7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2497_25965"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }
function IconShipping() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_26262)"><path d="M2 3V2C1.44772 2 1 2.44772 1 3H2ZM13 3H14C14 2.44772 13.5523 2 13 2V3ZM13 9V8C12.7348 8 12.4804 8.10536 12.2929 8.29289C12.1054 8.48043 12 8.73478 12 9H13ZM2 4H13V2H2V4ZM12 3V19H14V3H12ZM3 17V3H1V17H3ZM13 10H18V8H13V10ZM21 13V17H23V13H21ZM14 19L14 9H12L12 19H14ZM18.7071 19.7071C18.3166 20.0976 17.6834 20.0976 17.2929 19.7071L15.8787 21.1213C17.0503 22.2929 18.9497 22.2929 20.1213 21.1213L18.7071 19.7071ZM17.2929 18.2929C17.6834 17.9024 18.3166 17.9024 18.7071 18.2929L20.1213 16.8787C18.9497 15.7071 17.0503 15.7071 15.8787 16.8787L17.2929 18.2929ZM6.70711 19.7071C6.31658 20.0976 5.68342 20.0976 5.29289 19.7071L3.87868 21.1213C5.05025 22.2929 6.94975 22.2929 8.12132 21.1213L6.70711 19.7071ZM5.29289 18.2929C5.68342 17.9024 6.31658 17.9024 6.70711 18.2929L8.12132 16.8787C6.94975 15.7071 5.05025 15.7071 3.87868 16.8787L5.29289 18.2929ZM18.7071 18.2929C18.9026 18.4884 19 18.7425 19 19H21C21 18.2338 20.7069 17.4643 20.1213 16.8787L18.7071 18.2929ZM19 19C19 19.2575 18.9026 19.5116 18.7071 19.7071L20.1213 21.1213C20.7069 20.5357 21 19.7662 21 19H19ZM16 18H13V20H16V18ZM17.2929 19.7071C17.0974 19.5116 17 19.2575 17 19H15C15 19.7662 15.2931 20.5357 15.8787 21.1213L17.2929 19.7071ZM17 19C17 18.7425 17.0974 18.4884 17.2929 18.2929L15.8787 16.8787C15.2931 17.4643 15 18.2338 15 19H17ZM5.29289 19.7071C5.09744 19.5116 5 19.2575 5 19H3C3 19.7662 3.29309 20.5357 3.87868 21.1213L5.29289 19.7071ZM5 19C5 18.7425 5.09744 18.4884 5.29289 18.2929L3.87868 16.8787C3.29309 17.4643 3 18.2338 3 19H5ZM13 18H8V20H13V18ZM6.70711 18.2929C6.90256 18.4884 7 18.7425 7 19H9C9 18.2338 8.70691 17.4643 8.12132 16.8787L6.70711 18.2929ZM7 19C7 19.2575 6.90256 19.5116 6.70711 19.7071L8.12132 21.1213C8.70691 20.5357 9 19.7662 9 19H7ZM21 17C21 17.5523 20.5523 18 20 18V20C21.6569 20 23 18.6569 23 17H21ZM18 10C19.6569 10 21 11.3431 21 13H23C23 10.2386 20.7614 8 18 8V10ZM1 17C1 18.6569 2.34315 20 4 20V18C3.44772 18 3 17.5523 3 17H1Z" fill="black" /><path d="M2 8H5" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /><path d="M2 12H7" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2497_26262"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }
function IconPlus() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M12 5v14M5 12h14" /></svg> }
function IconMinus() { return <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" d="M5 12h14" /></svg> }

function CartItem({ item, onIncrease, onDecrease, onRemove }) {
    return (
        <div className="flex gap-3 py-4 border-b border-[var(--color-border)] last:border-0">
            {/* Cover */}
            <div className="w-14 h-20 flex-shrink-0 bg-[var(--color-bg-muted)] overflow-hidden">
                <img
                    src={item.cover}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    onError={e => { e.target.style.display = 'none' }}
                />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col gap-1">
                {/* Title + Remove */}
                <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-semibold leading-snug text-[var(--color-text-primary)] line-clamp-2 flex-1">
                        {item.title}
                    </h4>
                    <button
                        onClick={() => onRemove(item.id)}
                        aria-label={`Remove ${item.title}`}
                        className="flex-shrink-0 p-0.5 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                        <IconClose />
                    </button>
                </div>

                {/* Author */}
                <p className="text-[11px] text-[var(--color-text-secondary)] truncate">
                    {item.author}
                </p>

                {/* Price + Quantity controls */}
                <div className="flex items-center justify-between mt-auto pt-1">
                    <span className="text-sm font-bold text-[var(--color-text-primary)]">
                        ${(item.price * item.quantity).toFixed(2)}
                    </span>

                    {/* Quantity control */}
                    <div className="flex items-center border border-[var(--color-border)]">
                        <button
                            onClick={() => onDecrease(item.id)}
                            aria-label="Decrease quantity"
                            className="w-7 h-7 flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-muted)] hover:text-[var(--color-text-primary)] transition-colors">
                            <IconMinus />
                        </button>

                        <span className="
                            w-8 h-7 flex items-center justify-center
                            text-xs font-semibold text-[var(--color-text-primary)]
                            border-x border-[var(--color-border)]
                        ">
                            {item.quantity}
                        </span>

                        <button
                            onClick={() => onIncrease(item.id)}
                            aria-label="Increase quantity"
                            className="
                                w-7 h-7 flex items-center justify-center
                                text-[var(--color-text-secondary)]
                                hover:bg-[var(--color-bg-muted)]
                                hover:text-[var(--color-text-primary)]
                                transition-colors
                            ">
                            <IconPlus />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function CartDrawer({ isOpen, onClose }) {
    const dispatch = useDispatch()
    const items = useSelector(selectCartItems)
    const subtotal = useSelector(selectSubtotal)
    const isEmpty = useSelector(selectIsCartEmpty)
    const totalItems = useSelector(selectTotalItems)

    // useCallback - stable reference để CartItem không re-render thừa
    const handleIncrease = useCallback((id) => dispatch(increaseQuantity(id)), [dispatch])
    const handleDecrease = useCallback((id) => dispatch(decreaseQuantity(id)), [dispatch])
    const handleRemove = useCallback((id) => dispatch(removeItem(id)), [dispatch])
    const handleClear = useCallback(() => dispatch(clearCart()), [dispatch])

    return (
        <>
            {/* ── OVERLAY ─────────────────────────────────────── */}
            {/* Fade in/out bằng opacity + pointer-events */}
            <div
                aria-hidden="true"
                onClick={onClose}
                className={`
                    fixed inset-0 z-50
                    bg-black transition-opacity duration-300
                    ${isOpen ? 'opacity-40 pointer-events-auto' : 'opacity-0 pointer-events-none'}
                `}
            />

            {/* ── DRAWER PANEL ────────────────────────────────── */}
            {/* Slide in từ phải bằng translateX */}
            <div
                role="dialog"
                aria-label="Shopping cart"
                aria-modal="true"
                className={`
                    fixed top-0 right-0 z-50
                    w-full sm:w-96
                    h-full
                    bg-[var(--color-bg-surface)]
                    border-l border-[var(--color-border)]
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* ── HEADER ──────────────────────────────────── */}
                <div className="
                    flex items-center justify-between
                    px-6 py-4
                    border-b border-[var(--color-border)]
                    flex-shrink-0
                ">
                    <h2 className="text-xs font-bold tracking-[0.2em] uppercase text-[var(--color-text-primary)]">
                        Your Cart {totalItems > 0 && `(${totalItems})`}
                    </h2>
                    <button
                        onClick={onClose}
                        aria-label="Close cart"
                        className="
                            p-1.5
                            text-[var(--color-text-secondary)]
                            hover:text-[var(--color-text-primary)]
                            transition-colors
                        ">
                        <IconClose />
                    </button>
                </div>

                {/* ── BODY ────────────────────────────────────── */}
                <div className="flex-1 overflow-y-auto px-6">
                    {isEmpty ? (
                        // Empty state
                        <div className="
                            h-full flex flex-col items-center justify-center gap-3
                            text-[var(--color-text-secondary)]
                        ">
                            <p className="text-sm font-medium">Your cart is empty</p>
                            <p className="text-xs opacity-60">Add some books to get started</p>
                            <Button variant="outline" onClick={onClose} className="mt-4">
                                Continue Shopping
                            </Button>
                        </div>
                    ) : (
                        // Cart items list
                        <div className="py-2">
                            {items.map(item => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onIncrease={handleIncrease}
                                    onDecrease={handleDecrease}
                                    onRemove={handleRemove}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── FOOTER ──────────────────────────────────── */}
                {!isEmpty && (
                    <div className="
                        flex-shrink-0 px-6 py-5
                        border-t border-[var(--color-border)]
                        space-y-3
                        bg-[var(--color-bg-surface)]
                    ">
                        {/* Subtotal */}
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold tracking-[0.1em] uppercase text-[var(--color-text-secondary)]">
                                Subtotal
                            </span>
                            <span className="text-base font-bold text-[var(--color-text-primary)]">
                                ${subtotal.toFixed(2)}
                            </span>
                        </div>

                        {/* Checkout button */}
                        <Button variant="primary" fullWidth size="lg">
                            View Cart & Checkout
                        </Button>

                        {/* Clear cart button */}
                        <Button variant="secondary" fullWidth size="lg" onClick={handleClear}>
                            Clear Cart
                        </Button>

                        {/* Shipping note */}
                        <div className="flex items-center gap-2 text-[var(--color-text-secondary)]">
                            <IconShipping />
                            <p className="text-[11px]">Free shipping on orders over $50.</p>
                        </div>
                    </div>
                )}
            </div>
        </>
    )
}