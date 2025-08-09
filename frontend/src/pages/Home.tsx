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

        {/* History anchor placeholder; content can be replaced later */}
        <section id="history" className="py-16 bg-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-deep-blue mb-4">
              Our History
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore the rich story of Hotel Annapurna Samar — the first and
              oldest lodge in the village, shaped by the Himalayas and warm
              local hospitality.
            </p>
          </div>
        </section>

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
