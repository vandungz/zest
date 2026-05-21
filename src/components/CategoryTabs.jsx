import { memo } from 'react'

const CATEGORIES = [
  'All',
  'Fiction',
  'Business',
  'Design',
  'Science',
  'Technology',
  'Self-Growth',
  'History',
]

// Memo - chỉ re-render khi activeCategory hoặc onChange thay đổi
const CategoryTabs = memo(function CategoryTabs({ activeCategory, onChange }) {
    return (
        <div className="flex items-center justify-between border-b border-[var(--color-border)]">
      {/* Tabs */}
      <div className="flex items-center gap-0 overflow-x-auto scrollbar-none">
        {CATEGORIES.map(cat => {
          const isActive = activeCategory === cat
          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`
                px-4 py-3 text-xs font-semibold tracking-[0.12em] uppercase
                whitespace-nowrap border-b-2 transition-all duration-150
                ${isActive
                  ? 'border-[var(--color-accent)] text-[var(--color-text-primary)]'
                  : 'border-transparent text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                }
              `}
            >
              {cat}
            </button>
          )
        })}
      </div>

      {/* View all */}
      <button className="
        hidden sm:flex items-center gap-1 pl-4
        text-xs font-semibold text-[var(--color-text-secondary)]
        hover:text-[var(--color-text-primary)] transition-colors
        whitespace-nowrap
      ">
        View all <span>→</span>
      </button>
    </div>
    )
})

CategoryTabs.displayName = 'CategoryTabs'
export default CategoryTabs
export { CATEGORIES }
