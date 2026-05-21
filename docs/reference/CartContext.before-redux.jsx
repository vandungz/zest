/* eslint-disable */
// Historical reference only.
// This was the cart Context implementation before the Redux Toolkit migration.
// Do not import this file into app runtime code.

import { createContext, useContext, useReducer, useEffect, useMemo } from "react";
import { useAuth } from "./AuthContext";

const initialState = {
    items: [], // [{ id, title, author, cover, price, quantity }]
}

// (state, action) -> newState
// Không mutate state cũ
function cartReducer(state, action) {
    switch (action.type) {
        case 'ADD_ITEM': {
            const exists = state.items.find(
                item => item.id === action.payload.id
            )

            if (exists) {
                // Tăng quantity (immutable)
                return {
                    ...state,
                    items: state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    ),
                }
            }

            return {
                ...state,
                items: [...state.items, { ...action.payload, quantity: 1}]
            }
        }

        case 'REMOVE_ITEM': {
            // payload = id của item cần xóa
            return {
                ...state,
                items: state.items.filter(item => item.id !== action.payload)
            }
        }

        case 'INCREASE_QUANTITY': {
            return {
                ...state,
                items: state.items.map(item =>
                    item.id === action.payload
                        ? { ...item, quantity: item.quantity + 1}
                        : item
                )
            }
        }

        case 'DECREASE_QUANTITY': {
            // Quantity !< 1
            // Quantity == 1 và decrease -> remove item
            return {
                ...state, 
                items: state.items
                    .map(item =>
                        item.id === action.payload
                            ? { ...item, quantity: item.quantity - 1}
                            : item
                    )
                    .filter (item => item.quantity > 0)
            }
        }

        case 'CLEAR_CART': {
            return { ...state, items: []}
        }

        case 'LOAD_CART': {
            return { ...state, items: action.payload }
        }

        default: return state
    }
}

const CartContext = createContext(null)

export function CartProvider({ children }) {
    const { user } = useAuth()

    const cartKey = user ? `zest-cart-${user.id}` : `zest-cart-guest`

    const [state, dispatch] = useReducer(cartReducer, initialState)

    useEffect(() => {
        try {
            const stored = localStorage.getItem(cartKey)
            const items = stored ? JSON.parse(stored).items ?? [] : []

            dispatch({ type: 'LOAD_CART', payload: items })
        } catch {
            dispatch({ type: 'LOAD_CART', payload: [] })
        }
    }, [cartKey])

    // sync cart vào localStorage
    useEffect(() => {
        localStorage.setItem(cartKey, JSON.stringify(state))
    }, [state, cartKey])

    // useMemo tính derived data - chỉ tính lại khi items thay đổi
    const totalItems = useMemo(
        () => state.items.reduce((sum, item) => sum + item.quantity, 0),
        [state.items]
    )

    const subtotal = useMemo(
        () => state.items.reduce((sum, item) => sum + item.price * item.quantity, 0),
        [state.items]
    )

    // Wrap các dispatch để component không cần biết action type
    const addItem = (book) => dispatch({ type: 'ADD_ITEM', payload: book})
    const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id})
    const increase = (id) => dispatch({ type: 'INCREASE_QUANTITY', payload: id})
    const decrease = (id) => dispatch({ type: 'DECREASE_QUANTITY', payload: id})
    const clearCart = () => dispatch({ type: 'CLEAR_CART' })

    const value = {
        items: state.items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        increase,
        decrease,
        clearCart,
        isEmpty: state.items.length === 0,
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}


// Consumer hook
export function useCart() {
    const context = useContext(CartContext)
    if (context === null) {
        throw new Error('useCart phải được dùng bên trong CartProvider')
    }
    return context
}
