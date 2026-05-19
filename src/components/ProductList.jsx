import { memo } from 'react'
import ProductCard from './ProductCard'

// memo - chỉ re-render khi books array thay đổi reference
const ProductList = memo(function ProductList({ books, onLoginRequired }) {
    if (books.length === 0) {
        return (
            <div className="
                flex flex-col items-center justify-center
                py-24 text-[var(--color-text-secondary)]
            ">
                <p className="text-sm font-medium">No books found</p>
                <p className="text-xs mt-1 opacity-60">Try a different search term</p>
            </div>
        )
    }

    return (
        // Grid 5-6 columns — khớp mockup
        <div className="
            grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
            lg:grid-cols-5 xl:grid-cols-6 gap-4
        ">
            {books.map(book => (
                // key = book.id (stable) — không dùng index
                // Stable key → React reuse DOM node thay vì tạo mới
                <ProductCard key={book.id} book={book} onLoginRequired={onLoginRequired} />
            ))}
        </div>
    )
})

ProductList.displayName = 'ProductList'
export default ProductList