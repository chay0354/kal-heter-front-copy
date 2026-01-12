import React from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/LandingPage.css";

export const PropertyDetailsSection = () => {
  const navigate = useNavigate();

  return (
    <footer className="footer-section">
      <div className="footer-content">
        <div className="footer-logo-wrapper">
          <h1 className="footer-logo-text">קל-היתר</h1>
          <img
            className="footer-logo-icon"
            alt="קל-היתר לוגו"
            src="https://c.animaapp.com/VuAXsrkU/img/group-10@2x.png"
          />
        </div>

        <p className="footer-tagline">
          בנייה מתחילה בהיתר. היתר מתחיל בקל־היתר
        </p>
      </div>

      <div className="footer-accessibility-section">
        <p className="footer-accessibility-title">האתר נגיש ע״פ תקן WCAG – level A</p>
      </div>

      <div className="footer-bottom">
        <hr className="footer-divider" aria-hidden="true" />

        <div className="footer-links">
          <button
            onClick={() => navigate('/terms')}
            className="footer-link-button"
          >
            תנאי שימוש
          </button>
          <p className="footer-copyright">
            © כל הזכויות שמורות לקל-היתר 24 2025
          </p>
        </div>
      </div>
    </footer>
  );
};


