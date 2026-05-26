import { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen } from 'lucide-react'
import Logo from './Logo'

const LOADING_MESSAGES = [
  'Söker bland böcker…',
  'AI väljer ut favoriter…',
  'Matchar med dina intressen…',
  'Hittar rätt titlar…',
  'Nästan klart…',
]

function LoadingOverlay() {
  const [msgIndex, setMsgIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => setMsgIndex(i => (i + 1) % LOADING_MESSAGES.length), 2200)
    return () => clearInterval(id)
  }, [])

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={LOADING_MESSAGES[msgIndex]}
      className="fixed inset-0 bg-background/85 backdrop-blur-sm flex flex-col items-center justify-center gap-10"
    >
      <div className="flex gap-3" aria-hidden="true">
        {[0, 1, 2, 3].map(i => (
          <div
            key={i}
            style={{ animationDelay: `${i * 160}ms` }}
            className="w-12 h-[72px] bg-primary-light rounded-xl flex items-center justify-center animate-pulse shadow-card"
          >
            <BookOpen className="w-6 h-6 text-primary" strokeWidth={1.5} />
          </div>
        ))}
      </div>
      <div className="text-center">
        <p key={msgIndex} className="font-display text-2xl text-ink animate-fade-up">
          {LOADING_MESSAGES[msgIndex]}
        </p>
        <p className="text-sm text-muted mt-2">AI arbetar på saken</p>
      </div>
    </div>
  )
}

const RELATIONS  = ['Partner', 'Förälder', 'Vän', 'Kollega', 'Syskon', 'Barn']
const GIFT_TYPES = ['Omtänksamhet', 'Imponerande', 'Rolig', 'Praktisk', 'Samtalsstartare', 'Inspiration', 'Äventyr', 'Nostalgi', 'Nyfikenhet', 'Kärlek']
const INTERESTS  = ['Historia', 'Psykologi', 'Thriller', 'Filosofi', 'Humor', 'Biografi', 'Natur', 'Ekonomi', 'Skönlitteratur', 'Sport', 'Krim', 'Romantik', 'Fantasy', 'Vetenskap', 'Resor', 'Konst', 'Politik', 'Hälsa', 'Sci-fi', 'Musik', 'Självhjälp']
const BUDGETS    = ['Under 150 kr', '150–300 kr', '300–500 kr', '500+ kr']
const OCCASIONS  = ['Födelsedag', 'Jul', 'Student', 'Uppskattning', 'Avtack', 'Annat']

const TOTAL_STEPS = 3

function ProgressBar({ step }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={step}
      aria-valuemin={0}
      aria-valuemax={TOTAL_STEPS}
      aria-label={`Steg ${step} av ${TOTAL_STEPS} ifyllda`}
      className="flex gap-1.5 mb-9"
    >
      {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
        <div
          key={i}
          aria-hidden="true"
          className={`h-0.75 flex-1 rounded-full transition-colors duration-300 ${
            i < step ? 'bg-primary' : i === step ? 'bg-primary-light' : 'bg-rule'
          }`}
        />
      ))}
    </div>
  )
}

function FieldLabel({ id, children, required }) {
  return (
    <p id={id} className="text-[13px] font-semibold text-ink tracking-wide uppercase mb-2.5">
      {children}
      {required && (
        <>
          <span aria-hidden="true" className="text-primary ml-1">*</span>
          <span className="sr-only"> (obligatorisk)</span>
        </>
      )}
    </p>
  )
}

function FieldError({ id, message }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm text-red-700 mt-2">
      {message}
    </p>
  )
}

function ChipGroup({ options, value, onChange, multi = false, labelId, required = false, groupRef, invalid = false, errorId }) {
  function toggle(opt) {
    if (multi) {
      onChange(value.includes(opt) ? value.filter(v => v !== opt) : [...value, opt])
    } else {
      onChange(value === opt ? null : opt)
    }
  }

  return (
    <div
      ref={groupRef}
      tabIndex={-1}
      role={multi ? 'group' : 'radiogroup'}
      aria-labelledby={labelId}
      aria-required={required}
      aria-invalid={invalid || undefined}
      aria-describedby={errorId || undefined}
      className="flex flex-wrap gap-2 outline-none"
    >
      {options.map(opt => {
        const selected = multi ? value.includes(opt) : value === opt
        return (
          <button
            key={opt}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={selected}
            onClick={() => toggle(opt)}
            className={`px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 cursor-pointer ${
              selected
                ? 'bg-primary text-white border-primary shadow-sm'
                : 'bg-surface text-ink border-rule hover:border-primary hover:text-primary'
            }`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

const inputClass = "w-full bg-surface border border-rule rounded-xl px-4 py-3 text-sm text-ink placeholder-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:border-primary transition-colors"
const inputClassInvalid = "w-full bg-surface border border-red-400 rounded-xl px-4 py-3 text-sm text-ink placeholder-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400/40 focus-visible:border-red-500 transition-colors"

export default function FormPage() {
  const navigate = useNavigate()

  const [relation,  setRelation]  = useState(null)
  const [giftType,  setGiftType]  = useState(null)
  const [age,       setAge]       = useState('')
  const [budget,    setBudget]    = useState('')
  const [interests, setInterests] = useState([])
  const [otherText, setOtherText] = useState('')
  const [occasion,  setOccasion]  = useState('')
  const [freeText,     setFreeText]     = useState('')
  const [onlySwedish,  setOnlySwedish]  = useState(false)
  const [submitted,    setSubmitted]    = useState(false)
  const [loading,      setLoading]      = useState(false)
  const [apiError,     setApiError]     = useState(null)

  const relationRef  = useRef(null)
  const giftTypeRef  = useRef(null)
  const budgetRef    = useRef(null)
  const interestsRef = useRef(null)
  const errorSummaryRef = useRef(null)

  const step = [relation, giftType, interests.length > 0].filter(Boolean).length

  // Beräkna fel — visas bara efter att användaren försökt skicka
  const errors = {
    relation:  !relation            ? 'Välj vem du köper till.'           : null,
    giftType:  !giftType            ? 'Välj vad presenten ska kommunicera.' : null,
    interests: interests.length < 1 ? 'Välj minst ett intresse.'           : null,
  }
  const visibleErrors = submitted ? errors : { relation: null, giftType: null, interests: null }
  const hasErrors = Object.values(visibleErrors).some(Boolean)

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitted(true)
    setApiError(null)

    // Flytta fokus till sammanfattning om det finns fel — role="alert" annonserar till skärmläsare
    if (!relation || !giftType || interests.length < 1) {
      setTimeout(() => {
        if (!relation)            { relationRef.current?.focus();  return }
        if (!giftType)            { giftTypeRef.current?.focus();  return }
        if (interests.length < 1) { interestsRef.current?.focus(); return }
      }, 0)
      return
    }

    setLoading(true)
    const otherParsed    = otherText.split(',').map(s => s.trim()).filter(Boolean)
    const finalInterests = [...interests.filter(i => i !== 'Annat'), ...otherParsed]

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relation, giftType, age, budget, interests: finalInterests, occasion, freeText, onlySwedish }),
      })
      if (!res.ok) throw new Error('Något gick fel. Försök igen.')
      const data = await res.json()
      navigate('/resultat', { state: { books: data.books, relation, giftType, interests: finalInterests, budget } })
    } catch (err) {
      setApiError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
    {loading && <LoadingOverlay />}
    <main id="main-content" tabIndex={-1} className="min-h-screen flex flex-col items-center px-5 py-10">
      <div className="w-full max-w-md">

        <div className="mb-7">
          <Logo />
        </div>

        <ProgressBar step={step} />

        {/* Felsammanfattning — annonseras av skärmläsare via role="alert" */}
        {submitted && hasErrors && (
          <div
            ref={errorSummaryRef}
            role="alert"
            className="mb-6 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
          >
            <p className="font-semibold mb-1">Rätta till följande för att fortsätta:</p>
            <ul className="list-disc list-inside space-y-0.5">
              {Object.values(visibleErrors).filter(Boolean).map((msg, i) => (
                <li key={i}>{msg}</li>
              ))}
            </ul>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          aria-label="Hitta en bokpresent"
          className="flex flex-col gap-7"
        >

          <div>
            <FieldLabel id="relation-label" required>Vem köper du till?</FieldLabel>
            <ChipGroup
              options={RELATIONS}
              value={relation}
              onChange={setRelation}
              labelId="relation-label"
              required
              groupRef={relationRef}
              invalid={!!visibleErrors.relation}
              errorId={visibleErrors.relation ? 'relation-error' : undefined}
            />
            <FieldError id="relation-error" message={visibleErrors.relation} />
          </div>

          <div>
            <FieldLabel id="gifttype-label" required>Vad ska presenten kommunicera?</FieldLabel>
            <ChipGroup
              options={GIFT_TYPES}
              value={giftType}
              onChange={setGiftType}
              labelId="gifttype-label"
              required
              groupRef={giftTypeRef}
              invalid={!!visibleErrors.giftType}
              errorId={visibleErrors.giftType ? 'gifttype-error' : undefined}
            />
            <FieldError id="gifttype-error" message={visibleErrors.giftType} />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="age" className="block text-[13px] font-semibold text-ink tracking-wide uppercase mb-2.5">
                Ålder
              </label>
              <input
                id="age"
                type="number"
                min="1"
                max="120"
                value={age}
                onChange={e => setAge(e.target.value)}
                placeholder="t.ex. 42"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label htmlFor="budget" className="block text-[13px] font-semibold text-ink tracking-wide uppercase mb-2.5">
                Budget
              </label>
              <select
                id="budget"
                ref={budgetRef}
                value={budget}
                onChange={e => setBudget(e.target.value)}
                className={inputClass}
              >
                <option value="">Spelar ingen roll</option>
                {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div>
            <FieldLabel id="interests-label" required>Intressen</FieldLabel>
            <ChipGroup
              options={[...INTERESTS, 'Annat']}
              value={interests}
              onChange={setInterests}
              multi
              labelId="interests-label"
              required
              groupRef={interestsRef}
              invalid={!!visibleErrors.interests}
              errorId={visibleErrors.interests ? 'interests-error' : undefined}
            />
            <FieldError id="interests-error" message={visibleErrors.interests} />
            {interests.includes('Annat') && (
              <div className="mt-3">
                <label htmlFor="other-interests" className="sr-only">
                  Ange egna intressen, kommaseparerade
                </label>
                <input
                  id="other-interests"
                  type="text"
                  value={otherText}
                  onChange={e => setOtherText(e.target.value)}
                  placeholder="T.ex. matlagning, segling, brädspel"
                  className={inputClass}
                  autoFocus
                />
              </div>
            )}
          </div>

          <div>
            <label htmlFor="occasion" className="block text-[13px] font-semibold text-ink tracking-wide uppercase mb-2.5">
              Tillfälle
            </label>
            <select
              id="occasion"
              value={occasion}
              onChange={e => setOccasion(e.target.value)}
              className={inputClass}
            >
              <option value="">Valfritt</option>
              {OCCASIONS.map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>

          <div>
            <label htmlFor="free-text" className="block text-[13px] font-semibold text-ink tracking-wide uppercase mb-2.5">
              Något mer om personen?{' '}
              <span className="normal-case font-normal tracking-normal text-muted">valfritt</span>
            </label>
            <textarea
              id="free-text"
              value={freeText}
              onChange={e => setFreeText(e.target.value)}
              rows={3}
              placeholder="T.ex. läser mest på kvällarna, gillar böcker som utmanar..."
              className={`${inputClass} resize-none`}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer select-none group">
            <input
              type="checkbox"
              checked={onlySwedish}
              onChange={e => setOnlySwedish(e.target.checked)}
              className="w-4 h-4 rounded border-rule accent-primary cursor-pointer"
            />
            <span className="text-sm text-ink group-hover:text-primary transition-colors">
              Endast svenska titlar
            </span>
          </label>

          {/* API-fel (nätverksfel, inte valideringsfel) */}
          {apiError && (
            <div role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              {apiError}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            aria-busy={loading}
            className="w-full bg-primary hover:bg-[#874819] active:bg-[#6E3A14] disabled:opacity-60 text-white text-base font-semibold py-4 rounded-2xl transition-colors duration-150 cursor-pointer shadow-card"
          >
            {loading
              ? <><span aria-hidden="true">Söker böcker…</span><span className="sr-only">Söker böcker, vänligen vänta.</span></>
              : 'Hitta böcker'
            }
          </button>

        </form>
      </div>
    </main>
    </>
  )
}
