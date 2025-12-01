import React from "react";
import "../../pages/LandingPage.css";

export const MainContentSection = () => {
  const statsData = [
    {
      value: "24/7",
      label: "זמינות מלאה",
    },
    {
      value: "100%",
      label: "ליווי מקצועי",
    },
    {
      value: "95%",
      label: "קיצור תהליך",
    },
    {
      value: "+1,000",
      label: "לקוחות מרוצים",
    },
  ];

  return (
    <section
      className="stats-section"
      aria-label="Statistics"
    >
      {statsData.map((stat, index) => (
        <article
          key={index}
          className="stats-item"
        >
          <div className="stats-value">{stat.value}</div>
          <div className="stats-label">{stat.label}</div>
        </article>
      ))}
    </section>
  );
};
