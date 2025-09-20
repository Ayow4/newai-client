import { Link } from 'react-router-dom'
import './homepage.css'
import { useState } from 'react';
import farmingIcon from '/assets/farming-icon.png';

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
     <div className="homepage ai-hero-bg">
      {/* <img src="/orbital.png" alt="" className="orbital" /> */}
      <div className="left">
        <h1>AI-DRIVEN FARMING PRACTICES</h1>
        <h2>Precision is the new productivity</h2>
        <h3>
        With AI, farming becomes a precise science rather than guesswork. It optimizes every step from planting to harvest reducing waste and boosting yields.
        </h3>
        <Link to="/dashboard">Get Started</Link>
      </div>
      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src={farmingIcon} alt="Farming Icon" className="bot" />
        </div>
      </div>
     {/* <footer className="homepage-footer">
    <div className="footer-content">
      <span>&copy; {new Date().getFullYear()} AI-Driven Farming Practices</span>
      <div className="footer-links">
        <Link to="/#">Terms of Service</Link>
        <span> | </span>
        <Link to="/#">Privacy Policy</Link>
      </div>
    </div>
  </footer> */}
    </div>
  )
}

export default Homepage