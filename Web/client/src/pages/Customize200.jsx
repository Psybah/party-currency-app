import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { CurrencyEditor } from "@/components/CurrencyEditor";

const Customize200 = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={toggleMobileMenu} />

        <main className="p-4 md:p-6">
          <button
            onClick={() => navigate("/templates")}
            className="flex items-center text-gold hover:text-yellow-600 transition-colors mb-8"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="ml-2">Back to Templates</span>
          </button>

          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
            <div className="space-y-4">
              <img
                src="/lovable-uploads/200-front-template.png"
                alt="200 Currency Front Template"
                className="w-full rounded-lg shadow-md"
              />
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => setShowEditor(true)}
                  className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                >
                  Edit Front Text
                </button>
                <button className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors">
                  Change Image
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <img
                src="/lovable-uploads/200-back.jpg"
                alt="200 Currency Back"
                className="w-full rounded-lg shadow-md"
              />
              <div className="flex flex-wrap gap-4">
                <button className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors">
                  Edit Back Text
                </button>
                <button className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors">
                  Change Image
                </button>
              </div>
            </div>

            <button className="w-full bg-bluePrimary text-white py-4 rounded-lg hover:bg-opacity-90 transition-colors">
              Continue
            </button>
          </div>
        </main>
      </div>

      {showEditor && (
        <CurrencyEditor
          currencyImage="/lovable-uploads/200-front-template.png"
          onClose={() => setShowEditor(false)}
        />
      )}
    </div>
  );
};

export default Customize200;