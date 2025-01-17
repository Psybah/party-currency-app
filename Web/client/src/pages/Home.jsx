import React from "react";
import Header from "../components/Header";
import HeroSection from "../components/HeroSection";
import About from "./About";
import Features from "./Features";
import Contact from "./Contact";
import CTASection from "./CTASection";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="overflow-x-hidden">
      <Header />
      <HeroSection />
      <About />
      <Features />
      <CTASection />
      <Contact />
      <Footer />
    </div>
  );
};

export default Home;