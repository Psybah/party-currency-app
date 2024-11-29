import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import About from "./pages/About";
import Features from "./pages/Features";
import CTASection from "./pages/CTASection";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <HeroSection />
              <About />
              <Features />
              <CTASection />
              <Contact />
              <Footer />
            </>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/features" element={<Features />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<div className="mt-20">Login</div>} />
        <Route path="/signup" element={<div className="mt-20">Sign Up</div>} />
      </Routes>
    </Router>
  );
};

export default App;
