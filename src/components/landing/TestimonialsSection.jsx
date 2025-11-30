import React from "react";
import { useNavigate } from "react-router-dom";

export const TestimonialsSection = () => {
  const navigate = useNavigate();

  return (
    <section className="absolute top-[3040px] left-[calc(50.00%_-_718px)] w-[1440px] h-[417px]">

      <div className="flex flex-col w-[830px] items-center gap-4 absolute top-[97px] left-[305px]">
        <h2 className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistBold',Helvetica] font-bold text-[#002169] text-[40px] text-center tracking-[0] leading-[48.0px] whitespace-nowrap [direction:rtl]">
          מוכנים להתחיל?
        </h2>

        <p className="relative w-[756px] [font-family:'Assistant',Helvetica] font-normal text-[#002169] text-2xl text-center tracking-[0] leading-[28.8px] [direction:rtl]">
          זה הרגע להפוך תהליך גדול ומאתגר לחוויה פשוטה וברורה.
          <br /> היתר הבנייה שלכם יכול להיות הרבה יותר מהיר – והמערכת כבר מוכנה
          בשבילכם.
        </p>
      </div>

      <div className="inline-flex items-start absolute top-[259px] left-[calc(50.00%_-_112px)]">
        <button
          className="inline-flex items-center justify-center gap-2 pt-[var(--05-component-tokens-v-padding)] pb-[var(--05-component-tokens-v-padding)] px-7 relative flex-[0_0_auto] rounded-[var(--04-sizing-tokens-radius-s)] bg-[linear-gradient(139deg,rgba(250,125,0,1)_0%,rgba(255,192,57,1)_100%)] cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[rgba(250,125,0,0.5)]"
          type="button"
          aria-label="התחל הגשת מסמכים"
          onClick={() => navigate('/auth?mode=signup')}
        >
          <span className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-01-primitives-colours-grayscale-0 text-lg text-left tracking-[0] leading-[18px] whitespace-nowrap [direction:rtl]">
            התחל הגשת מסמכים
          </span>
        </button>
      </div>
    </section>
  );
};
