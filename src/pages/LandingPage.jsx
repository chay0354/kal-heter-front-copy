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
import "./LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();
  
  return (
    <div className="landing-page-container">
      {/* Navigation */}
      <NavigationBarSection />
      
      {/* Hero Section */}
      <img
        className="hero-background-img"
        alt="Hero background"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-1.png"
      />
      
      <ImageGallerySection />
      
      {/* Hero Buttons */}
      <div className="hero-button-container hero-button-primary-container">
        <button
          className="hero-primary-button"
          aria-label="התחל תהליך קבלת היתר בניה"
          onClick={() => navigate('/auth?mode=signup')}
        >
          <span>התחל תהליך קבלת היתר בניה</span>
        </button>
      </div>

      <div className="hero-button-container hero-button-secondary-container">
        <button
          className="hero-secondary-button"
          aria-label="צור קשר"
          onClick={() => navigate('/auth?mode=signin')}
        >
          <span>צור קשר</span>
        </button>
      </div>
      
      {/* Main Content Sections */}
      <MainContentSection />
      <LayoutWrapperSection />
      
      {/* Why Choose Title */}
      <div className="why-choose-title-responsive">
        למה לבחור בקל־היתר
      </div>
      
      {/* Why Choose Image */}
      <img
        className="why-choose-image"
        alt="בית מודרני מבטון"
        src="https://c.animaapp.com/VuAXsrkU/img/3d-rendering-big-modern-concrete-house-2-1.png"
      />
      
      {/* Content Sections */}
      <CallToActionSection />
      <HeroSection />
      <InfoSection />
      <PropertyOverviewSection />
      
      {/* Features Section */}
      <FeaturesSection />
      
      {/* CTA Section */}
      <TestimonialsSection />
      
      {/* Contact Form */}
      <ContactFormSection />
      
      {/* Footer */}
      <PropertyDetailsSection />
    </div>
  );
}

export default LandingPage;
