import { useState, useEffect } from 'react'

// Custom Hook: trì hoãn update value cho đến khi user dừng thay đổi
export function useDebounce(value, delay = 300) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        // Cleanup; Bắt đầu lại timer mới (debounce)
        return () => clearTimeout(timer)
    }, [value, delay])

    return debouncedValue
}