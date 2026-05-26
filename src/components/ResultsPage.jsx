import { useEffect, useState } from 'react'
import { useLocation, useNavigate, Navigate } from 'react-router-dom'
import Logo from './Logo'

function BookCover({ title, author }) {
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (!title) return
    const query = encodeURIComponent(`intitle:${title} inauthor:${author}`)
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=1&fields=items(volumeInfo/imageLinks)`)
      .then(r => r.json())
      .then(data => {
        const thumb = data?.items?.[0]?.volumeInfo?.imageLinks?.thumbnail
        if (thumb) setSrc(thumb.replace('http:', 'https:'))
      })
      .catch(() => {})
  }, [title, author])

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className="w-13 h-19 object-cover rounded-lg shadow-card shrink-0"
      />
    )
  }

  return (
    <div
      aria-hidden="true"
      className="w-13 h-19 bg-primary-light rounded-lg shadow-card flex items-center justify-center shrink-0"
    >
      <span>📖</span>
    </div>
  )
}

function BookCard({ book }) {
  const bokusUrl    = `https://www.bokus.com/cgi-bin/product_search.cgi?search_word=${encodeURIComponent(book.title + ' ' + book.author)}`
  const adlibrisUrl = `https://www.adlibris.com/se/sok?search=${encodeURIComponent(book.title + ' ' + book.author)}`

  return (
    <article className="bg-surface rounded-2xl shadow-card p-5 flex gap-4">
      <BookCover title={book.title} author={book.author} />
      <div className="flex flex-col flex-1 min-w-0">
        <h2 className="font-display text-[17px] leading-snug text-ink">{book.title}</h2>
        <p className="text-xs text-muted mt-0.5 font-medium">
          <span>{book.author}</span>
          <span aria-hidden="true"> · </span>
          <span>{book.year}</span>
        </p>
        <p className="text-sm text-ink/80 mt-2 leading-relaxed">{book.reason}</p>
        <div className="flex gap-2 mt-3.5">
          <a
            href={bokusUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Köp ${book.title} på Bokus (öppnas i ny flik)`}
            className="text-xs font-semibold px-3 py-1.5 border border-rule rounded-lg text-ink hover:border-primary hover:text-primary transition-colors"
          >
            Bokus <span aria-hidden="true">↗</span>
          </a>
          <a
            href={adlibrisUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Köp ${book.title} på Adlibris (öppnas i ny flik)`}
            className="text-xs font-semibold px-3 py-1.5 border border-rule rounded-lg text-ink hover:border-primary hover:text-primary transition-colors"
          >
            Adlibris <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </article>
  )
}

export default function ResultsPage() {
  const { state } = useLocation()
  const navigate  = useNavigate()

  if (!state?.books) return <Navigate to="/hitta" replace />

  const { books, relation, giftType, interests, budget } = state

  const summary = [
    interests.slice(0, 2).join(', '),
    giftType?.toLowerCase(),
    budget,
  ].filter(Boolean).join(' · ')

  return (
    <main id="main-content" tabIndex={-1} className="min-h-screen flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-md">

        <div className="mb-7">
          <Logo />
        </div>

        <div className="mb-8">
          <h1 className="font-display text-3xl text-ink leading-tight">
            4 böcker för din {relation?.toLowerCase()}
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

        <div className="mt-8">
          <button
            onClick={() => navigate('/hitta')}
            className="w-full py-3.5 border border-rule rounded-2xl text-sm font-semibold text-ink hover:border-primary hover:text-primary transition-colors cursor-pointer bg-surface shadow-card"
          >
            Sök igen
          </button>
        </div>

        <dl className="mt-10 pt-8 border-t border-rule grid grid-cols-2 gap-4 text-center">
          <div>
            <dd className="font-display text-4xl text-primary">5 832</dd>
            <dt className="text-xs text-muted mt-1">böcker rekommenderade totalt</dt>
          </div>
          <div>
            <dd className="font-display text-4xl text-primary">1 204</dd>
            <dt className="text-xs text-muted mt-1">unika titlar</dt>
          </div>
        </dl>

      </div>
    </main>
  )
}
