import { Link } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import farmingIcon from "/assets/farming-icon.png";
import "./homepage.css";

const Homepage = () => {
  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1 className="hero-title">AI-Driven Farming Practices</h1>

        <p className="hero-subtitle">Precision is the new productivity</p>
        
        <SignedIn>
          <Link className="hero-button" to="/dashboard">Get Started</Link>
        </SignedIn>

        <SignedOut>
          <Link className="hero-button" to="/sign-in">Get Started</Link>
        </SignedOut>
      </div>

      <div className="hero-image-wrapper">
        <img src={farmingIcon} className="hero-image" alt="Farming Icon" />
      </div>
    </div>
  );
};

export default Homepage;