import React from "react";
import "../../pages/LandingPage.css";
import "./components/style.css";

export const FeaturesSection = () => {
  return (
    <section className="features-section">
      <img
        className="features-section-bg"
        alt=""
        src="https://c.animaapp.com/VuAXsrkU/img/rectangle-921229.png"
        role="presentation"
      />

      <h2 className="features-section-title">
        איך זה מתבצע<br />התהליך?
      </h2>

      <p className="features-section-description">
        תהליך קבלת ההיתר הופך אצלנו למסלול פשוט וברור.
        <br /> המערכת מדריכה אתכם צעד-אחר-צעד, מציגה מה נדרש בכל שלב, ומעדכנת
        בזמן אמת עד לרגע שבו ההיתר מאושר.
        <br />
        ככה זה כשיש שילוב של טכנולוגיה חכמה וליווי מקצועי שמתרחש בשקט מאחורי
        הקלעים.
      </p>

      <div className="screen">
        <div className="view">
          <div className="div">
            <div className="text-wrapper">שלב 1</div>
            <div className="frame">
              <div className="text-wrapper-2">רישום ראשוני</div>
              <p className="text">יוצרים משתמש ונכנסים למערכת בצורה מאובטחת.</p>
            </div>
          </div>
          <div className="view-2">
            <img className="icon-instance-node" alt="רישום ראשוני" src="/icons/1.png" />
          </div>
        </div>
        <div className="connecting-line"></div>

        <div className="view">
          <div className="div">
            <div className="text-wrapper">שלב 2</div>
            <div className="frame">
              <div className="text-wrapper-2">בחירת בית המגורים</div>
              <p className="text">מזינים גודל המגרש ובוחרים מתוך המאגר</p>
            </div>
          </div>
          <div className="view-2">
            <img className="icon-instance-node" alt="בחירת בית המגורים" src="/icons/2.png" />
          </div>
        </div>
        <div className="connecting-line"></div>

        <div className="view-3">
          <div className="div">
            <div className="text-wrapper">שלב 3</div>
            <div className="frame-2">
              <div className="text-wrapper-2">מילוי מידע תכנוני</div>
              <p className="p">המערכת מדריכה בדיוק אילו מסמכים חסרים ומה צריך לצרף</p>
            </div>
          </div>
          <div className="view-2">
            <img className="icon-instance-node" alt="מילוי מידע תכנוני" src="/icons/3.png" />
          </div>
        </div>
        <div className="connecting-line"></div>

        <div className="view-4">
          <div className="div">
            <div className="text-wrapper">שלב 4</div>
            <div className="frame">
              <div className="text-wrapper-2">הגשת בקשה להיתר</div>
              <p className="text-2">קל היתר שולחת את הבקשה ומציגה לכם כל דרישה או עדכון מהרשות</p>
            </div>
          </div>
          <div className="view-2">
            <img className="icon-instance-node" alt="הגשת בקשה להיתר" src="/icons/4.png" />
          </div>
        </div>
        <div className="connecting-line"></div>

        <div className="view-6">
          <div className="div">
            <div className="text-wrapper">שלב 5</div>
            <div className="frame">
              <div className="text-wrapper-2">קבלת היתר הבנייה</div>
              <p className="text">בסיום כל השלבים, ההיתר נחתם ומוכן להמשך העבודה.</p>
            </div>
          </div>
          <div className="view-2">
            <img className="icon-instance-node" alt="קבלת היתר הבנייה" src="/icons/6.png" />
          </div>
        </div>
      </div>
    </section>
  );
};
