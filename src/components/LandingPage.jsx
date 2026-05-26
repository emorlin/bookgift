import { useNavigate } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'
import Logo from './Logo'

const STEPS = [
  { n: '1', label: 'Berätta om personen' },
  { n: '2', label: 'AI väljer böcker' },
  { n: '3', label: 'Köp direkt' },
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
          Rätt bok.<br />Till rätt person.
        </h1>

        <p className="text-[17px] text-muted leading-relaxed mb-10 max-w-sm mx-auto">
          Berätta om den du köper till — vi hittar en bok de faktiskt kommer läsa.
        </p>

        <button
          onClick={() => navigate('/hitta')}
          className="bg-primary hover:bg-[#874819] active:bg-[#6E3A14] text-white text-base font-semibold px-9 py-4 rounded-2xl transition-colors duration-150 cursor-pointer shadow-card-lg"
        >
          Hitta en bok <span aria-hidden="true">→</span>
        </button>

        <ol aria-label="Så här fungerar det" className="mt-14 grid grid-cols-3 gap-3 list-none">
          {STEPS.map(({ n, label }) => (
            <li key={n} className="bg-surface rounded-2xl p-5 shadow-card">
              <div aria-hidden="true" className="w-7 h-7 rounded-full bg-primary-light text-primary font-bold text-xs flex items-center justify-center mx-auto mb-3">
                {n}
              </div>
              <p className="text-[13px] font-medium text-ink leading-snug">{label}</p>
            </li>
          ))}
        </ol>

        <ul aria-label="Fördelar" className="mt-10 pt-8 border-t border-rule flex items-center justify-center gap-7 text-[13px] text-muted list-none">
          <li>Ingen registrering</li>
          <li aria-hidden="true" className="w-px h-3 bg-rule" />
          <li>Inget sparas</li>
          <li aria-hidden="true" className="w-px h-3 bg-rule" />
          <li>30 sekunder</li>
        </ul>

        <div className="mt-8 flex justify-center">
          <a
            href="https://github.com/emorlin/Ge-bort-en-bok"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[12px] text-muted hover:text-primary transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
            emorlin/Ge-bort-en-bok
          </a>
        </div>

      </div>
    </main>
  )
}
