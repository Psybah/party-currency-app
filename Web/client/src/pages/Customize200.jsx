import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { TextEditor } from "../components/currency/TextEditor";
import { ImageEditor } from "../components/currency/ImageEditor";
import { CurrencyCanvas } from "../components/currency/CurrencyCanvas";
import { saveCurrency } from "../api/currencyApi";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";

const Customize200 = () => {
  const navigate = useNavigate();
  const authenticated = useAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentSide, setCurrentSide] = useState("front");
  const [isLoading, setIsLoading] = useState(false);
  const [currencyData, setCurrencyData] = useState({
    front: {
      texts: {
        celebration: "Celebration of Life",
        currencyName: "Party Currency",
        eventId: "",
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

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);
      
      // Prepare data for saving
      const saveData = {
        texts: currencyData.front.texts,
        backTexts: currencyData.back.texts,
        portraitImage: currencyData.front.portraitImage,
        backPortraitImage: currencyData.back.portraitImage,
        denomination: "200"
      };

      await saveCurrency(saveData);
      toast.success("Currency template saved successfully!");
      navigate("/templates");
    } catch (error) {
      console.error('Error saving currency:', error);
      if (error.message === 'Session expired. Please login again.') {
        toast.error('Your session has expired. Please login again.');
        navigate('/login');
      } else {
        toast.error("Failed to save currency template");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay message="Checking authentication..." />;
  }

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
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`w-full px-6 py-3 bg-bluePrimary text-white rounded-lg transition-colors ${
                isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bluePrimary/90'
              }`}
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
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
          denomination="200"
        />
      )}

      {showImageEditor && (
        <ImageEditor
          side={currentSide}
          currentImage={currencyData[currentSide].portraitImage}
          onClose={() => setShowImageEditor(false)}
          onSave={(imageUrl) => handleImageSave(currentSide, imageUrl)}
          denomination="200"
        />
      )}
    </div>
  );
};

export default Customize200;