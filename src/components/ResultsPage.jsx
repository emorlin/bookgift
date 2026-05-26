import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'

function BookCover({ isbn, title }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!isbn) return
    const query = encodeURIComponent(`isbn:${isbn}`)
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&fields=items(volumeInfo/imageLinks)`)
      .then(r => r.json())
      .then(data => {
        const thumb = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
        if (thumb) setSrc(thumb.replace('http:', 'https:'))
      })
      .catch(() => {})
  }, [isbn])

  if (src) {
    return (
      <img
        src={src}
        alt={title}
        className="w-16 h-24 object-cover rounded shadow-sm shrink-0"
      />
    )
  }

  return (
    <div className="w-16 h-24 bg-indigo-100 rounded shadow-sm flex items-center justify-center shrink-0">
      <span className="text-2xl">📚</span>
    </div>
  )
}

function BookCard({ book }) {
  const bokusUrl = `https://www.bokus.com/cgi-bin/product_search.cgi?search_word=${encodeURIComponent(book.title + ' ' + book.author)}`
  const adlibrisUrl = `https://www.adlibris.com/se/sok?search=${encodeURIComponent(book.title + ' ' + book.author)}`

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4">
      <BookCover isbn={book.isbn} title={book.title} />
      <div className="flex flex-col flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 text-base leading-snug">{book.title}</h3>
        <p className="text-sm text-gray-500 mt-0.5">{book.author} · {book.year}</p>
        <p className="text-sm text-gray-600 mt-2 leading-relaxed">{book.reason}</p>
        <div className="flex gap-2 mt-3">
          <a
            href={bokusUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Bokus ↗
          </a>
          <a
            href={adlibrisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium px-3 py-1.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Adlibris ↗
          </a>
        </div>
      </div>
    </div>
  )
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate = useNavigate()

  if (!state?.books) return <Navigate to="/hitta" replace />

  const { books, relation, giftType, interests, budget } = state

  const summary = [
    interests.slice(0, 2).join(', '),
    giftType?.toLowerCase(),
    budget,
  ].filter(Boolean).join(' · ')

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            4 böcker för din {relation?.toLowerCase()}
          </h1>
          <p className="text-sm text-gray-500 mt-1">Baserat på: {summary}</p>
        </div>

        {/* Bokkort */}
        <div className="flex flex-col gap-4">
          {books.map((book, i) => (
            <BookCard key={i} book={book} />
          ))}
        </div>

        {/* Knappar */}
        <div className="flex gap-3 mt-8">
          <button
            onClick={() => navigate('/hitta')}
            className="flex-1 py-3 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Sök igen
          </button>
        </div>

        {/* Statistik */}
        <div className="mt-10 pt-8 border-t border-gray-200 flex justify-between">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">5 832</p>
            <p className="text-xs text-gray-500 mt-1">böcker rekommenderade totalt</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">1 204</p>
            <p className="text-xs text-gray-500 mt-1">unika titlar</p>
          </div>
        </div>

      </div>
    </div>
  )
}
