import { useState, useEffect } from "react";
import { fetchBook } from "../data/products";

const CACHE_KEY = 'zest-books-cache'
const CACHE_TTL = 1000 * 60 * 60 * 24 // 24h timestamp 

function readCache() {
    try {
        const raw = localStorage.getItem(CACHE_KEY)
        if (!raw) return null

        const { data, timestamp } = JSON.parse(raw)
        const isExpired = Date.now() - timestamp > CACHE_TTL

        if (isExpired) {
            localStorage.removeItem(CACHE_KEY)
            return null
        }

        return data
    } catch (error) {
        localStorage.removeItem(CACHE_KEY)
        return null
    }
}

function writeCache(data) {
    try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({
            data, timestamp: Date.now(),
        }))
    } catch {
        console.warn('Cache write failed')
    }
}

export function useBooks() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        async function loadBooks() {
            // Kiểm tra cache
            const cached = readCache()
            if (cached) {
                // Có cache thì dùng, không cần phải fetch API
                setProducts(cached)
                setLoading(false)
                return
            }

            // Không cache
            try {
                setLoading(true)
                const data = await fetchBook()

                // Lưu vào cache
                writeCache(data)
                setProducts(data)
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        loadBooks()
    }, [])

    

    // Trả về mọi thứ mà component cần
    return { products, loading, error }
}