import React from "react";
import { useNavigate } from "react-router-dom";

export const PropertyDetailsSection = () => {
  const navigate = useNavigate();

  return (
    <footer className="flex flex-col w-[1440px] items-center gap-8 px-[120px] py-6 absolute left-[calc(50.00%_-_720px)] bottom-0 bg-[#00184c] shadow-[0px_0px_20px_#0000001a]">
      <div className="flex flex-col items-center pl-[52px] pr-0 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="relative w-[253.24px] h-[111.37px]">
          <h1 className="absolute top-9 left-px [font-family:'Tel_Aviv-ModernistRegular',Helvetica] text-white text-[60.6px] text-left tracking-[-1.21px] leading-[normal] font-normal [direction:rtl]">
            קל-היתר
          </h1>

          <img
            className="absolute w-[98px] h-[62px] top-0 left-[153px]"
            alt="קל-היתר לוגו"
            src="https://c.animaapp.com/VuAXsrkU/img/group-10@2x.png"
          />
        </div>

        <p className="relative w-fit [font-family:'Assistant',Helvetica] font-normal text-white text-[28px] tracking-[0] leading-[33.6px] whitespace-nowrap [direction:rtl]">
          בנייה מתחילה בהיתר. היתר מתחיל בקל־היתר
        </p>
      </div>

      <div className="inline-flex flex-col items-center gap-4 relative flex-[0_0_auto] ml-[-120.00px] mr-[-120.00px]">
        <hr
          className="relative w-[1440px] h-px object-cover border-0 bg-white"
          aria-hidden="true"
        />

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/terms')}
            className="[font-family:'Assistant',Helvetica] font-normal text-white text-lg cursor-pointer hover:underline [direction:rtl]"
          >
            תנאי שימוש
          </button>
          <p className="relative w-fit [font-family:'Assistant',Helvetica] font-normal text-[#fffefe] text-lg text-center tracking-[0] leading-6 whitespace-nowrap [direction:rtl]">
            © כל הזכויות שמורות לקל-היתר 24 2025
          </p>
        </div>
      </div>
    </footer>
  );
};

