import React from "react";
import { useNavigate } from "react-router-dom";
import "../../pages/LandingPage.css";

export const TestimonialsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="testimonials-section">
      <div className="testimonials-content">
        <h2 className="testimonials-title">
          מוכנים להתחיל?
        </h2>

        <p className="testimonials-description">
          זה הרגע להפוך תהליך גדול ומאתגר לחוויה פשוטה וברורה.
          <br /> היתר הבנייה שלכם יכול להיות הרבה יותר מהיר – והמערכת כבר מוכנה
          בשבילכם.
        </p>
      </div>

      <div className="testimonials-button-container">
        <button
          className="testimonials-button"
          type="button"
          aria-label="התחל תהליך קבלת היתר בניה"
          onClick={() => navigate('/auth?mode=signup')}
        >
          <span className="testimonials-button-text">
            התחל תהליך קבלת היתר בניה
          </span>
        </button>
      </div>
    </section>
  );
};
