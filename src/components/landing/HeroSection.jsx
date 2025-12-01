import React from "react";
import "../../pages/LandingPage.css";

export const HeroSection = () => {
  const content = {
    title: "שקיפות מוחלטת",
    description:
      "כל שלב בתהליך מוצג בצורה ברורה ופשוטה, כדי שתדעו בדיוק היכן אתם עומדים ומה הצעד הבא.",
  };

  return (
    <section
      className="content-section content-section-hero"
      aria-labelledby="hero-title"
    >
      <div className="content-section-inner">
        <h2
          id="hero-title"
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
