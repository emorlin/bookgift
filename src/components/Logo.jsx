import { BookOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Logo() {
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/')}
      aria-label="BookGift – go to home"
      className="flex items-center gap-2 cursor-pointer"
    >
      <BookOpen size={22} strokeWidth={2} className="text-primary shrink-0" aria-hidden="true" />
      <span className="text-sm font-semibold text-ink tracking-wide leading-none">
        BookGift
      </span>
    </button>
  )
}
