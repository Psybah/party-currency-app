import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { TextEditor } from "../components/currency/TextEditor";
import { ImageEditor } from "../components/currency/ImageEditor";
import { CurrencyCanvas } from "../components/currency/CurrencyCanvas";

const Customize200 = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentSide, setCurrentSide] = useState("front");
  const [currencyData, setCurrencyData] = useState({
    front: {
      texts: {
        celebration: "Celebration of Life",
        currencyName: "Party Currency",
        eventId: "A2BB26789",
      },
      portraitImage: null,
    },
    back: {
      texts: {
        celebration: "Celebration of Life",
      },
      portraitImage: null,
    },
  });

  const handleTextSave = (side, texts) => {
    setCurrencyData(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        texts: texts,
      },
    }));
    setShowTextEditor(false);
  };

  const handleImageSave = (side, imageUrl) => {
    setCurrencyData(prev => ({
      ...prev,
      [side]: {
        ...prev[side],
        portraitImage: imageUrl,
      },
    }));
    setShowImageEditor(false);
  };

  return (
    <div className="bg-white min-h-screen">
      <DashboardSidebar
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <div className="md:pl-64">
        <DashboardHeader toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />

        <main className="p-4 md:p-6">
          <button
            onClick={() => navigate("/templates")}
            className="flex items-center text-gold hover:text-yellow-600 transition-colors mb-8"
          >
            <ChevronLeft className="w-6 h-6" />
            <span className="ml-2">Back to Templates</span>
          </button>

          <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
            {/* Front Side */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Front Side</h3>
              <div className="relative border border-gray-200 rounded-lg p-4 bg-white">
                <CurrencyCanvas
                  templateImage="/lovable-uploads/200-front-template.png"
                  texts={currencyData.front.texts}
                  portraitImage={currencyData.front.portraitImage}
                  side="front"
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      setCurrentSide("front");
                      setShowTextEditor(true);
                    }}
                    className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                  >
                    Edit Front Text
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentSide("front");
                      setShowImageEditor(true);
                    }}
                    className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>

            {/* Back Side */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Back Side</h3>
              <div className="relative border border-gray-200 rounded-lg p-4 bg-white">
                <CurrencyCanvas
                  templateImage="/lovable-uploads/200-back-template.png"
                  texts={currencyData.back.texts}
                  portraitImage={currencyData.back.portraitImage}
                  side="back"
                />
                <div className="mt-4 flex flex-wrap gap-4">
                  <button 
                    onClick={() => {
                      setCurrentSide("back");
                      setShowTextEditor(true);
                    }}
                    className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                  >
                    Edit Back Text
                  </button>
                  <button 
                    onClick={() => {
                      setCurrentSide("back");
                      setShowImageEditor(true);
                    }}
                    className="px-4 md:px-6 py-3 border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                  >
                    Change Image
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto mt-8">
            <button
              onClick={() => {
                // Here you would typically save the currency data to your backend
                console.log("Saving currency data:", currencyData);
                navigate("/templates");
              }}
              className="w-full px-6 py-3 bg-bluePrimary text-white rounded-lg hover:bg-bluePrimary/90 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </main>
      </div>

      {showTextEditor && (
        <TextEditor
          side={currentSide}
          initialTexts={currencyData[currentSide].texts}
          onClose={() => setShowTextEditor(false)}
          onSave={(texts) => handleTextSave(currentSide, texts)}
        />
      )}

      {showImageEditor && (
        <ImageEditor
          side={currentSide}
          currentImage={currencyData[currentSide].portraitImage}
          onClose={() => setShowImageEditor(false)}
          onSave={(imageUrl) => handleImageSave(currentSide, imageUrl)}
        />
      )}
    </div>
  );
};

export default Customize200;