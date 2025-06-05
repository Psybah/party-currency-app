import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { toast } from "react-hot-toast";
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

const Customize = () => {
  const navigate = useNavigate();
  const authenticated = useAuthenticated();
  const [searchParams] = useSearchParams();
  const denomination = searchParams.get("denomination") || "200";

  const [showTextEditor, setShowTextEditor] = useState(false);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [currentSide, setCurrentSide] = useState("front");
  const [isLoading, setIsLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("");

  // Helper function to get template images based on denomination
  const getTemplateImage = (denomination, side) => {
    return `/lovable-uploads/${denomination}-${side}-template.png`;
  };

  // Helper function to get initial celebration text based on denomination
  const getInitialCelebrationText = (denomination) => {
    return denomination === "200" ? "Celebration of Life" : "Happy Birthday!";
  };

  const [currencyData, setCurrencyData] = useState({
    front: {
      texts: {
        celebration: getInitialCelebrationText(denomination),
        currencyName: "Party Currency",
        eventId: "",
      },
      portraitImage: null,
    },
    back: {
      texts: {
        celebration: getInitialCelebrationText(denomination),
      },
      portraitImage: null,
    },
  });

  // Validate denomination parameter
  useEffect(() => {
    const validDenominations = ["200", "500", "1000"];
    if (!validDenominations.includes(denomination)) {
      toast.error("Invalid denomination. Redirecting to templates.");
      navigate("/templates");
      return;
    }

    // Update currency data when denomination changes
    setCurrencyData((prev) => ({
      front: {
        ...prev.front,
        texts: {
          ...prev.front.texts,
          celebration: getInitialCelebrationText(denomination),
        },
      },
      back: {
        ...prev.back,
        texts: {
          ...prev.back.texts,
          celebration: getInitialCelebrationText(denomination),
        },
      },
    }));
  }, [denomination, navigate]);

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
          setCurrencyData((prev) => ({
            ...prev,
            front: {
              ...prev.front,
              texts: {
                ...prev.front.texts,
                eventId: data.events[0].event_id,
              },
            },
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
    setCurrencyData((prev) => ({
      ...prev,
      front: {
        ...prev.front,
        texts: {
          ...prev.front.texts,
          eventId: eventId,
        },
      },
    }));
  };

  const handleTextSave = (side, texts) => {
    setCurrencyData((prev) => ({
      ...prev,
      [side]: {
        ...prev[side],
        texts: texts,
      },
    }));
    setShowTextEditor(false);
  };

  const handleImageSave = (side, imageUrl) => {
    setCurrencyData((prev) => ({
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
        denomination: denomination,
      };

      await saveCurrency(saveData);
      toast.success("Currency template saved successfully!");
      navigate("/templates");
    } catch (error) {
      console.error("Error saving currency:", error);
      if (error.message === "Session expired. Please login again.") {
        toast.error("Your session has expired. Please login again.");
        navigate("/login");
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
      <main className="p-4 md:p-6">
        <button
          onClick={() => navigate("/templates")}
          className="flex items-center text-gold hover:text-yellow-600 transition-colors mb-8"
        >
          <ChevronLeft className="w-6 h-6" />
          <span className="ml-2">Back to Templates</span>
        </button>

        <div className="max-w-4xl mx-auto space-y-8 md:space-y-12">
          {/* Page Title */}
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold mb-2">
              Customize ₦{denomination} Currency
            </h1>
            <p className="text-gray-600">
              Design your custom party currency for this denomination.
            </p>
          </div>

          {/* Event Selection */}
          <div className="space-y-4">
            <h3 className="text-xl text-left font-semibold">Select Event</h3>
            <div className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="mb-4">
                <Select
                  value={selectedEvent}
                  onValueChange={handleEventChange}
                  disabled={isLoadingEvents}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue
                      placeholder={
                        isLoadingEvents
                          ? "Loading events..."
                          : "Select an event"
                      }
                    />
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
                  {!selectedEvent &&
                    events.length > 0 &&
                    "Please select an event to link to this currency"}
                  {events.length === 0 && !isLoadingEvents && (
                    <span className="text-red-500">
                      You need to{" "}
                      <a
                        href="/create-event"
                        className="text-bluePrimary underline"
                      >
                        create an event
                      </a>{" "}
                      first
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* Front Side */}
          <div className="space-y-4">
            <h3 className="text-xl text-left font-semibold">Front Side</h3>
            <div className="relative border border-gray-200 rounded-lg p-4 bg-white">
              <CurrencyCanvas
                templateImage={getTemplateImage(denomination, "front")}
                texts={currencyData.front.texts}
                portraitImage={currencyData.front.portraitImage}
                side="front"
                denomination={denomination}
              />
              <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                <button
                  onClick={() => {
                    setCurrentSide("front");
                    setShowTextEditor(true);
                  }}
                  className="px-3 md:px-6 py-2 md:py-3 text-sm md:text-base border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                >
                  Edit Front Text
                </button>
                <button
                  onClick={() => {
                    setCurrentSide("front");
                    setShowImageEditor(true);
                  }}
                  className="px-3 md:px-6 py-2 md:py-3 text-sm md:text-base border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                >
                  Change Image
                </button>
              </div>
            </div>
          </div>

          {/* Back Side */}
          <div className="space-y-4">
            <h3 className="text-xl text-left font-semibold">Back Side</h3>
            <div className="relative border border-gray-200 rounded-lg p-4 bg-white">
              <CurrencyCanvas
                templateImage={getTemplateImage(denomination, "back")}
                texts={currencyData.back.texts}
                portraitImage={currencyData.back.portraitImage}
                side="back"
                denomination={denomination}
              />
              <div className="mt-4 flex flex-wrap gap-2 md:gap-4">
                <button
                  onClick={() => {
                    setCurrentSide("back");
                    setShowTextEditor(true);
                  }}
                  className="px-3 md:px-6 py-2 md:py-3 text-sm md:text-base border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
                >
                  Edit Back Text
                </button>
                <button
                  onClick={() => {
                    setCurrentSide("back");
                    setShowImageEditor(true);
                  }}
                  className="px-3 md:px-6 py-2 md:py-3 text-sm md:text-base border border-bluePrimary text-bluePrimary rounded-lg hover:bg-bluePrimary hover:text-white transition-colors"
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
              isLoading || !selectedEvent
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-bluePrimary/90"
            }`}
          >
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </main>

      {showTextEditor && (
        <TextEditor
          side={currentSide}
          initialTexts={currencyData[currentSide].texts}
          onClose={() => setShowTextEditor(false)}
          onSave={(texts) => handleTextSave(currentSide, texts)}
          denomination={denomination}
        />
      )}

      {showImageEditor && (
        <ImageEditor
          side={currentSide}
          currentImage={currencyData[currentSide].portraitImage}
          onClose={() => setShowImageEditor(false)}
          onSave={(imageUrl) => handleImageSave(currentSide, imageUrl)}
          denomination={denomination}
        />
      )}
    </div>
  );
};

export default Customize;
