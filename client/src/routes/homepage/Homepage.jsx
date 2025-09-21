import { Link } from 'react-router-dom'
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import './homepage.css'
import { useState } from 'react';
import farmingIcon from '/assets/farming-icon.png';

const Homepage = () => {
  const [typingStatus, setTypingStatus] = useState("human1");

  return (
    <div className="homepage ai-hero-bg">
      <div className="left">
        <h1>AI-DRIVEN FARMING PRACTICES</h1>
        <h2>Precision is the new productivity</h2>
        <h3>
          With AI, farming becomes a precise science rather than guesswork. 
          It optimizes every step from planting to harvest reducing waste 
          and boosting yields.
        </h3>

        {/* ✅ Redirect based on auth state */}
        <SignedIn>
          <Link to="/dashboard">Get Started</Link>
        </SignedIn>
        <SignedOut>
          <Link to="/sign-in">Get Started</Link>
        </SignedOut>
      </div>

      <div className="right">
        <div className="imgContainer">
          <div className="bgContainer">
            <div className="bg"></div>
          </div>
          <img src={farmingIcon} alt="Farming Icon" className="bot" />
        </div>
      </div>
    </div>
  )
}

export default Homepage
