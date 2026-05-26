import { useNavigate } from 'react-router-dom'

export default function LandingPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg text-center">

        {/* Logotyp */}
        <p className="text-sm font-semibold tracking-widest text-indigo-600 uppercase mb-6">
          Bokpresent
        </p>

        {/* Headline */}
        <h1 className="text-5xl font-bold text-gray-900 leading-tight mb-4">
          Rätt bok.<br />Till rätt person.
        </h1>

        {/* Subtext */}
        <p className="text-lg text-gray-500 mb-10">
          Berätta om den du köper till — vi hittar en bok de faktiskt kommer läsa.
        </p>

        {/* CTA */}
        <button
          onClick={() => navigate('/hitta')}
          className="inline-block bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white text-lg font-medium px-8 py-4 rounded-xl transition-colors cursor-pointer"
        >
          Hitta en bok →
        </button>

        {/* Steg-förklaring */}
        <div className="mt-14 grid grid-cols-3 gap-4">
          {[
            { n: '1', label: 'Beskriv personen' },
            { n: '2', label: 'AI väljer böcker' },
            { n: '3', label: 'Köp direkt' },
          ].map(({ n, label }) => (
            <div key={n} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm flex items-center justify-center mx-auto mb-3">
                {n}
              </div>
              <p className="text-sm font-medium text-gray-700">{label}</p>
            </div>
          ))}
        </div>

        {/* Trustsignaler */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex items-center justify-center gap-6 text-sm text-gray-400">
          <span>🔒 Ingen registrering</span>
          <span>👁 Inget sparas</span>
          <span>⏱ 30 sekunder</span>
        </div>

      </div>
    </div>
  )
}
