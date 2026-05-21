import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from '../../context/AuthContext'
import { loadCart } from './cartSlice'
import { selectCartItems } from './cartSelectors'

export default function CartPersistenceBridge() {
    const dispatch = useDispatch()
    const { user } = useAuth()
    const items = useSelector(selectCartItems)
    const skipNextSaveForKeyRef = useRef(null)

    const cartKey = user ? `zest-cart-${user.id}` : 'zest-cart-guest'

    useEffect(() => {
        skipNextSaveForKeyRef.current = cartKey

        try {
            const stored = localStorage.getItem(cartKey)
            const items = stored ? JSON.parse(stored).items ?? [] : []

            dispatch(loadCart(items))
        } catch {
            dispatch(loadCart([]))
        }
    }, [dispatch, cartKey])

    useEffect(() => {
        if (skipNextSaveForKeyRef.current === cartKey) {
            skipNextSaveForKeyRef.current = null
            return
        }

        localStorage.setItem(cartKey, JSON.stringify({ items }))
    }, [cartKey, items])

    return null
}