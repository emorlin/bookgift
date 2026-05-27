import { useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Logo from './Logo'

function BookCover({ title, cover }) {
  const [failed, setFailed] = useState(false)

  if (!cover || failed) {
    return (
      <div
        aria-hidden="true"
        className="w-13 h-19 rounded-lg shadow-card shrink-0 flex items-center justify-center bg-linear-to-br from-[#f5e6d8] to-primary-light"
      >
        <BookOpen className="w-6 h-6 text-primary opacity-60" strokeWidth={1.5} />
      </div>
    )
  }

  return (
    <img
      src={cover}
      alt={`Cover of ${title}`}
      className="w-13 h-19 rounded-lg shadow-card shrink-0 object-cover"
      onError={() => setFailed(true)}
    />
  )
}

function BookCard({ book }) {
  const q           = encodeURIComponent(book.title + ' ' + book.author)
  const amazonUrl      = `https://www.amazon.com/s?k=${q}`
  const bookshopUrl    = `https://bookshop.org/search?keywords=${q}`
  const googleUrl      = `https://books.google.com/books?q=${q}`

  const stores = [
    { href: amazonUrl,   label: 'Amazon' },
    { href: bookshopUrl, label: 'Bookshop.org' },
    { href: googleUrl,   label: 'Google Books' },
  ]

  return (
    <article className="bg-surface rounded-2xl shadow-card p-5 flex gap-4">
      <BookCover title={book.title} cover={book.cover} />
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="font-display text-[17px] leading-snug text-ink">{book.title}</h2>
        <p className="text-xs text-muted mt-0.5 font-medium">
          <span>{book.author}</span>
          <span aria-hidden="true"> · </span>
          <span>{book.year}</span>
        </p>
        <p className="text-sm text-ink/80 mt-2 leading-relaxed">{book.reason}</p>
        <div className="mt-3.5">
          <p className="text-[11px] font-semibold text-muted uppercase tracking-wide mb-2">Find it at</p>
          <div className="flex flex-wrap gap-2">
          {stores.map(({ href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Find ${book.title} on ${label} (opens in new tab)`}
              className="text-xs font-semibold px-3 py-1.5 border border-rule rounded-lg text-ink hover:border-primary hover:text-primary transition-colors"
            >
              {label} <span aria-hidden="true">↗</span>
            </a>
          ))}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.books) return <Navigate to="/find" replace />

  const { books: initialBooks, relation, giftType, interests, budget, age, occasion, freeText } = state

  const [books,   setBooks]   = useState(initialBooks)
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const summary = [
    interests.slice(0, 2).join(', '),
    giftType?.toLowerCase(),
    budget,
  ].filter(Boolean).join(' · ')

  async function fetchNewRecommendations() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relation, giftType, age, budget, interests, occasion, freeText }),
      })
      if (!res.ok) throw new Error('Something went wrong. Please try again.')
      const data = await res.json()
      setBooks(data.books)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen flex flex-col items-center px-5 py-10 animate-page-enter">
      <div className="w-full max-w-md">

        <div className="mb-7">
          <Logo />
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink leading-tight">
            4 books for your {relation?.toLowerCase()}
          </h1>
          <p className="text-sm text-muted mt-1.5">{summary}</p>
        </div>

        <ul className="flex flex-col gap-4 list-none">
          {books.map((book, i) => (
            <li key={i}>
              <BookCard book={book} />
            </li>
          ))}
        </ul>

        {error && (
          <div role="alert" className="mt-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
            {error}
          </div>
        )}

        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            onClick={fetchNewRecommendations}
            disabled={loading}
            aria-busy={loading}
            className="w-full py-3.5 border border-rule rounded-2xl text-sm font-semibold text-ink hover:border-primary hover:text-primary disabled:opacity-50 transition-colors cursor-pointer bg-surface shadow-card"
          >
            {loading ? 'Finding new picks…' : 'New recommendations'}
          </button>
          <a
            onClick={e => { e.preventDefault(); navigate('/find') }}
            href="/find"
            className="text-sm text-muted hover:text-primary transition-colors cursor-pointer"
          >
            ← New search
          </a>
        </div>

        <dl className="mt-10 pt-8 border-t border-rule grid grid-cols-2 gap-4 text-center">
          <div>
            <dd className="font-display text-4xl text-primary">5 832</dd>
            <dt className="text-xs text-muted mt-1">books recommended</dt>
          </div>
          <div>
            <dd className="font-display text-4xl text-primary">1 204</dd>
            <dt className="text-xs text-muted mt-1">unique titles</dt>
          </div>
        </dl>

      </div>
    </main>
  )
}
