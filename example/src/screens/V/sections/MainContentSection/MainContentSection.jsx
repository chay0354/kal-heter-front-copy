import React from "react";

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
      className="flex flex-wrap w-[557px] items-start justify-end gap-[60px_81px] absolute top-[871px] left-[120px]"
      aria-label="Statistics"
    >
      {statsData.map((stat, index) => (
        <article
          key={index}
          className="flex flex-col w-[231px] items-end relative"
        >
          <div className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-[#002169] text-7xl text-right tracking-[-1.44px] leading-[72px] whitespace-nowrap">
            {stat.value}
          </div>
          <div className="relative w-fit [font-family:'Assistant',Helvetica] font-normal text-[#00184c] text-2xl tracking-[0] leading-9 whitespace-nowrap [direction:rtl]">
            {stat.label}
          </div>
        </article>
      ))}
    </section>
  );
};
