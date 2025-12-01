import React from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/LandingPage.css";

export const NavigationBarSection = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="nav-bar"
      role="navigation"
      aria-label="Main navigation"
    >
      <button
        className="nav-login-button"
        type="button"
        aria-label="התחברות"
        onClick={() => navigate('/auth?mode=signin')}
      >
        <span className="nav-login-button-text">התחברות</span>
      </button>

      <a
        href="/"
        className="nav-logo-link"
        aria-label="קל-היתר - דף הבית"
      >
        <span className="nav-logo-text">קל-היתר</span>
        <img
          className="nav-logo-icon"
          alt="קל-היתר לוגו"
          src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
        />
      </a>
    </nav>
  );
};
