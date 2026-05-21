import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
}

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addItem: (state, action) => {
            const exists = state.items.find(
                item => item.id === action.payload.id
            )

            if (exists) {
                exists.quantity += 1
            } else {
                state.items.push({ ...action.payload, quantity: 1 })
            }
        },

        removeItem: (state, action) => {
            state.items = state.items.filter(item => item.id !== action.payload)
        },

        increaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload)

            if (item) {
                item.quantity += 1
            }
        },

        decreaseQuantity: (state, action) => {
            const item = state.items.find(item => item.id === action.payload)

            if (!item) {
                return
            }
            
            item.quantity -= 1

            if (item.quantity <= 0) {
                state.items = state.items.filter(item => item.id !== action.payload)
            }
        },

        clearCart: (state) => {
            state.items = []
            return
        },

        loadCart: (state, action) => {
            state.items = action.payload
            return
        }
    }
})

export const { addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart, loadCart } = cartSlice.actions
export default cartSlice.reducer