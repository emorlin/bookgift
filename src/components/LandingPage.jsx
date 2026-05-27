import { useNavigate } from 'react-router-dom'
import Logo from './Logo'

const STEPS = [
  { n: '1', label: 'Describe the person' },
  { n: '2', label: 'AI picks books' },
  { n: '3', label: 'Buy instantly' },
]

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <main id="main-content" className="min-h-screen flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-md text-center">

        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        <h1 className="font-display text-5xl leading-[1.1] text-ink mb-5">
          The right book.<br />For the right person.
        </h1>

        <p className="text-[17px] text-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Tell us about the person you're buying for — we'll find a book they'll actually read.
        </p>

        <button
          onClick={() => navigate('/find')}
          className="bg-primary hover:bg-[#874819] active:bg-[#6E3A14] text-white text-base font-semibold px-9 py-4 rounded-2xl transition-colors duration-150 cursor-pointer shadow-card-lg"
        >
          Find a book <span aria-hidden="true">→</span>
        </button>

        <ol aria-label="How it works" className="mt-14 grid grid-cols-3 gap-3 list-none">
          {STEPS.map(({ n, label }) => (
            <li key={n} className="bg-surface rounded-2xl p-5 shadow-card">
              <div aria-hidden="true" className="w-7 h-7 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center mx-auto mb-3">
                {n}
              </div>
              <p className="text-[13px] font-medium text-ink leading-snug">{label}</p>
            </li>
          ))}
        </ol>

        <ul aria-label="Benefits" className="mt-10 pt-8 border-t border-rule flex items-center justify-center gap-7 text-[13px] text-muted list-none">
          <li>No sign-up</li>
          <li aria-hidden="true" className="w-px h-3 bg-rule" />
          <li>Nothing stored</li>
          <li aria-hidden="true" className="w-px h-3 bg-rule" />
          <li>30 seconds</li>
        </ul>

        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/emorlin/Ge-bort-en-bok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-muted hover:text-primary transition-colors"
          >
            <svg aria-hidden="true" className="w-3.5 h-3.5" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" />
            </svg>
            emorlin/bookgift
          </a>
        </div>

      </div>
    </main>
  )
}
