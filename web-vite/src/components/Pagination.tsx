import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/20/solid'
import classNames from 'classnames'

type Props = {
  page: number
  pageSize: number
  totalCount: number
  onPageChange: (page: number) => void
}

const PageButton = ({
  page,
  currentPage,
  onPageChange,
}: {
  page: number
  currentPage: number
  onPageChange: (page: number) => void
}) => {
  return (
    <button
      type="button"
      onClick={() => onPageChange(page)}
      className={classNames(
        'relative inline-flex items-center px-4 py-2 text-sm font-semibold',
        {
          'z-10 bg-indigo-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600':
            page === currentPage,
          'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0 focus:z-20':
            page !== currentPage,
        }
      )}
    >
      {page}
    </button>
  )
}

export const Pagination = ({
  page,
  pageSize,
  totalCount,
  onPageChange,
}: Props) => {
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Previous
        </button>
        <a
          href="#"
          className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Next
        </a>
      </div>
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing{' '}
            <span className="font-medium">{1 + (page - 1) * pageSize}</span> to{' '}
            <span className="font-medium">{page * pageSize}</span> of{' '}
            <span className="font-medium">{totalCount}</span> results
          </p>
        </div>
        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <button
              type="button"
              onClick={() => onPageChange(page - 1)}
              className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            <PageButton
              page={1}
              currentPage={page}
              onPageChange={onPageChange}
            />
            {totalPages > 2 && (
              <PageButton
                page={2}
                currentPage={page}
                onPageChange={onPageChange}
              />
            )}

            {page > 4 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            )}

            {page > 3 && page < totalPages && (
              <PageButton
                page={page - 1}
                currentPage={page}
                onPageChange={onPageChange}
              />
            )}
            {page > 2 && page < totalPages - 1 && (
              <PageButton
                page={page}
                currentPage={page}
                onPageChange={onPageChange}
              />
            )}
            {page > 1 && page < totalPages - 2 && (
              <PageButton
                page={page + 1}
                currentPage={page}
                onPageChange={onPageChange}
              />
            )}

            {page < totalPages - 3 && (
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0">
                ...
              </span>
            )}

            <PageButton
              page={totalPages - 1}
              currentPage={page}
              onPageChange={onPageChange}
            />
            <PageButton
              page={totalPages}
              currentPage={page}
              onPageChange={onPageChange}
            />

            <button
              type="button"
              onClick={() => onPageChange(page + 1)}
              className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  )
}
