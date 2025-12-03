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
    <section className="about-stats-section">
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
      
      <section className="about-section">
        <h2 className="about-section-title">מי אנחנו?</h2>
        <p className="about-section-description">
          אנחנו משרד אדריכלי מנוסה, שפועל כבר יותר מ־20 שנה בעולם ההיתרים והבנייה.
          לאורך השנים ראינו שוב ושוב עד כמה תהליך קבלת היתר בנייה עלול להיות ארוך,
          מסובך ומלא חוסר ודאות. אנשים מתמודדים עם טפסים לא ברורים, דרישות שמשתנות
          מרשות לרשות, ועיכובים שמגיעים בגלל טעויות קטנות. מתוך הניסיון הזה הבנו
          שהגיע הזמן לפתרון פשוט, ברור ונגיש יותר.
          <br />
          ככה נולדה קל־היתר – אפליקציה חדשנית שמפשטת את כל תהליך ההיתר. במקום
          להתמודד לבד מול בירוקרטיה, המערכת מדריכה בכל שלב, מסדרת את המסמכים,
          מציגה מה חסר ומוודאת שהכול מוגש נכון. המטרה שלנו הייתה לבנות כלי שנותן
          שליטה, מפחית טעויות, חוסך זמן ומעניק תחושת ביטחון. תהליך שהיה פעם מורכב
          – הופך עכשיו ברור, יעיל והרבה יותר אנושי.
        </p>
      </section>
    </section>
  );
};
