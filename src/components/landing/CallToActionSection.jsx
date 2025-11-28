import React from "react";

export const CallToActionSection = () => {
  const sectionData = {
    title: "בקרות מקצועיות",
    description:
      "כל מסמך וכל פרט עוברים בדיקה מקצועית המוודאת תאימות מלאה לדרישות הרשות המקומית.",
    lineImage: "https://c.animaapp.com/VuAXsrkU/img/line-119-3.svg",
  };

  return (
    <section
      className="flex w-[626px] items-center gap-6 pl-0 pr-1 py-0 absolute top-[1381px] left-[132px]"
      aria-labelledby="cta-section-title"
    >
      <div className="flex flex-col items-end gap-4 relative flex-1 grow">
        <h2
          id="cta-section-title"
          className="relative self-stretch mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-[#002169] text-2xl tracking-[-0.48px] leading-[28.8px] [direction:rtl]"
        >
          {sectionData.title}
        </h2>

        <p className="relative self-stretch [font-family:'Assistant',Helvetica] font-normal text-[#00184c] text-xl tracking-[0] leading-[30px] [direction:rtl]">
          {sectionData.description}
        </p>
      </div>

      <img
        className="relative self-stretch w-1.5 mr-[-6.00px]"
        alt=""
        role="presentation"
        src={sectionData.lineImage}
      />
    </section>
  );
};
