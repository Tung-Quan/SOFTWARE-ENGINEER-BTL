import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'

import boxSvg from '@/assets/box.svg'
import ChevronLeft from '@/components/icons/arrow-left'
import ChevronRight from '@/components/icons/arrow-right'
import Book from '@/components/icons/book'
import ChevronsLeft from '@/components/icons/double-chevron'
import ChevronsRight from '@/components/icons/double-chevron'
import Search from '@/components/icons/search'
import StudyLayout from '@/components/study-layout'
import { type Book as BookType } from '@/types/book.type'
import { searchVNULibrary } from '@/utils/vnu-library'

import { BookDetailsModal } from './lib-popup'

export const Route = createFileRoute('/library/$query/')({
  component: RouteComponent,
})



function RouteComponent() {

  const [popupDetails, setPopupDetails] = useState<null | BookType>(null);
  const [isSeeingDetails, setIsSeeingDetails] = useState(false);

  // Book Card Component với design giống dashboard
  function BookCard({ book }: { book: BookType }) {

    const normalizedAvailability = (() => {
      const raw = (book.availability ?? '') as string
      const lower = raw.toLowerCase()
      if (lower === 'checked-out' || lower === 'borrowed') return 'borrowed'
      if (lower === 'on-hold' || lower === 'reserved') return 'reserved'
      if (lower === 'available') return 'available'
      return 'unknown'
    })()


    const getAvailabilityColor = () => {
      switch (normalizedAvailability) {
        case 'available':
          return 'bg-green-100 text-green-800'
        case 'borrowed':
          return 'bg-red-100 text-red-800'
        case 'reserved':
          return 'bg-yellow-100 text-yellow-800'
        default:
          return 'bg-gray-100 text-gray-800'
      }
    }

    const getAvailabilityText = () => {
      switch (normalizedAvailability) {
        case 'available':
          return 'Có sẵn'
        case 'borrowed':
          return 'Đã mượn'
        case 'reserved':
          return 'Đang giữ'
        default:
          return 'Không rõ'
      }
    }

    return (
      <div
        className="group flex cursor-pointer flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-xl"
        style={{ boxShadow: '4px 4px 0 0 rgba(249,186,8,1)' }}
      >
        {/* Book Cover */}
        <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6">
          {book?.coverImage ? (
            <img
              src={book.coverImage}
              alt={book.title}
              className="h-full w-auto object-contain shadow-lg"
            />
          ) : (
            <Book className="size-32 text-blue-300" />
          )}
          {/* Availability Badge */}
          <div
            className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-semibold ${getAvailabilityColor()}`}
          >
            {getAvailabilityText()}
          </div>
        </div>

        {/* Book Info */}
        <div className="flex flex-1 flex-col bg-white p-4">
          <h3 className="mb-2 line-clamp-2 text-lg font-bold text-gray-800 group-hover:text-[#0329E9]">
            {book.title}
          </h3>
          <p className="mb-1 text-sm text-gray-600">
            <span className="font-semibold">Tác giả:</span> {book.author || 'Không rõ'}
          </p>
          {book.publisher && (
            <p className="mb-1 text-sm text-gray-600">
              <span className="font-semibold">NXB:</span> {book.publisher}
            </p>
          )}
          {book.year && (
            <p className="mb-2 text-sm text-gray-600">
              <span className="font-semibold">Năm:</span> {book.year}
            </p>
          )}

          {/* Stats */}
          <div className="mt-auto flex justify-around border-t border-gray-200 pt-3 text-center">
            {book.location && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Vị trí</span>
                <span className="text-sm font-bold text-gray-800">{book.location}</span>
              </div>
            )}
            {book.callNumber && (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">Mã số</span>
                <span className="text-sm font-bold text-gray-800">{book.callNumber}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <button
            aria-label="Xem chi tiết sách"
            onClick={() => {
              setPopupDetails(book);
              setIsSeeingDetails(true);
            }}
            title="Xem chi tiết sách"
            className="mt-4 flex items-center justify-center gap-2 rounded-lg bg-[#0329E9] py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            Chi tiết
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    )
  }
  const navigate = useNavigate()
  const { query } = Route.useParams()
  const [books, setBooks] = useState<BookType[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState(query || '')

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  // Calculate pagination
  const totalPages = Math.max(1, Math.ceil(books.length / itemsPerPage))
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const displayedBooks = books.slice(startIndex, endIndex)

  const fetchBooks = async () => {
    if (!query) return

    setLoading(true)
    setError(null)

    try {
      const response = await searchVNULibrary(query)
      setBooks(response.books)
      setCurrentPage(1) // Reset về trang 1 khi search mới
    } catch (err) {
      setError('Không thể tải dữ liệu. Vui lòng thử lại sau.')
      console.error('Error fetching books:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [query])

  const handleNewSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchInput.trim()) return

    navigate({
      to: '/library/$query',
      params: { query: searchInput.trim() },
    })
  }

  const handleBackToLibrary = () => {
    navigate({ to: '/library' })
  }

  return (
    <StudyLayout>
      {isSeeingDetails && (

        <BookDetailsModal book={popupDetails} onClose={() => setPopupDetails(null)} />
      )}
      <div className="mb-6 flex items-center gap-4">
        <button
          onClick={handleBackToLibrary}
          className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          aria-label="Quay lại trang tìm kiếm"
        >
          <ChevronLeft className="size-4" />
          Quay lại
        </button>
        <h1
          className="text-4xl font-bold text-gray-800"
          style={{ fontFamily: 'Archivo' }}
        >
          Kết quả tìm kiếm
        </h1>
      </div>

      <div
        className="rounded-lg border border-gray-500 bg-white p-6 shadow-sm"
        style={{ fontFamily: 'Archivo' }}
      >
        <h2 className="mb-4 text-xl font-semibold text-gray-700">
          Tìm kiếm: "{query}"
        </h2>

        {/* Search Bar */}
        <form onSubmit={handleNewSearch} className="mb-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Search className="size-5" />
            </span>
            <input
              type="text"
              placeholder="Nhập tên sách để tìm kiếm..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </form>

        {/* Items per page selector */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Hiển thị {displayedBooks.length} / {books.length} kết quả
          </p>
          <div className="flex items-center gap-2">
            <label htmlFor="itemsPerPage" className="text-sm text-gray-600">
              Số sách mỗi trang:
            </label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value))
                setCurrentPage(1)
              }}
              className="rounded-lg border border-gray-300 bg-white py-1 pl-3 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={8}>8</option>
              <option value={12}>12</option>
              <option value={16}>16</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="size-16 animate-spin rounded-full border-4 border-gray-200 border-t-[#0329E9]"></div>
            <p className="mt-4 text-gray-600">Đang tìm kiếm...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-red-100">
              <svg
                className="size-8 text-red-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
            <p className="text-gray-600">{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-4 rounded-lg bg-[#0329E9] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && books.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16">
            <img
              src={boxSvg}
              alt="Không tìm thấy sách"
              className="mb-6 size-28 opacity-90"
            />
            <p className="text-gray-500">
              Không tìm thấy sách nào với từ khóa "{query}"
            </p>
          </div>
        )}

        {/* Books Grid */}
        {!loading && !error && books.length > 0 && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              {displayedBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>

            {/* Pagination Controls */}
            <nav className="flex items-center justify-center gap-1 text-sm">
              <button
                aria-label="Trang đầu tiên"
                title="Trang đầu tiên"
                className={currentPage === 1 ? 'pagination-btn-disabled' : 'pagination-btn'}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              >
                <ChevronsLeft className="size-4" />
              </button>
              <button
                aria-label="Trang trước"
                title="Trang trước"
                className={currentPage === 1 ? 'pagination-btn-disabled' : 'pagination-btn'}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              >
                <ChevronLeft className="size-4" />
              </button>

              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={currentPage === pageNumber ? 'page-number-active' : 'page-number'}
                  >
                    {pageNumber}
                  </button>
                )
              })}

              <button
                aria-label="Trang tiếp theo"
                title="Trang tiếp theo"
                className={currentPage === totalPages ? 'pagination-btn-disabled' : 'pagination-btn'}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              >
                <ChevronRight className="size-4" />
              </button>
              <button
                aria-label="Trang cuối"
                title="Trang cuối"
                className={currentPage === totalPages ? 'pagination-btn-disabled' : 'pagination-btn'}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              >
                <ChevronsRight className="size-4" />
              </button>
            </nav>
          </>
        )}
      </div>
    </StudyLayout>
  )
}
