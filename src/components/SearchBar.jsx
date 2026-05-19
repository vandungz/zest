import { memo } from "react";

function IconSearch() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25824)"><path d="M21 21L16.6569 16.6569M16.6569 16.6569C18.1046 15.2091 19 13.2091 19 11C19 6.58172 15.4183 3 11 3C6.58172 3 3 6.58172 3 11C3 15.4183 6.58172 19 11 19C13.2091 19 15.2091 18.1046 16.6569 16.6569Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" /></g><defs><clipPath id="clip0_2497_25824"><rect width="24" height="24" fill="white" /></clipPath></defs></svg> }

// Controlled component - value và onChange lấy từ parent
// SearchBar không quản lý State - HomePage quản lý
const SearchBar = memo(function SearchBar({ value, onChange }) {
    return (
        <div className="space-y-2">
            {/* Search Input */}
            <div className="flex items-center gap-4">
                <div className="
                    flex-1 flex items-center gap-3
                    border border-[var(--color-border)]
                    bg-[var(--color-bg-surface)]
                    px-4 py-3
                    focus-within:border-[var(--color-text-secondary)]
                    transition-colors duration-150
                ">
                    <span className="text-[var(--color-text-secondary)] flex-shrink-0">
                        <IconSearch />
                    </span>
                    <input
                        type="text"
                        value={value}
                        onChange={e => onChange(e.target.value)}
                        placeholder="Search by title, author, or genre..."
                        aria-label="Search books"
                        className="
                            flex-1 bg-transparent outline-none
                            text-sm text-[var(--color-text-primary)]
                            placeholder:text-[var(--color-text-secondary)]
                        "/>
                    {/* Clear button */}
                    {value && (
                        <button
                            onClick={() => onChange('')}
                            aria-label="Clear search"
                            className="
                                text-[var(--color-text-secondary)]
                                hover:text-[var(--color-text-primary)]
                                transition-colors text-lg leading-none
                            ">
                            ×
                        </button>
                    )}
                </div>

                {/* Filter button */}
                <button className="
                    flex items-center gap-2 px-4 py-3
                    border border-[var(--color-border)]
                    text-xs font-semibold tracking-wide uppercase
                    text-[var(--color-text-secondary)]
                    hover:border-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    transition-colors duration-150
                    whitespace-nowrap
                ">
                    Filter
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M3 4h18M7 12h10M11 20h2" />
                    </svg>
                </button>

                {/* Sort button */}
                <button className="
                    flex items-center gap-2 px-4 py-3
                    border border-[var(--color-border)]
                    text-xs font-semibold tracking-wide uppercase
                    text-[var(--color-text-secondary)]
                    hover:border-[var(--color-text-secondary)]
                    hover:text-[var(--color-text-primary)]
                    transition-colors duration-150
                    whitespace-nowrap
                ">
                    Sort by
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" d="M6 9l6-6 6 6M18 15l-6 6-6-6" />
                    </svg>
                </button>
            </div>
        </div>
    )
})

SearchBar.displayName = 'SearchBar'
export default SearchBar