import { Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import LandingPage from './pages/LandingPage'
import DashboardPage from './pages/DashboardPage'
import TickerPage from './pages/TickerPage'
import EventPage from './pages/EventPage'
import ThreadPage from './pages/ThreadPage'
import ProfilePage from './pages/ProfilePage'
import AuthPage from './pages/AuthPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route element={<Layout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ticker/:symbol" element={<TickerPage />} />
        <Route path="/event/:eventId" element={<EventPage />} />
        <Route path="/thread/:threadId" element={<ThreadPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  )
}

export default App

