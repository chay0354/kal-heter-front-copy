import React, { useState } from "react";
import "../../pages/LandingPage.css";

export const ContactFormSection = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
  };

  const formFields = [
    { name: "fullName", placeholder: "שם מלא", type: "text" },
    { name: "email", placeholder: "אימייל", type: "email" },
    { name: "phone", placeholder: "טלפון", type: "tel" },
  ];

  return (
    <section className="contact-form-section">
      <div className="contact-form-content">
        <h2 className="contact-form-title">
          <span className="contact-form-title-normal">לא בטוחים מה הצעד הבא? </span>
          <span className="contact-form-title-bold">אנחנו כאן בשבילכם</span>
        </h2>

        <p className="contact-form-description">
          השאירו פרטים ונעזור לכם להבין בדיוק מה צריך לעשות
        </p>

        <form
          onSubmit={handleSubmit}
          className="contact-form"
        >
          {formFields.map((field) => (
            <div
              key={field.name}
              className="contact-form-field-wrapper"
            >
              <div className="contact-form-input-wrapper">
                <label htmlFor={field.name} className="sr-only">
                  {field.placeholder}
                </label>
                <input
                  type={field.type}
                  id={field.name}
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="contact-form-input"
                  required
                  aria-required="true"
                />
              </div>
            </div>
          ))}

          <div className="contact-form-submit-wrapper">
            <button
              type="submit"
              className="contact-form-submit-button"
              aria-label="שלח טופס"
            >
              <img
                className="contact-form-submit-icon"
                alt=""
                src="https://c.animaapp.com/VuAXsrkU/img/linear---arrows---arrow-left.svg"
                aria-hidden="true"
              />
              <span className="contact-form-submit-text">שלח</span>
            </button>
          </div>
        </form>
      </div>

      <img
        className="contact-form-image"
        alt="בית מודרני מבטון"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-2-1.png"
      />
    </section>
  );
};
