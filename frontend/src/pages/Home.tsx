import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TrustBadges from "../components/TrustBadges";

import Experiences from "../components/Experiences";
import SocialProof from "../components/SocialProof";
import Culinary from "../components/Culinary";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Map from "../components/Map";
import Subscribe from "../components/Subscribe";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <HeroSection />
        <TrustBadges />
        <Experiences />
        <SocialProof />
        <Culinary />
        <Testimonials />
        <FAQ />

        {/* Location & Contact Section */}
        <div className="bg-gray-50">
          <Map />
        </div>

        {/* Newsletter Subscription Section - Distinct from Map */}
        <Subscribe />
      </main>
      <Footer />
    </div>
  );
};

export default Home;
