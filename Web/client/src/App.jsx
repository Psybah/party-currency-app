import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<HeroSection />} />
        <Route path="/about" element={<div className="mt-20">About Us</div>} />
        <Route path="/features" element={<div className="mt-20">Features</div>} />
        <Route path="/contact" element={<div className="mt-20">Contact Us</div>} />
        <Route path="/login" element={<div className="mt-20">Login</div>} />
        <Route path="/signup" element={<div className="mt-20">Sign Up</div>} />
      </Routes>
    </Router>
  );
};

export default App;
