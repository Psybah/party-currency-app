import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import About from "./pages/About";
import Features from "./pages/Features";
import CTASection from "./pages/CTASection";
import Contact from "./pages/Contact";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import CelebrantSignup from "./pages/CelebrantSignup";
import MerchantSignup from "./pages/MerchantSignup";
import ForgotPassword from "./pages/ForgotPassword";
import { ContextWrapper } from "./context";
import TermsOfService from "./pages/TermsOfService";
import Dashboard from "./pages/Dashboard";
import CustomCurrency from "./pages/CustomCurrency";
import ReconciliationService from "./pages/ReconciliationService";
import VendorKiosk from "./pages/VendorKiosk";
import FootSoldiers from "./pages/FootSoldiers";

const App = () => {
  return (
    <Router>
      <ContextWrapper>
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
              </>
            }
          />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/celebrant-signup" element={<CelebrantSignup />} />
          <Route path="/merchant-signup" element={<MerchantSignup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/custom-currency" element={<CustomCurrency />} />
          <Route path="/reconciliation-service" element={<ReconciliationService />} />
          <Route path="/vendor-kiosk-system" element={<VendorKiosk />} />
          <Route path="/foot-soldiers" element={<FootSoldiers />} />
        </Routes>
        <Footer />
      </ContextWrapper>
    </Router>
  );
};

export default App;
