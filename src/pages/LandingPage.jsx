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
    <>
      <div className="landing-page-container">
        {/* Navigation */}
        <NavigationBarSection />
        
        {/* Hero Section */}
        <img
          className="hero-background-img"
          alt="Hero background"
          src="/hero-background.png"
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
        
        {/* Why Choose Section - Unified */}
        <section className="why-choose-section">
          <div className="why-choose-content">
            <img
              className="why-choose-image"
              alt="בית מודרני מבטון"
              src="/why-choose-image.png"
            />
            
            <div className="why-choose-text">
              <h2 className="why-choose-title">למה לבחור בקל־היתר</h2>
              <CallToActionSection />
              <HeroSection />
              <InfoSection />
              <PropertyOverviewSection />
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <FeaturesSection />
        
        {/* CTA Section */}
        <TestimonialsSection />
        
        {/* Contact Form */}
        <ContactFormSection />
      </div>
      
      {/* Footer - Independent from container */}
      <PropertyDetailsSection />
    </>
  );
}

export default LandingPage;
