import React from "react";
import "../../pages/LandingPage.css";

export const PropertyOverviewSection = () => {
  const content = {
    title: "חיסכון בזמן",
    description:
      "מערכת אוטומטית שמסדרת, ממיינת ומגישה את החומרים במקומכם – ובכך מזרזת משמעותית את קבלת ההיתר.",
  };

  return (
    <section
      className="content-section content-section-property"
      aria-labelledby="property-overview-title"
    >
      <div className="content-section-inner">
        <h2
          id="property-overview-title"
          className="content-section-title"
        >
          {content.title}
        </h2>

        <p className="content-section-description">
          {content.description}
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
