import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const RELATIONS = ['Partner', 'Förälder', 'Vän', 'Kollega', 'Syskon', 'Barn']
const GIFT_TYPES = ['Omtänksam', 'Imponerande', 'Rolig', 'Praktisk', 'Samtalsstartare']
const INTERESTS = ['Historia', 'Psykologi', 'Thriller', 'Filosofi', 'Humor', 'Biografi', 'Natur', 'Ekonomi', 'Skönlitteratur', 'Sport']
const BUDGETS = ['Under 150 kr', '150–300 kr', '300–500 kr', '500+ kr']
const OCCASIONS = ['Födelsedag', 'Jul', 'Student', 'Bara så', 'Annat']

const STEPS = 4

function ProgressBar({ step }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: STEPS }).map((_, i) => (
        <div
          key={i}
          className={`h-1 flex-1 rounded-full transition-colors ${
            i < step ? 'bg-indigo-600' : i === step ? 'bg-indigo-300' : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  )
}

function ChipGroup({ options, value, onChange, multi = false }) {
  function toggle(opt) {
    if (multi) {
      onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
    } else {
      onChange(value === opt ? null : opt)
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const selected = multi ? value.includes(opt) : value === opt
        return (
          <button
            key={opt}
            type="button"
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors cursor-pointer ${
              selected
                ? 'bg-indigo-600 text-white border-indigo-600'
                : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export default function FormPage() {
  const navigate = useNavigate()
  const [relation, setRelation] = useState(null)
  const [giftType, setGiftType] = useState(null)
  const [age, setAge] = useState('')
  const [budget, setBudget] = useState('')
  const [interests, setInterests] = useState([])
  const [occasion, setOccasion] = useState('')
  const [freeText, setFreeText] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  // Räkna hur många steg som är ifyllda för progressbar
  const step = [relation, giftType, budget, interests.length > 0].filter(Boolean).length

  async function handleSubmit(e) {
    e.preventDefault()
    if (!relation) { setError('Välj vem du köper till.'); return }
    if (!giftType) { setError('Välj vad presenten ska kommunicera.'); return }
    if (!budget) { setError('Välj en budget.'); return }
    if (interests.length === 0) { setError('Välj minst ett intresse.'); return }
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relation, giftType, age, budget, interests, occasion, freeText }),
      })
      if (!res.ok) throw new Error('Något gick fel. Försök igen.')
      const data = await res.json()
      navigate('/resultat', { state: { books: data.books, relation, giftType, interests, budget } })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <ProgressBar step={step} />

        <form onSubmit={handleSubmit} noValidate>

          {/* Relation */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Vem köper du till?
            </label>
            <ChipGroup options={RELATIONS} value={relation} onChange={setRelation} />
          </div>

          {/* Presenttyp */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Vad ska presenten kommunicera?
            </label>
            <ChipGroup options={GIFT_TYPES} value={giftType} onChange={setGiftType} />
          </div>

          {/* Ålder + Budget */}
          <div className="mb-7 flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Ålder (ungefär)
              </label>
              <input
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="t.ex. 42"
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Budget
              </label>
              <select
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
              >
                <option value="">Välj budget</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          {/* Intressen */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Intressen
            </label>
            <ChipGroup options={INTERESTS} value={interests} onChange={setInterests} multi />
          </div>

          {/* Tillfälle */}
          <div className="mb-7">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Tillfälle
            </label>
            <select
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            >
              <option value="">Välj tillfälle (valfritt)</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          {/* Fritext */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Något mer om personen? <span className="font-normal text-gray-400">(valfritt)</span>
            </label>
            <textarea
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={3}
              placeholder="T.ex. läser mest på kvällarna, tycker om böcker som utmanar..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
            />
          </div>

          {/* Felmeddelande */}
          {error && (
            <p className="text-sm text-red-600 mb-4">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 disabled:opacity-60 text-white text-base font-semibold py-4 rounded-xl transition-colors cursor-pointer"
          >
            {loading ? 'Söker böcker...' : 'Hitta böcker'}
          </button>

        </form>
      </div>
    </div>
  )
}
