import { createAsyncThunk } from '@reduxjs/toolkit'
import { fetchBook } from '../../data/products'
import { readBooksCache, writeBooksCache } from './booksCache'

export const fetchBooks = createAsyncThunk(
    'books/fetchBooks',
    async () => {
        // Ưu tiên cache để giữ hành vi cũ của useBooks.
        const cached = readBooksCache()
        if (cached) {
            return cached
        }

        // Không có cache hoặc cache hết hạn thì fetch từ Open Library.
        const data = await fetchBook()

        // Cache là side effect, nhưng được cô lập trong thunk/service.
        writeBooksCache(data)

        return data
    }
)
