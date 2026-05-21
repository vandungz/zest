import { createSlice } from '@reduxjs/toolkit'
import { fetchBooks } from './booksThunks'

const initialState = {
    items: [],
    status: 'idle', // idle | loading | succeeded | failed
    error: null,
}

const booksSlice = createSlice({
    name: 'books',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBooks.pending, (state) => {
                // Request bắt đầu; giữ items cũ cho đến khi fulfilled.
                state.status = 'loading'
                state.error = null
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                // Thay books bằng kết quả từ cache hoặc network.
                state.status = 'succeeded'
                state.items = action.payload
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                // Abort đưa về idle để lần mount sau re-fetch được.
                if (action.meta.aborted) {
                    state.status = 'idle'
                    return
                }

                // Lưu lỗi dễ đọc để UI render được thông báo.
                state.status = 'failed'
                state.error = action.error.message || 'Failed to load books'
            })
    },
})

export default booksSlice.reducer
