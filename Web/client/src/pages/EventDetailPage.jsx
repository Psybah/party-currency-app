import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, ArrowLeft, Download } from "lucide-react";
import { getEventById, getCurrenciesByEventId } from "@/api/eventApi";
import { downloadCurrencyImage } from "@/components/ui/CurrencyImage"; // Assuming this is the correct path
import { CurrencyCanvas } from "@/components/currency/CurrencyCanvas";
import PaymentModal from "@/components/PaymentModal";
import { useAuthenticated } from "../lib/hooks";
import { format } from "date-fns";
import {
  Calendar,
  MapPin,
  Info,
  CheckCircle2,
  XCircle,
  Tag,
  Users,
  Edit3,
  Palette,
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { USER_PROFILE_CONTEXT } from "@/context";

// Helper function for CurrencyCanvas template image
function getTemplateImage(denomination) {
  const denStr = String(denomination);
  if (denStr === "200") return "/lovable-uploads/200-front-template.png";
  if (denStr === "500") return "/lovable-uploads/500-front-template.png";
  if (denStr === "1000") return "/lovable-uploads/1000-front-template.png";
  return "/lovable-uploads/200-front-template.png"; // Default
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start text-sm text-gray-700">
    <Icon className="w-4 h-4 mr-2 mt-1 flex-shrink-0 text-bluePrimary" />
    <span className="font-medium mr-1">{label}:</span>
    <span>{value || "N/A"}</span>
  </div>
);

const StatusPill = ({ status }) => {
  let bgColor = "bg-gray-100";
  let textColor = "text-gray-700";
  let Icon = Info;

  switch (status?.toLowerCase()) {
    case "successful":
    case "completed":
    case "paid":
      bgColor = "bg-green-100";
      textColor = "text-green-700";
      Icon = CheckCircle2;
      break;
    case "pending":
      bgColor = "bg-yellow-100";
      textColor = "text-yellow-700";
      Icon = Info; // Or a Clock icon if available/suitable
      break;
    case "failed":
    case "cancelled":
      bgColor = "bg-red-100";
      textColor = "text-red-700";
      Icon = XCircle;
      break;
  }
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
    >
      <Icon className="w-3 h-3 mr-1.5" />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
    </span>
  );
};

export default function EventDetailPage() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const authenticated = useAuthenticated();
  const { userProfile } = useContext(USER_PROFILE_CONTEXT);

  const [eventDetails, setEventDetails] = useState(null);
  const [currencies, setCurrencies] = useState([]);
  const [associatedImages, setAssociatedImages] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [downloadingCurrency, setDownloadingCurrency] = useState(null);

  // Create refs for each currency canvas (front and back)
  const canvasRefs = useRef({});

  useEffect(() => {
    // if (!eventId) return;

    const fetchEventData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const eventData = await getEventById(eventId);
        setEventDetails(eventData);

        // Fetch currencies associated with this event
        try {
          const currencyData = await getCurrenciesByEventId(eventId);
          if (currencyData && currencyData.currency) {
            setCurrencies(currencyData.currency);
            console.log("currencyData for event", currencyData);
            const imagesMap = {};
            const downloadPromises = currencyData.currency.map(async (item) => {
              const denomination = item.denomination || "200";
              try {
                let frontImageUrl = null;
                if (item.front_image) {
                  frontImageUrl = await downloadCurrencyImage(
                    item.front_image,
                    String(denomination),
                    "front"
                  );
                }
                let backImageUrl = null;
                if (item.back_image) {
                  backImageUrl = await downloadCurrencyImage(
                    item.back_image,
                    String(denomination),
                    "back"
                  );
                }
                imagesMap[item.currency_id] = {
                  front: frontImageUrl,
                  back: backImageUrl,
                };
              } catch (imgErr) {
                console.error(
                  `Error downloading images for currency ${item.currency_id}:`,
                  imgErr
                );
                imagesMap[item.currency_id] = { front: null, back: null }; // Store nulls on error
              }
            });
            await Promise.all(downloadPromises);
            setAssociatedImages(imagesMap);
          } else {
            setCurrencies([]);
          }
        } catch (currencyError) {
          console.error("Error fetching currencies for event:", currencyError);
          toast.error("Could not load currencies for this event.");
          // We don't set main error here, event details might still be useful
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
        setError(err.message || "Failed to fetch event details.");
        toast.error(err.message || "Failed to load event details.");
        if (err.message === "Session expired. Please login again.") {
          navigate("/login");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEventData();
  }, [eventId, navigate]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (
      queryParams.get("action") === "pay" &&
      eventDetails &&
      currencies.length > 0
    ) {
      setIsPaymentModalOpen(true);
    }
  }, [location.search, eventDetails, currencies]);

  // Download function for currency
  const handleDownloadCurrency = async (currency, side) => {
    const canvasKey = `${currency.currency_id}-${side}`;
    const canvasRef = canvasRefs.current[canvasKey];

    if (!canvasRef || !canvasRef.isReady()) {
      toast.error(
        "Currency image not ready for download. Please wait a moment and try again."
      );
      return;
    }

    setDownloadingCurrency(canvasKey);

    try {
      const filename = `${eventDetails.event_name}-${
        currency.currency_name || "Currency"
      }-${side}-₦${currency.denomination}.png`;
      const success = canvasRef.downloadImage(filename);

      if (success) {
        toast.success(
          `${side === "front" ? "Front" : "Back"} side downloaded successfully!`
        );
      } else {
        toast.error("Failed to download currency image. Please try again.");
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("An error occurred while downloading. Please try again.");
    } finally {
      setDownloadingCurrency(null);
    }
  };

  // Download both sides function
  const handleDownloadBothSides = async (currency) => {
    const frontCanvasKey = `${currency.currency_id}-front`;
    const backCanvasKey = `${currency.currency_id}-back`;
    const frontRef = canvasRefs.current[frontCanvasKey];
    const backRef = canvasRefs.current[backCanvasKey];

    if (!frontRef?.isReady() || !backRef?.isReady()) {
      toast.error(
        "Currency images not ready for download. Please wait a moment and try again."
      );
      return;
    }

    setDownloadingCurrency(`${currency.currency_id}-both`);

    try {
      const baseName = `${eventDetails.event_name}-${
        currency.currency_name || "Currency"
      }-₦${currency.denomination}`;

      // Download front side
      const frontSuccess = frontRef.downloadImage(`${baseName}-front.png`);

      // Add a small delay to prevent browser download conflicts
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Download back side
      const backSuccess = backRef.downloadImage(`${baseName}-back.png`);

      if (frontSuccess && backSuccess) {
        toast.success("Both sides downloaded successfully!");
      } else {
        toast.error(
          "Some images failed to download. Please try downloading individually."
        );
      }
    } catch (error) {
      console.error("Download error:", error);
      toast.error("An error occurred while downloading. Please try again.");
    } finally {
      setDownloadingCurrency(null);
    }
  };

  if (!authenticated) {
    return <LoadingDisplay message="Authenticating..." />;
  }

  if (isLoading) {
    return <LoadingDisplay message="Loading event details..." />;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="max-w-2xl mx-auto">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          {error} Try refreshing the page or{" "}
          <Button variant="link" onClick={() => navigate("/dashboard")}>
            go back to dashboard
          </Button>
          .
        </AlertDescription>
      </Alert>
    );
  }

  if (!eventDetails) {
    return (
      <Alert className="max-w-2xl mx-auto">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Event Not Found</AlertTitle>
        <AlertDescription>
          The event you are looking for could not be found.
          <Button variant="link" onClick={() => navigate("/dashboard")}>
            Go back to dashboard
          </Button>
          .
        </AlertDescription>
      </Alert>
    );
  }

  const {
    event_name,
    event_description,
    street_address,
    city,
    state: event_state, // aliased to avoid conflict with React state
    postal_code,
    start_date,
    end_date,
    created_at,
    reconciliation,
    payment_status,
    delivery_status,
    event_author,
  } = eventDetails;

  // Check if current user is the owner of the event
  const isEventOwner = event_author === userProfile?.email;

  // Show pay button only if:
  // 1. User is the event owner
  // 2. Payment status is pending
  // 3. User is authenticated
  const shouldShowPayButton =
    isEventOwner &&
    payment_status?.toLowerCase() === "pending" &&
    authenticated;

  return (
    <>
      <div className="max-w-5xl mx-auto">
        {/* Event Details Card */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 font-playfair mb-1">
                {event_name}
              </h1>
              <p className="text-gray-600 text-md">{event_description}</p>
              {!isEventOwner && (
                <p className="text-sm text-gray-500 mt-2">
                  Hosted by: {event_author}
                </p>
              )}
            </div>
            <div className="mt-3 md:mt-0 flex flex-col items-start md:items-end gap-2">
              <span className="text-xs text-gray-500">Event ID: {eventId}</span>
              {/* Show edit button only for event owners */}
              {isEventOwner && (
                <Button
                  onClick={() => navigate(`/manage-event?edit=${eventId}`)}
                  size="sm"
                  variant="outline"
                >
                  <Edit3 className="w-3.5 h-3.5 mr-2" /> Edit Event
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 mb-6">
            <DetailItem
              icon={MapPin}
              label="Location"
              value={`${street_address}, ${city}, ${event_state} ${postal_code}`}
            />
            <DetailItem
              icon={Calendar}
              label="Event Dates"
              value={`${format(
                new Date(start_date),
                "MMM dd, yyyy"
              )} - ${format(new Date(end_date), "MMM dd, yyyy")}`}
            />
            <DetailItem
              icon={Calendar}
              label="Created On"
              value={format(new Date(created_at), "MMM dd, yyyy 'at' hh:mm a")}
            />
            <div>
              <div className="flex flex-wrap gap-2 mt-1">
                {reconciliation && <StatusPill status="Reconciled" />}
              </div>
            </div>
          </div>

          {/* Responsive bottom status and action section */}
          <div className="flex flex-col sm:flex-row justify-between items-stretch mt-4 w-full gap-4">
            {/* Status section bottom left */}
            <div className="flex flex-col items-start">
              <span className="font-semibold text-gray-700 mb-1 flex items-center">
                <Info className="w-4 h-4 mr-1 text-bluePrimary" /> Payment
                Status
              </span>
              <div className="flex items-center gap-2 mb-2">
                <StatusPill status={payment_status} />
              </div>
              <span className="font-semibold text-gray-700 mb-1 flex items-center">
                <Info className="w-4 h-4 mr-1 text-bluePrimary" /> Delivery
                Status
              </span>
              <div className="flex items-center gap-2">
                <StatusPill status={delivery_status} />
              </div>
            </div>
            {/* Make Payment button - only for event owners with pending payment */}
            {shouldShowPayButton && (
              <div className="flex items-end justify-end w-full sm:w-auto">
                <Button
                  className="bg-bluePrimary text-white font-semibold px-6 py-2"
                  onClick={() => setIsPaymentModalOpen(true)}
                >
                  Make Payment
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Associated Currencies Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-700 mb-2 font-playfair flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-bluePrimary" /> Associated
            Currencies
          </h2>
          {currencies.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6">
              {currencies.map((currency) => (
                <div
                  key={currency.currency_id}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                >
                  <h3 className="text-xl font-semibold text-gray-800 mb-1">
                    {currency.currency_name || "Unnamed Currency"}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    Denomination:{" "}
                    <span className="font-medium text-bluePrimary">
                      ₦{currency.denomination}
                    </span>
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        Front Side
                      </p>
                      {associatedImages[currency.currency_id]?.front ||
                      currency.front_image ? (
                        <CurrencyCanvas
                          ref={(ref) => {
                            if (ref) {
                              canvasRefs.current[
                                `${currency.currency_id}-front`
                              ] = ref;
                            }
                          }}
                          templateImage={getTemplateImage(
                            currency.denomination
                          )}
                          texts={{
                            currencyName: currency.currency_name,
                            celebration: currency.front_celebration_text,
                            dominationText: String(currency.denomination),
                            eventId: currency.event_id,
                          }}
                          side="front"
                          denomination={String(currency.denomination)}
                          portraitImage={
                            associatedImages[currency.currency_id]?.front
                          }
                        />
                      ) : (
                        <div className="text-center py-4 text-xs text-gray-400 italic border rounded-md">
                          No front image
                        </div>
                      )}
                      {currency.front_celebration_text && (
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          "{currency.front_celebration_text}"
                        </p>
                      )}

                      {/* Download Front Button */}
                      {(associatedImages[currency.currency_id]?.front ||
                        currency.front_image) && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownloadCurrency(currency, "front")
                            }
                            disabled={
                              downloadingCurrency ===
                              `${currency.currency_id}-front`
                            }
                            className="w-full"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {downloadingCurrency ===
                            `${currency.currency_id}-front`
                              ? "Downloading..."
                              : "Download Front"}
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1 font-medium">
                        Back Side
                      </p>
                      {associatedImages[currency.currency_id]?.back ||
                      currency.back_image ? (
                        <CurrencyCanvas
                          ref={(ref) => {
                            if (ref) {
                              canvasRefs.current[
                                `${currency.currency_id}-back`
                              ] = ref;
                            }
                          }}
                          templateImage={getTemplateImage(
                            currency.denomination
                          )} // Assuming back also uses a base template
                          texts={{
                            celebration: currency.back_celebration_text,
                            eventId: currency.event_id,
                            // Potentially other texts for back if applicable
                          }}
                          side="back"
                          denomination={String(currency.denomination)}
                          portraitImage={
                            associatedImages[currency.currency_id]?.back
                          }
                        />
                      ) : (
                        <div className="text-center py-4 text-xs text-gray-400 italic border rounded-md">
                          No back image
                        </div>
                      )}
                      {currency.back_celebration_text && (
                        <p className="mt-1 text-xs text-gray-500 truncate">
                          "{currency.back_celebration_text}"
                        </p>
                      )}

                      {/* Download Back Button */}
                      {(associatedImages[currency.currency_id]?.back ||
                        currency.back_image) && (
                        <div className="mt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              handleDownloadCurrency(currency, "back")
                            }
                            disabled={
                              downloadingCurrency ===
                              `${currency.currency_id}-back`
                            }
                            className="w-full"
                          >
                            <Download className="w-3 h-3 mr-1" />
                            {downloadingCurrency ===
                            `${currency.currency_id}-back`
                              ? "Downloading..."
                              : "Download Back"}
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Download Both Sides Button */}
                  {(associatedImages[currency.currency_id]?.front ||
                    currency.front_image) &&
                    (associatedImages[currency.currency_id]?.back ||
                      currency.back_image) && (
                      <div className="border-t pt-3 mt-3">
                        <Button
                          variant="default"
                          className="w-full bg-bluePrimary hover:bg-bluePrimary/90"
                          onClick={() => handleDownloadBothSides(currency)}
                          disabled={
                            downloadingCurrency ===
                            `${currency.currency_id}-both`
                          }
                        >
                          <Download className="w-4 h-4 mr-2" />
                          {downloadingCurrency ===
                          `${currency.currency_id}-both`
                            ? "Printing Both Sides..."
                            : "Print Both Sides"}
                        </Button>
                      </div>
                    )}

                  {/* Show customize button only for event owners */}
                  {isEventOwner && (
                    <div className="text-right mt-3 pt-3 border-t">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-bluePrimary hover:text-bluePrimary hover:bg-blue-50"
                        onClick={() =>
                          navigate(
                            `/templates?currencyId=${currency.currency_id}&eventId=${eventId}&denomination=${currency.denomination}`
                          )
                        } // Or to a specific customize page
                      >
                        <Palette className="w-3.5 h-3.5 mr-1.5" /> Customize
                        this Currency
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow text-center">
              <Tag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                No currencies have been designed for this event yet.
              </p>
              {/* Show design button only for event owners */}
              {isEventOwner && (
                <Button className="mt-4" onClick={() => navigate("/templates")}>
                  <Palette className="w-4 h-4 mr-2" /> Design a Currency
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
      {/* Payment Modal - only show for event owners */}
      {eventDetails && currencies && isEventOwner && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => {
            setIsPaymentModalOpen(false);
            navigate(location.pathname, { replace: true });
          }}
          eventDetails={eventDetails}
          currencies={currencies}
          associatedImages={associatedImages}
        />
      )}
    </>
  );
}
