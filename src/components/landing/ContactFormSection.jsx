import React, { useState } from "react";

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
    <section className="absolute top-[3467px] left-[calc(50.00%_-_597px)] w-[1197px] h-[546px] bg-[#00184c] rounded-[40px]">

      <div className="flex flex-col w-[473px] items-end gap-6 absolute top-[60px] left-[calc(50.00%_+_78px)]">
        <h2 className="relative self-stretch mt-[-1.00px] [font-family:'Tel_Aviv-Regular',Helvetica] font-normal text-white text-[40px] tracking-[0] leading-[48.0px] [direction:rtl]">
          <span className="[font-family:'Tel_Aviv-Regular',Helvetica] font-normal text-white text-[40px] tracking-[0] leading-[48.0px]">
            לא בטוחים מה הצעד הבא?{" "}
          </span>
          <span className="[font-family:'Tel_Aviv-Bold',Helvetica] font-bold">
            אנחנו כאן בשבילכם
          </span>
        </h2>

        <p className="relative w-fit ml-[-1.00px] [font-family:'Assistant',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[28.8px] whitespace-nowrap [direction:rtl]">
          השאירו פרטים ונעזור לכם להבין בדיוק מה צריך לעשות
        </p>

        <form
          onSubmit={handleSubmit}
          className="flex flex-wrap w-[392px] items-start justify-end gap-[8px_8px] relative flex-[0_0_auto]"
        >
          {formFields.map((field) => (
            <div
              key={field.name}
              className="flex w-[392px] items-start justify-center gap-3 relative"
            >
              <div className="flex flex-col h-[46px] items-end justify-center gap-8 px-4 py-0 relative flex-1 grow bg-white rounded-lg">
                <div className="inline-flex items-center justify-center gap-1.5 relative flex-[0_0_auto]">
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
                    className="relative w-full mt-[-1.00px] [font-family:'Assistant',Helvetica] text-[13px] tracking-[0] leading-[14px] whitespace-nowrap font-normal [direction:rtl] text-right bg-white"
                    style={{ color: '#2C3E50', backgroundColor: 'white' }}
                    required
                    aria-required="true"
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="inline-flex h-[42px] items-start relative">
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 pt-[var(--05-component-tokens-v-padding)] pb-[var(--05-component-tokens-v-padding)] pl-[22px] pr-8 relative self-stretch flex-[0_0_auto] rounded-[var(--04-sizing-tokens-radius-s)] bg-[linear-gradient(139deg,rgba(250,125,0,1)_0%,rgba(255,192,57,1)_100%)] cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="שלח טופס"
            >
              <img
                className="relative w-6 h-6 mt-[-3.00px] mb-[-3.00px]"
                alt=""
                src="https://c.animaapp.com/VuAXsrkU/img/linear---arrows---arrow-left.svg"
                aria-hidden="true"
              />
              <span className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-01-primitives-colours-grayscale-0 text-lg text-left tracking-[0] leading-[18px] whitespace-nowrap [direction:rtl]">
                שלח
              </span>
            </button>
          </div>
        </form>
      </div>

      <img
        className="absolute top-[31px] left-[29px] w-[570px] h-[552px] aspect-[1.03]"
        alt="בית מודרני מבטון"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-2-1.png"
      />
    </section>
  );
};
