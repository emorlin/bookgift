import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import FormPage from './components/FormPage'
import ResultsPage from './components/ResultsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f5f3ef]">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/hitta" element={<FormPage />} />
        <Route path="/resultat" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
