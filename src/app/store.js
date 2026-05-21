import { configureStore } from '@reduxjs/toolkit'
import cartReducer from '../features/cart/cartSlice'
import booksReducer from '../features/books/booksSlice'

export const store = configureStore({
    reducer: {
        cart: cartReducer,
        books: booksReducer,
    },
})