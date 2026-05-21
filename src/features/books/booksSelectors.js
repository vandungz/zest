export const selectBooks = (state) => state.books.items

export const selectBooksStatus = (state) => state.books.status

export const selectBooksError = (state) => state.books.error

export const selectBooksLoading = (state) => state.books.status === 'loading'