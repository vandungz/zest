import { memo, useCallback, useMemo } from "react";

function PrevBtn() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25894)"><path d="M14 7L9 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9 12L14 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_2497_25894"><rect width="24" height="24" fill="white"/></clipPath></defs></svg> }
function NextBtn() { return <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_2497_25895)"><path d="M10 17L15 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M15 12L10 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0_2497_25895"><rect width="24" height="24" fill="white"/></clipPath></defs></svg> }

const Pagination = memo(function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
}) {
  // Phép tính này rất nhẹ, không cần useMemo.
  const totalPages = Math.ceil(totalItems / itemsPerPage)

  // Tính range hiển thị cho trang hiện tại.
  const rangeStart = (currentPage - 1) * itemsPerPage + 1
  const rangeEnd = Math.min(currentPage * itemsPerPage, totalItems)

  // Tạo danh sách page numbers hiển thị: [1, 2, 3, "...", totalPages].
  const pageNumbers = useMemo(() => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // Luôn show trang đầu, trang cuối, trang hiện tại và hai trang lân cận nếu có.
    const pages = new Set([1, totalPages])

    if (currentPage > 1) {
      pages.add(currentPage - 1)
      pages.add(currentPage)
    }

    if (currentPage < totalPages) {
      pages.add(currentPage)
      pages.add(currentPage + 1)
    }

    return Array.from(pages)
      .filter(page => page >= 1 && page <= totalPages)
      .sort((a, b) => a - b)
  }, [totalPages, currentPage])

  // useCallback giúp handler stable reference cho prev/next.
  const handlePrev = useCallback(() => {
    if (currentPage > 1) onPageChange(currentPage - 1)
  }, [currentPage, onPageChange])

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) onPageChange(currentPage + 1)
  }, [currentPage, totalPages, onPageChange])

  if (totalPages <= 1) return null

  return (
    <div className="
      flex flex-col sm:flex-row items-center justify-between
      gap-4 pt-8 mt-8
      border-t border-[var(--color-border)]
    ">
      {/* Range label */}
      <p className="text-xs text-[var(--color-text-secondary)]">
        {rangeStart}-{rangeEnd} of {totalItems} books
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Prev */}
        <button
          onClick={handlePrev}
          disabled={currentPage === 1}
          aria-label="Previous page"
          className="
            w-8 h-8 flex items-center justify-center
            border border-[var(--color-border)]
            text-[var(--color-text-secondary)]
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:border-[var(--color-text-secondary)]
            hover:text-[var(--color-text-primary)]
            transition-colors text-sm
          "
        >
          <PrevBtn />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, index) => {
          // Hiển thị "..." giữa các số không liền nhau.
          const prevPage = pageNumbers[index - 1]
          const showEllipsis = prevPage && page - prevPage > 1

          return (
            <div key={page} className="flex items-center gap-1">
              {showEllipsis && (
                <span className="w-8 h-8 flex items-center justify-center text-xs text-[var(--color-text-secondary)]">
                  ...
                </span>
              )}
              <button
                onClick={() => onPageChange(page)}
                aria-label={`Page ${page}`}
                aria-current={currentPage === page ? 'page' : undefined}
                className={`
                  w-8 h-8 flex items-center justify-center
                  text-xs font-semibold transition-all duration-150
                  ${currentPage === page
                    ? 'bg-[var(--color-accent)] text-black border border-[var(--color-accent)]'
                    : 'border border-transparent text-[var(--color-text-secondary)] hover:border-[var(--color-border)] hover:text-[var(--color-text-primary)]'
                  }
                `}
              >
                {page}
              </button>
            </div>
          )
        })}

        {/* Next */}
        <button
          onClick={handleNext}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          className="
            w-8 h-8 flex items-center justify-center
            border border-[var(--color-border)]
            text-[var(--color-text-secondary)]
            disabled:opacity-30 disabled:cursor-not-allowed
            hover:border-[var(--color-text-secondary)]
            hover:text-[var(--color-text-primary)]
            transition-colors text-sm
          "
        >
          <NextBtn />
        </button>
      </div>
    </div>
  )
})

Pagination.displayName = 'Pagination'
export default Pagination
