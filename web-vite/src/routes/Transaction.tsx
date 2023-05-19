import {useParams} from 'react-router-dom'

export const Transaction = () => {
  const {uuid} = useParams()

  return (
    <>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <h1 className="text-2xl font-bold leading-7 text-gray-900">
              Transaction
            </h1>
          </div>
        </div>
      </header>

      {uuid}
    </>
  )
}
