import React from "react";
import { useNavigate } from "react-router-dom";
import { CallToActionSection } from "../components/landing/CallToActionSection";
import { ContactFormSection } from "../components/landing/ContactFormSection";
import { FeaturesSection } from "../components/landing/FeaturesSection";
import { HeroSection } from "../components/landing/HeroSection";
import { ImageGallerySection } from "../components/landing/ImageGallerySection";
import { InfoSection } from "../components/landing/InfoSection";
import { LayoutWrapperSection } from "../components/landing/LayoutWrapperSection";
import { MainContentSection } from "../components/landing/MainContentSection";
import { NavigationBarSection } from "../components/landing/NavigationBarSection";
import { PropertyDetailsSection } from "../components/landing/PropertyDetailsSection";
import { PropertyOverviewSection } from "../components/landing/PropertyOverviewSection";
import { TestimonialsSection } from "../components/landing/TestimonialsSection";

function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div
      className="bg-[#fdfdfd] overflow-hidden w-full min-w-[1440px] min-h-[4362px] relative"
      data-model-id="83:712"
    >
      <PropertyDetailsSection />
      <NavigationBarSection />
      
      {/* Hero Background Image */}
      <img
        className="absolute top-32 left-[120px] w-[1200px] h-[628px] rounded-[32px] object-cover"
        alt="Hero background"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-1.png"
      />
      
      {/* Hero Buttons */}
      <div className="inline-flex items-start absolute top-[564px] left-[951px] z-10">
        <button
          className="inline-flex items-center justify-center gap-2 pt-[var(--05-component-tokens-v-padding)] pb-[var(--05-component-tokens-v-padding)] px-7 relative flex-[0_0_auto] rounded-[var(--04-sizing-tokens-radius-s)] bg-[linear-gradient(139deg,rgba(250,125,0,1)_0%,rgba(255,192,57,1)_100%)] cursor-pointer transition-opacity hover:opacity-90"
          aria-label="התחל תהליך קבלת היתר בניה"
          onClick={() => navigate('/auth?mode=signup')}
        >
          <span className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-white text-lg text-left tracking-[0] leading-[18px] whitespace-nowrap [direction:rtl]">
            התחל תהליך קבלת היתר בניה
          </span>
        </button>
      </div>

      <div className="flex w-[159px] items-start absolute top-[564px] left-[779px] z-10">
        <button
          className="flex items-center justify-center gap-2 pt-[var(--05-component-tokens-v-padding)] pb-[var(--05-component-tokens-v-padding)] px-7 relative flex-1 grow bg-[#ffffff03] rounded-[var(--04-sizing-tokens-radius-s)] border border-solid border-white backdrop-blur-[3px] backdrop-brightness-[100%] [-webkit-backdrop-filter:blur(3px)_brightness(100%)] cursor-pointer transition-all hover:bg-[#ffffff0a]"
          aria-label="צור קשר"
          onClick={() => navigate('/auth?mode=signin')}
        >
          <span className="relative w-fit mt-[-1.00px] [font-family:'Tel_Aviv-ModernistRegular',Helvetica] font-normal text-white text-lg text-left tracking-[0] leading-[18px] whitespace-nowrap [direction:rtl]">
            צור קשר
          </span>
        </button>
      </div>
      
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
}

export default LandingPage;
