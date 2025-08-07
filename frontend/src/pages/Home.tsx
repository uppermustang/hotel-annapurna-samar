import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import TrustBadges from "../components/TrustBadges";

import Experiences from "../components/Experiences";
import SocialProof from "../components/SocialProof";
import Culinary from "../components/Culinary";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import FinalCTA from "../components/FinalCTA";
import Footer from "../components/Footer";

const Home: React.FC = () => {
  return (
    <>
      <Header />
      <HeroSection />
      <TrustBadges />
      <Experiences />
      <SocialProof />
      <Culinary />
      <Testimonials />
      <FAQ />
      <FinalCTA />
      <Footer />
    </>
  );
};

export default Home;
