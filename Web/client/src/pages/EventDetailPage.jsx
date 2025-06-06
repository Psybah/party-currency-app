import { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { LoadingDisplay } from "@/components/LoadingDisplay";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Terminal, Download, ArrowLeft } from "lucide-react";
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
  Palette,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { USER_PROFILE_CONTEXT } from "@/context";
import PropTypes from "prop-types";

// Helper function for CurrencyCanvas template image
function getTemplateImage(denomination) {
  const denStr = String(denomination);
  if (denStr === "200") return "/lovable-uploads/200-front-template.png";
  if (denStr === "500") return "/lovable-uploads/500-front-template.png";
  if (denStr === "1000") return "/lovable-uploads/1000-front-template.png";
  return "/lovable-uploads/200-front-template.png"; // Default
}

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start text-xs sm:text-sm text-gray-700">
    <Icon className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 text-bluePrimary" />
    <span className="font-medium mr-1 text-left">{label}:</span>
    <span className="text-left">{value || "N/A"}</span>
  </div>
);

DetailItem.propTypes = {
  icon: PropTypes.elementType.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

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
      className={`inline-flex items-center px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold ${bgColor} ${textColor}`}
    >
      <Icon className="w-2.5 h-2.5 sm:w-3 sm:h-3 mr-1 sm:mr-1.5" />
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "N/A"}
    </span>
  );
};

StatusPill.propTypes = {
  status: PropTypes.string,
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
    // Check if payment is successful before allowing download
    const { payment_status } = eventDetails || {};
    if (
      payment_status?.toLowerCase() !== "successful" &&
      payment_status?.toLowerCase() !== "paid" &&
      payment_status?.toLowerCase() !== "completed"
    ) {
      toast.error(
        "Payment required: Please complete payment for this event before downloading currencies."
      );
      return;
    }

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
    // Check if payment is successful before allowing download
    const { payment_status } = eventDetails || {};
    if (
      payment_status?.toLowerCase() !== "successful" &&
      payment_status?.toLowerCase() !== "paid" &&
      payment_status?.toLowerCase() !== "completed"
    ) {
      toast.error(
        "Payment required: Please complete payment for this event before downloading currencies."
      );
      return;
    }

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

  // Check if payment is successful for downloads
  const { payment_status } = eventDetails || {};
  const isPaymentSuccessful =
    payment_status?.toLowerCase() === "successful" ||
    payment_status?.toLowerCase() === "paid" ||
    payment_status?.toLowerCase() === "completed";

  if (!authenticated) {
    return <LoadingDisplay message="Authenticating..." />;
  }

  if (isLoading) {
    return <LoadingDisplay message="Loading event details..." />;
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error} Try refreshing the page or{" "}
            <Button
              variant="link"
              onClick={() => navigate("/dashboard")}
              className="p-0 h-auto"
            >
              go back to dashboard
            </Button>
            .
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!eventDetails) {
    return (
      <div className="max-w-4xl mx-auto p-3 sm:p-6">
        <Alert className="border-gray-200 bg-gray-50">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Event Not Found</AlertTitle>
          <AlertDescription>
            The event you are looking for could not be found.
            <Button
              variant="link"
              onClick={() => navigate("/dashboard")}
              className="p-0 h-auto"
            >
              Go back to dashboard
            </Button>
            .
          </AlertDescription>
        </Alert>
      </div>
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
      <div className="min-h-screen bg-gray-50">
        <main className="p-3 sm:p-6 space-y-4 sm:space-y-6 max-w-5xl mx-auto">
          {/* Header with Back Button */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              size="sm"
              className="border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10 h-8 sm:h-9 px-2 sm:px-3"
            >
              <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
              <span className="text-xs sm:text-sm">Back</span>
            </Button>
            <div>
              <h1 className="text-lg sm:text-2xl font-semibold font-playfair text-gray-900 text-left">
                Event Details
              </h1>
              <p className="text-xs sm:text-sm text-gray-500 text-left">
                Event ID: {eventId}
              </p>
            </div>
          </div>

          {/* Event Details Card */}
          <Card className="p-3 sm:p-6 bg-white border-bluePrimary/20">
            <div className="flex flex-col md:flex-row justify-between items-start mb-3 sm:mb-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl sm:text-3xl font-bold text-gray-800 font-playfair mb-1 text-left">
                  {event_name}
                </h2>
                <p className="text-gray-600 text-sm sm:text-base text-left">
                  {event_description}
                </p>
                {!isEventOwner && (
                  <p className="text-xs sm:text-sm text-gray-500 mt-2 text-left">
                    Hosted by: {event_author}
                  </p>
                )}
              </div>
              {/* Show edit button only for event owners
              {isEventOwner && (
                <div className="mt-3 md:mt-0 flex-shrink-0">
                  <Button
                    onClick={() => navigate(`/manage-event?edit=${eventId}`)}
                    size="sm"
                    variant="outline"
                    className="border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10 text-xs sm:text-sm h-7 sm:h-8"
                  >
                    <Edit3 className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5 sm:mr-2" /> Edit Event
                  </Button>
                </div>
              )} */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 sm:gap-x-8 gap-y-2 sm:gap-y-4 mb-4 sm:mb-6">
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
                value={format(
                  new Date(created_at),
                  "MMM dd, yyyy 'at' hh:mm a"
                )}
              />
              <div className="flex items-start text-xs sm:text-sm text-gray-700">
                <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2 mt-0.5 flex-shrink-0 text-bluePrimary" />
                <span className="font-medium mr-1 text-left">Status:</span>
                <div className="flex flex-wrap gap-1">
                  {reconciliation && <StatusPill status="Reconciled" />}
                </div>
              </div>
            </div>

            {/* Responsive bottom status and action section */}
            <div className="flex flex-col sm:flex-row justify-between items-stretch gap-3 sm:gap-4 pt-3 sm:pt-4 border-t border-gray-100">
              {/* Status section */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-700 mb-1 flex items-center text-xs sm:text-sm">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-bluePrimary" />{" "}
                    Payment Status
                  </span>
                  <StatusPill status={payment_status} />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-semibold text-gray-700 mb-1 flex items-center text-xs sm:text-sm">
                    <Info className="w-3 h-3 sm:w-4 sm:h-4 mr-1 text-bluePrimary" />{" "}
                    Delivery Status
                  </span>
                  <StatusPill status={delivery_status} />
                </div>
              </div>
              {/* Make Payment button - only for event owners with pending payment */}
              {shouldShowPayButton && (
                <div className="flex items-end justify-end">
                  <Button
                    className="bg-bluePrimary text-white font-semibold px-4 sm:px-6 py-2 text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => setIsPaymentModalOpen(true)}
                  >
                    Make Payment
                  </Button>
                </div>
              )}
            </div>
          </Card>

          {/* Associated Currencies Section */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-lg sm:text-2xl font-semibold text-gray-700 font-playfair flex items-center text-left">
              Associated Currencies
            </h2>
            {currencies.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-6">
                {currencies.map((currency) => (
                  <Card
                    key={currency.currency_id}
                    className="p-3 sm:p-4 bg-white border-bluePrimary/20 hover:border-bluePrimary/40 transition-colors duration-200"
                  >
                    <h3 className="text-base sm:text-xl font-semibold text-gray-800 mb-1 text-left">
                      {currency.currency_name || "Unnamed Currency"}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-500 mb-3 text-left">
                      Denomination:{" "}
                      <span className="font-medium text-bluePrimary">
                        ₦{currency.denomination}
                      </span>
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 sm:mb-4">
                      <div>
                        <p className="text-xs text-gray-600 mb-1 font-medium text-left">
                          Front Side
                        </p>
                        {associatedImages[currency.currency_id]?.front ||
                        currency.front_image ? (
                          <div className="relative overflow-hidden">
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
                            {/* Mobile scroll overlay */}
                            <div 
                              className="absolute inset-0 bg-transparent md:hidden"
                              style={{ touchAction: 'pan-y pinch-zoom' }}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-3 sm:py-4 text-xs text-gray-400 italic border rounded-md bg-gray-50">
                            No front image
                          </div>
                        )}
                        {currency.front_celebration_text && (
                          <p className="text-xs text-gray-500 truncate text-left">
                            &ldquo;{currency.front_celebration_text}&rdquo;
                          </p>
                        )}

                        {/* Download Front Button */}
                        {(associatedImages[currency.currency_id]?.front ||
                          currency.front_image) && (
                          <div className="mt-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDownloadCurrency(currency, "front")
                              }
                              disabled={
                                downloadingCurrency ===
                                  `${currency.currency_id}-front` ||
                                !isPaymentSuccessful
                              }
                              className={`w-full border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10 text-xs h-7 sm:h-8 ${
                                !isPaymentSuccessful
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                !isPaymentSuccessful
                                  ? "Payment required to download"
                                  : "Download front side"
                              }
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {downloadingCurrency ===
                              `${currency.currency_id}-front`
                                ? "Downloading..."
                                : !isPaymentSuccessful
                                ? "Payment Required"
                                : "Download Front"}
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1 font-medium text-left">
                          Back Side
                        </p>
                        {associatedImages[currency.currency_id]?.back ||
                        currency.back_image ? (
                          <div className="relative overflow-hidden">
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
                            {/* Mobile scroll overlay */}
                            <div 
                              className="absolute inset-0 bg-transparent md:hidden"
                              style={{ touchAction: 'pan-y pinch-zoom' }}
                            />
                          </div>
                        ) : (
                          <div className="text-center py-3 sm:py-4 text-xs text-gray-400 italic border rounded-md bg-gray-50">
                            No back image
                          </div>
                        )}
                        {currency.back_celebration_text && (
                          <p className="text-xs text-gray-500 truncate text-left">
                            &ldquo;{currency.back_celebration_text}&rdquo;
                          </p>
                        )}

                        {/* Download Back Button */}
                        {(associatedImages[currency.currency_id]?.back ||
                          currency.back_image) && (
                          <div className="mt-0">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                handleDownloadCurrency(currency, "back")
                              }
                              disabled={
                                downloadingCurrency ===
                                  `${currency.currency_id}-back` ||
                                !isPaymentSuccessful
                              }
                              className={`w-full border-bluePrimary/30 text-bluePrimary hover:bg-bluePrimary/10 text-xs h-7 sm:h-8 ${
                                !isPaymentSuccessful
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                !isPaymentSuccessful
                                  ? "Payment required to download"
                                  : "Download back side"
                              }
                            >
                              <Download className="w-3 h-3 mr-1" />
                              {downloadingCurrency ===
                              `${currency.currency_id}-back`
                                ? "Downloading..."
                                : !isPaymentSuccessful
                                ? "Payment Required"
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
                        <div className="border-t pt-3 mt-3 border-gray-100">
                          <Button
                            variant="default"
                            className={`w-full bg-bluePrimary hover:bg-bluePrimary/90 text-white text-xs sm:text-sm h-7 sm:h-9 ${
                              !isPaymentSuccessful
                                ? "opacity-50 cursor-not-allowed"
                                : ""
                            }`}
                            onClick={() => handleDownloadBothSides(currency)}
                            disabled={
                              downloadingCurrency ===
                                `${currency.currency_id}-both` ||
                              !isPaymentSuccessful
                            }
                            title={
                              !isPaymentSuccessful
                                ? "Payment required to download"
                                : "Download both sides"
                            }
                          >
                            <Download className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            {downloadingCurrency ===
                            `${currency.currency_id}-both`
                              ? "Downloading Both Sides..."
                              : !isPaymentSuccessful
                              ? "Payment Required"
                              : "Download Both Sides"}
                          </Button>
                        </div>
                      )}

                    {/* Show customize button only for event owners */}
                    {isEventOwner && (
                      <div className="text-right mt-3 pt-3 border-t border-gray-100">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-bluePrimary hover:text-bluePrimary hover:bg-blue-50 text-xs h-7 sm:h-8"
                          onClick={() =>
                            navigate(
                              `/dashboard/customize?denomination=${currency.denomination}&currencyId=${currency.currency_id}`
                            )
                          }
                        >
                          <Palette className="w-3 h-3 sm:w-3.5 sm:h-3.5 mr-1.5" />{" "}
                          Customize this Currency
                        </Button>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-4 sm:p-6 bg-white border-bluePrimary/20 text-center">
                <Tag className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm sm:text-base">
                  No currencies have been designed for this event yet.
                </p>
                {/* Show design button only for event owners */}
                {isEventOwner && (
                  <Button
                    className="mt-4 bg-bluePrimary text-white hover:bg-bluePrimary/90 text-xs sm:text-sm h-8 sm:h-9"
                    onClick={() => navigate("/templates")}
                  >
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-2" /> Design a
                    Currency
                  </Button>
                )}
              </Card>
            )}
          </div>
        </main>
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
