import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import FormPage from './components/FormPage'
import ResultsPage from './components/ResultsPage'

export default function App() {
  return (
    <div className="min-h-screen bg-bg">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-xl focus:text-sm focus:font-semibold"
      >
        Skip to content
      </a>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/find" element={<FormPage />} />
        <Route path="/results" element={<ResultsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
