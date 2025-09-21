import { Link, Outlet } from "react-router-dom";
import { SignedIn, UserButton } from "@clerk/clerk-react";
import farmingIcon from "/assets/farming-icon.png";
import "./rootLayout.css";

const RootLayout = () => {
  return (
    <div className="rootLayout">
      <header>
        <Link to="/" className="logo">
          <img src={farmingIcon} alt="Farming Icon" />
          <span>AI-DRIVEN FARMING PRACTICES</span>
        </Link>
        <div className="user">
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;
