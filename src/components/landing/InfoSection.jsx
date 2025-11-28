import React from "react";

export const InfoSection = () => {
  const infoData = {
    title: "חיסכון בכסף",
    description:
      "טיפול מסודר ומדויק מקצר את זמן העבודה ומונע עלויות מיותרות שנוצרות מעיכובים ותיקונים.",
  };

  return (
    <section
      className="flex w-[626px] items-center gap-6 pl-0 pr-1 py-0 absolute top-[1675px] left-[132px]"
      aria-labelledby="info-section-title"
    >
      <div className="flex flex-col items-end gap-4 relative flex-1 grow">
        <h2
          id="info-section-title"
          className="relative self-stretch mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-[#002169] text-2xl tracking-[-0.48px] leading-[28.8px] [direction:rtl]"
        >
          {infoData.title}
        </h2>

        <p className="relative self-stretch [font-family:'Assistant',Helvetica] font-normal text-[#00184c] text-xl tracking-[0] leading-[30px] [direction:rtl]">
          {infoData.description}
        </p>
      </div>

      <img
        className="relative self-stretch w-1.5 mr-[-6.00px]"
        alt=""
        role="presentation"
        src="https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg"
      />
    </section>
  );
};
