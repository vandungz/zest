import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBook } from '../../data/products'
import { readBooksCache, writeBooksCache } from './booksCache'

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async (_, { signal }) => {
        // Ưu tiên cache để giữ hành vi cũ của useBooks.
        const cached = readBooksCache()
        if (cached) {
            return cached
        }

        // Truyền signal xuống fetch để Redux thunk có thể abort request.
        const data = await fetchBook(signal)

        // Cache là side effect, nhưng được cô lập trong thunk/service.
        writeBooksCache(data)

        return data
    },
    {
        condition: (_, { getState }) => {
            const { books } = getState()

            // Chỉ cho phép fetch khi books chưa bắt đầu reload.
            // Guard này bảo vệ cả app, không riêng HomePage
            return books.status === 'idle'
        }
    }
)
