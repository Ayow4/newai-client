import { Link } from 'react-router-dom'
import './homepage.css'
import { TypeAnimation } from 'react-type-animation';
import { useState } from 'react';

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className='homepage'>
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
          <img src="/client/assets/farming-icon.png" alt="farming icon" className="bot" />
        </div>
      </div>
      {/* <div className="terms">
        <img src="/logo.png" alt="" />
        <div className="links">
          <Link to="/termsofservice">Terms of Service</Link>
          <span>|</span>
          <Link to="/privacypolicy">Privacy Policy</Link>
        </div>
      </div> */}
    </div>
  )
}

export default Homepage