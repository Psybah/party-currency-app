import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardHeader from "../components/DashboardHeader";
import { TextEditor } from "../components/currency/TextEditor";
import { ImageEditor } from "../components/currency/ImageEditor";
import { CurrencyCanvas } from "../components/currency/CurrencyCanvas";
import { saveCurrency } from "../api/currencyApi";
import { getEvents } from "../api/eventApi";
import { useAuthenticated } from "@/lib/hooks";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Customize500 = () => {
  const navigate = useNavigate();
  const authenticated = useAuthenticated();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentSide, setCurrentSide] = useState("front");
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");
  const [currencyData, setCurrencyData] = useState({
    front: {
      texts: {
        celebration: "Happy Birthday!",
        currencyName: "Party Currency",
        eventId: "",
      },
      portraitImage: null,
    },
    back: {
      texts: {
        celebration: "Happy Birthday!",
      },
      portraitImage: null,
    },
  });

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoadingEvents(true);
      try {
        const data = await getEvents();
        setEvents(data.events || []);
        // If we have events, set the first one as default
        if (data.events && data.events.length > 0) {
          setSelectedEvent(data.events[0].event_id);
          // Update currency data with the selected event ID
          setCurrencyData(prev => ({
            ...prev,
            front: {
              ...prev.front,
              texts: {
                ...prev.front.texts,
                eventId: data.events[0].event_id
              }
            }
          }));
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events. Please try again.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleEventChange = (eventId) => {
    setSelectedEvent(eventId);
    // Update currency data with the selected event ID
    setCurrencyData(prev => ({
      ...prev,
      front: {
        ...prev.front,
        texts: {
          ...prev.front.texts,
          eventId: eventId
        }
      }
    }));
  };

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
    // Validate if an event is selected
    if (!selectedEvent) {
      toast.error("Please select an event before saving");
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Prepare data for saving
      const saveData = {
        texts: currencyData.front.texts,
        backTexts: currencyData.back.texts,
        portraitImage: currencyData.front.portraitImage,
        backPortraitImage: currencyData.back.portraitImage,
        eventId: selectedEvent,
        denomination: "500"
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
            {/* Event Selection */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Select Event</h3>
              <div className="border border-gray-200 rounded-lg p-4 bg-white">
                <div className="mb-4">
                  <Select
                    value={selectedEvent}
                    onValueChange={handleEventChange}
                    disabled={isLoadingEvents}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Select an event"} />
                    </SelectTrigger>
                    <SelectContent>
                      {events.length > 0 ? (
                        events.map((event) => (
                          <SelectItem key={event.event_id} value={event.event_id}>
                            {event.event_name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-events" disabled>
                          {isLoadingEvents ? "Loading..." : "No events found"}
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-500 mt-2">
                    {!selectedEvent && events.length > 0 && "Please select an event to link to this currency"}
                    {events.length === 0 && !isLoadingEvents && (
                      <span className="text-red-500">
                        You need to <a href="/create-event" className="text-bluePrimary underline">create an event</a> first
                      </span>
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Front Side */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Front Side</h3>
              <div className="relative border border-gray-200 rounded-lg p-4 bg-white">
                <CurrencyCanvas
                  templateImage="/lovable-uploads/500-front-template.png"
                  texts={currencyData.front.texts}
                  portraitImage={currencyData.front.portraitImage}
                  side="front"
                  denomination="500"
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
                  templateImage="/lovable-uploads/500-back-template.png"
                  texts={currencyData.back.texts}
                  portraitImage={currencyData.back.portraitImage}
                  side="back"
                  denomination="500"
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
              disabled={isLoading || !selectedEvent}
              className={`w-full px-6 py-3 bg-bluePrimary text-white rounded-lg transition-colors ${
                (isLoading || !selectedEvent) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-bluePrimary/90'
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
          denomination="500"
        />
      )}

      {showImageEditor && (
        <ImageEditor
          side={currentSide}
          currentImage={currencyData[currentSide].portraitImage}
          onClose={() => setShowImageEditor(false)}
          onSave={(imageUrl) => handleImageSave(currentSide, imageUrl)}
          denomination="500"
        />
      )}
    </div>
  );
};

export default Customize500;