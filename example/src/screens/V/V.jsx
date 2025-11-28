import React from "react";
import { CallToActionSection } from "./sections/CallToActionSection";
import { ContactFormSection } from "./sections/ContactFormSection";
import { FeaturesSection } from "./sections/FeaturesSection";
import { HeroSection } from "./sections/HeroSection";
import { ImageGallerySection } from "./sections/ImageGallerySection";
import { InfoSection } from "./sections/InfoSection";
import { LayoutWrapperSection } from "./sections/LayoutWrapperSection";
import { MainContentSection } from "./sections/MainContentSection";
import { NavigationBarSection } from "./sections/NavigationBarSection";
import { PropertyDetailsSection } from "./sections/PropertyDetailsSection";
import { PropertyOverviewSection } from "./sections/PropertyOverviewSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

export const V = () => {
  return (
    <div
      className="bg-[#fdfdfd] overflow-hidden w-full min-w-[1440px] min-h-[4362px] relative"
      data-model-id="83:712"
    >
      <PropertyDetailsSection />
      <NavigationBarSection />
      <ImageGallerySection />
      <MainContentSection />
      <LayoutWrapperSection />
      <div className="absolute top-[1309px] left-[389px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-[#002169] text-[40px] tracking-[-0.80px] leading-[48.0px] whitespace-nowrap [direction:rtl]">
        למה לבחור בקל־היתר
      </div>
      <CallToActionSection />
      <HeroSection />
      <InfoSection />
      <PropertyOverviewSection />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactFormSection />
    </div>
  );
};
