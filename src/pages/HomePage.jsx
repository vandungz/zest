import { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchBooks } from '../features/books/booksThunks'
import { selectBooks, selectBooksStatus, selectBooksError } from '../features/books/booksSelectors'
import { useUiStore } from '../stores/uiStore'
import { useDebounce } from '../hooks/useDebounce'
import Spinner from '../components/common/Spinner'
import Header from '../components/Header'
import Hero from '../components/Hero'
import CategoryTabs from '../components/CategoryTabs'
import SearchBar from '../components/SearchBar'
import ProductList from '../components/ProductList'
import Pagination from '../components/Pagination'

const ITEMS_PER_PAGE = 20

function HomePage() {
  const dispatch = useDispatch()
  const products = useSelector(selectBooks)
  const status = useSelector(selectBooksStatus)
  const error = useSelector(selectBooksError)

  const loading = status === 'idle' || status === 'loading'

  useEffect(() => {
    // Dispatch khi HomePage mount.
    // Thunk condition tự chặn nếu books không còn ở trạng thái idle.
    // Không abort ở cleanup vì React StrictMode trong dev sẽ cleanup effect giả,
    // làm request thật bị hủy trước khi fulfilled.
    dispatch(fetchBooks())
  }, [dispatch])

  // ── Search & Filter State ──────────────────────────────
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)

  const openLogin = useUiStore(state => state.openLogin)

  // useDebounce — trì hoãn filter 300ms sau khi user dừng gõ
  // Tránh filter 1000 items sau mỗi ký tự
  const debouncedQuery = useDebounce(searchQuery, 300)

  // ── Refs ───────────────────────────────────────────────
  const collectionRef = useRef(null)

  // ── useMemo: filteredBooks ─────────────────────────────
  // Chỉ tính lại khi products, debouncedQuery, hoặc activeCategory thay đổi
  // Theme toggle, cart update → KHÔNG tính lại → performance tối ưu
  const filteredBooks = useMemo(() => {
    let result = products

    // Filter by category
    if (activeCategory !== 'All') {
      result = result.filter(book =>
        book.category?.toLowerCase().includes(activeCategory.toLowerCase())
      )
    }

    // Filter by search query — tìm trong title, author, category
    if (debouncedQuery.trim()) {
      const q = debouncedQuery.toLowerCase().trim()
      result = result.filter(book =>
        book.title?.toLowerCase().includes(q) ||
        book.author?.toLowerCase().includes(q) ||
        book.category?.toLowerCase().includes(q)
      )
    }

    return result
  }, [products, debouncedQuery, activeCategory])

  // ── useMemo: paginatedBooks ────────────────────────────
  // Cắt filtered results theo page hiện tại
  // Chỉ render ITEMS_PER_PAGE items thay vì toàn bộ filteredBooks
  const paginatedBooks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredBooks.slice(start, start + ITEMS_PER_PAGE)
  }, [filteredBooks, currentPage])

  // ── useCallback: Event Handlers ────────────────────────
  // Stable reference → React.memo của CategoryTabs, SearchBar không
  // re-render khi HomePage re-render vì lý do khác (cart, theme)

  const handleExplore = useCallback(() => {
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleSearch = useCallback((value) => {
    setSearchQuery(value)
    setCurrentPage(1) // reset về trang 1 khi search
  }, [])

  const handleCategory = useCallback((cat) => {
    setActiveCategory(cat)
    setCurrentPage(1) // reset về trang 1 khi đổi category
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    // Scroll lên đầu collection khi chuyển trang
    collectionRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  const handleLoginRequired = useCallback(() => {
    // ProductCard goi ham nay khi user chua login.
    // Login modal bay gio duoc mo tu Zustand thay vi local state.
    openLogin()
  }, [openLogin])

  // ── Render ─────────────────────────────────────────────
  if (loading) return <Spinner message="Đang tải sách từ Open Library..." />
  if (error) return <div className="p-8 text-red-500">❌ Lỗi: {error}</div>

  return (
    <div>
      <Header />

      <main>
        <Hero onExplore={handleExplore} />

        {/* ── COLLECTION SECTION ──────────────────────── */}
        <section
          ref={collectionRef}
          className="max-w-screen-xl mx-auto px-6 py-12"
        >
          {/* Section Header */}
          <h2 className="
            text-xs font-semibold tracking-[0.2em] uppercase
            text-[var(--color-text-secondary)] mb-6
          ">
            Our Collection
          </h2>

          {/* Category Tabs */}
          <CategoryTabs
            activeCategory={activeCategory}
            onChange={handleCategory}
          />

          {/* Search Bar */}
          <div className="mt-4 mb-6">
            <SearchBar
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>

          {/* Product List */}
          <ProductList books={paginatedBooks} onLoginRequired={handleLoginRequired} />

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalItems={filteredBooks.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </section>
      </main>
    </div>
  )
}

export default HomePage
