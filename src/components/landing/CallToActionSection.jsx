import React from "react";
import "../../pages/LandingPage.css";

export const CallToActionSection = () => {
  const sectionData = {
    title: "בקרות מקצועיות",
    description:
      "כל מסמך וכל פרט עוברים בדיקה מקצועית המוודאת תאימות מלאה לדרישות הרשות המקומית.",
    lineImage: "https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg",
  };

  return (
    <section
      className="content-section content-section-cta"
      aria-labelledby="cta-section-title"
    >
      <div className="content-section-inner">
        <h2
          id="cta-section-title"
          className="content-section-title"
        >
          {sectionData.title}
        </h2>

        <p className="content-section-description">
          {sectionData.description}
        </p>
      </div>

      <img
        className="content-section-line"
        alt=""
        role="presentation"
        src={sectionData.lineImage}
      />
    </section>
  );
};
