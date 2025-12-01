import React from "react";
import "../../pages/LandingPage.css";

export const FeaturesSection = () => {
  return (
    <section className="features-section">
      <img
        className="features-section-bg"
        alt=""
        src="https://c.animaapp.com/VuAXsrkU/img/rectangle-921229.png"
        role="presentation"
      />

      <p className="features-section-description">
        תהליך קבלת ההיתר הופך אצלנו למסלול פשוט וברור.
        <br /> המערכת מדריכה אתכם צעד-אחר-צעד, מציגה מה נדרש בכל שלב, ומעדכנת
        בזמן אמת עד לרגע שבו ההיתר מאושר.
        <br />
        ככה זה כשיש שילוב של טכנולוגיה חכמה וליווי מקצועי שמתרחש בשקט מאחורי
        הקלעים.
      </p>

      <h2 className="features-section-title">
        איך זה מתבצע התהליך?
      </h2>

      <img
        className="features-section-image"
        alt="תהליך קבלת היתר"
        src="https://c.animaapp.com/VuAXsrkU/img/-----.png"
      />
    </section>
  );
};
