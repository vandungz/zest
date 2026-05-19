const API_URL = 'https://openlibrary.org/search.json?q=subject:fiction&limit=1000&fields=key,title,author_name,cover_i,subject,first_publish_year'

function transformBook(book, index) {
    return {
        id: book.key || `book-${index}`,
        title: book.title || 'Unknown Title',
        author: book.author_name?.[0] || 'Unknown Author',
        cover: `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`,
        category: book.subject?.[0]
            ?.replace(/, fiction/i, '')
            ?.replace(/--Fiction\./i, '')
            ?.trim()
            ?.slice(0, 30)
            || 'General',
        year: book.first_publish_year || 'N/A',
        price: +((book.cover_i % 100) + 4.99).toFixed(2),
    }
}

export async function fetchBook() {
    const res = await fetch(API_URL)
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
    const data = await res.json()
    return data.docs
        .filter(book => book.title && book.cover_i)
        .map(transformBook)
}