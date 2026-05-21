const CACHE_KEY = 'zest-books-cache'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24 giờ

export function readBooksCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null

        const { data, timestamp } = JSON.parse(raw)

        // Cache quá hạn thì xóa để lần này fetch lại từ API.
        if (Date.now() - timestamp > CACHE_TTL) {
            localStorage.removeItem(CACHE_KEY)
            return null
        }

        return data
    } catch {
        // Cache hỏng không được làm app crash.
        localStorage.removeItem(CACHE_KEY)
        return null
    }
}

export function writeBooksCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data,
            timestamp: Date.now(),
        }))
    } catch {
        // Ghi cache lỗi không nghiêm trọng; dữ liệu fetch vẫn render được.
        console.warn('Books cache write failed')
    }
}
