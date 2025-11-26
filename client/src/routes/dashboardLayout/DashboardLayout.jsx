import { Outlet, useNavigate } from 'react-router-dom'
import './dashboardLayout.css'
import { useAuth } from '@clerk/clerk-react'
import { useEffect, useState } from 'react'
import ChatList from "../../components/chatList/ChatList"

const DashboardLayout = () => {
  const { userId, isLoaded } = useAuth()
  const navigate = useNavigate()

  // Mobile menu state
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    if (isLoaded && !userId) {
      navigate("/sign-in")
    }
  }, [isLoaded, userId, navigate])

  if (!isLoaded) return "Loading..."

  return (
    <div className="dashboardLayout">

      {/* Mobile Top Bar */}
      <div className="mobileHeader">
        <button
          className="menuBtn"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Backdrop when menu open (click to close) */}
      <div
        className={`backdrop ${isMenuOpen ? "open" : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Sidebar ChatList */}
      <div className={`menu ${isMenuOpen ? "open" : ""}`}>
        {/* Optional close control inside the menu for clearer UX on mobile */}
        <button className="closeBtn" onClick={() => setIsMenuOpen(false)} aria-label="Close chat list">✕</button>
        <ChatList />
      </div>

      {/* Content Area */}
      <div className="content" onClick={() => isMenuOpen && setIsMenuOpen(false)}>
        <Outlet />
      </div>
    </div>
  )
}

export default DashboardLayout
