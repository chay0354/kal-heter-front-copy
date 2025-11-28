import React from "react";
import { useNavigate } from "react-router-dom";

export const NavigationBarSection = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="flex w-[1440px] items-center justify-between px-[120px] py-5 absolute top-0 left-0"
      role="navigation"
      aria-label="Main navigation"
    >
      <button
        className="inline-flex items-center justify-center gap-2 pt-[var(--05-component-tokens-v-padding)] pb-[var(--05-component-tokens-v-padding)] px-7 relative flex-[0_0_auto] rounded-[var(--04-sizing-tokens-radius-s)] bg-[linear-gradient(139deg,rgba(250,125,0,1)_0%,rgba(255,192,57,1)_100%)] cursor-pointer transition-opacity hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        type="button"
        aria-label="התחברות"
        onClick={() => navigate('/auth?mode=signin')}
      >
        <span className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-01-primitives-colours-grayscale-0 text-lg text-left tracking-[0] leading-[18px] whitespace-nowrap [direction:rtl]">
          התחברות
        </span>
      </button>

      <a
        href="/"
        className="relative w-[152px] h-[66.71px] mr-[-2.00px] aspect-[2.25] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-900"
        aria-label="קל-היתר - דף הבית"
      >
        <span className="absolute top-[22px] left-0 [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-[#002169] text-[36.2px] text-left tracking-[-0.72px] leading-[normal] [direction:rtl]">
          קל-היתר
        </span>

        <img
          className="absolute w-[59px] h-[37px] top-0 left-[91px]"
          alt="קל-היתר לוגו"
          src="https://c.animaapp.com/VuAXsrkU/img/group-10-1@2x.png"
        />
      </a>
    </nav>
  );
};
