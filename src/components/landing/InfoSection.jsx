import React from "react";
import "../../pages/LandingPage.css";

export const InfoSection = () => {
  const infoData = {
    title: "חיסכון בכסף",
    description:
      "טיפול מסודר ומדויק מקצר את זמן העבודה ומונע עלויות מיותרות שנוצרות מעיכובים ותיקונים.",
  };

  return (
    <section
      className="content-section content-section-info"
      aria-labelledby="info-section-title"
    >
      <div className="content-section-inner">
        <h2
          id="info-section-title"
          className="content-section-title"
        >
          {infoData.title}
        </h2>

        <p className="content-section-description">
          {infoData.description}
        </p>
      </div>

      <img
        className="content-section-line"
        alt=""
        role="presentation"
        src="https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg"
      />
    </section>
  );
};
