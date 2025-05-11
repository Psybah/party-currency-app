import React, { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, Plus, Minus, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import { getEvents } from "@/api/eventApi";
import { createTransaction, generatePaymentLink } from "@/api/paymentApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DENOMINATION_VALUES = ["1000", "500", "200"]; // Defines order and available denominations

const CurrencyBreakdown = () => {
  const [isEnabled, setIsEnabled] = useState(true); // Maintained from original, assuming parent control
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [denominationCounts, setDenominationCounts] = useState({
    "1000": 0,
    "500": 0,
    "200": 0,
  });
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  useEffect(() => {
    const fetchEventsAsync = async () => {
      setIsLoadingEvents(true);
      try {
        const data = await getEvents();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error(error.message || "Failed to load events. Please try again.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEventsAsync();
  }, []);

  const handleDenominationCountChange = (denominationKey, value) => {
    const count = parseInt(value, 10);
    setDenominationCounts((prevCounts) => ({
      ...prevCounts,
      [denominationKey]: Math.max(0, isNaN(count) ? 0 : count),
    }));
  };

  const adjustDenominationCount = (denominationKey, increment) => {
    setDenominationCounts((prevCounts) => ({
      ...prevCounts,
      [denominationKey]: Math.max(0, prevCounts[denominationKey] + (increment ? 1 : -1)),
    }));
  };

  const totalCalculatedAmount = useMemo(() => {
    return DENOMINATION_VALUES.reduce((total, denomKey) => {
      const count = denominationCounts[denomKey] || 0;
      return total + parseInt(denomKey, 10) * count;
    }, 0);
  }, [denominationCounts]);

  const handleProceed = async () => {
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }
    if (totalCalculatedAmount <= 0) {
      toast.error("Total amount must be greater than ₦0. Please add some notes.");
      return;
    }

    setIsProcessingPayment(true);
    try {
      
      const transactionData = await createTransaction(
        selectedEvent, // eventId
        totalCalculatedAmount, // amount
        denominationCounts // currency breakdown
      );

      if (transactionData && transactionData.payment_reference) {
        const paymentLinkData = (await generatePaymentLink(transactionData.payment_reference)).responseBody;
        if (paymentLinkData && paymentLinkData.checkoutUrl) {
          toast.success("Redirecting to payment gateway...");
          window.location.href = paymentLinkData.checkoutUrl;
        } else {
          const errorDetail = paymentLinkData?.message || paymentLinkData?.detail || "Failed to get payment link.";
          throw new Error(errorDetail);
        }
      } else {
        const errorDetail = transactionData?.message || transactionData?.detail || "Failed to create transaction.";
        throw new Error(errorDetail);
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      toast.error(error.message || "Payment processing failed. Please try again.");
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const isFormValid = selectedEvent && totalCalculatedAmount > 0 && !isProcessingPayment && !isLoadingEvents;

  return (
    <div className={`space-y-6 p-6 rounded-lg border bg-white ${isEnabled ? "" : "opacity-50 pointer-events-none"}`}>
      <h3 className="text-xl font-semibold text-bluePrimary">Currency Breakdown</h3>
      
      <div className="space-y-6"> {/* Increased spacing for sections */}
        <div className="space-y-3"> {/* Consistent spacing for denomination items */}
          {DENOMINATION_VALUES.map((denomKey) => {
            const count = denominationCounts[denomKey] || 0;
            const value = parseInt(denomKey, 10) * count;
            return (
              <div key={denomKey} className="flex items-center justify-between gap-4 py-3 border-b last:border-b-0">
                <div className="flex flex-col">
                  <span className="text-md font-medium text-gray-700">₦{denomKey} Notes</span>
                  <span className="text-sm text-gray-500">
                    Value: ₦{value.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => adjustDenominationCount(denomKey, false)}
                    disabled={isProcessingPayment || count === 0}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={count.toString()}
                    onChange={(e) => handleDenominationCountChange(denomKey, e.target.value)}
                    className="w-20 text-center h-9"
                    min="0"
                    disabled={isProcessingPayment}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => adjustDenominationCount(denomKey, true)}
                    disabled={isProcessingPayment}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
            <span className="text-xl font-bold text-bluePrimary">
              ₦{totalCalculatedAmount.toLocaleString()}
            </span>
          </div>
           {totalCalculatedAmount > 0 && totalCalculatedAmount < 100 && ( // Common minimum for some gateways is 100, not 1000
             <p className="text-sm text-orange-500 mt-1">
               Note: Some payment gateways have a minimum transaction amount (e.g., ₦100).
             </p>
           )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event-select" className="text-sm text-gray-600"> {/* Added htmlFor */}
            Select Event
          </Label>
          <Select
            value={selectedEvent}
            onValueChange={setSelectedEvent}
            disabled={isLoadingEvents || isProcessingPayment}
          >
            <SelectTrigger id="event-select" className="w-full"> {/* Added id for Label */}
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
        </div>

        <Button 
          onClick={handleProceed}
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90 flex items-center justify-center"
          disabled={!isFormValid}
        >
          {isProcessingPayment ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Send className="mr-2 h-4 w-4" />
          )}
          Proceed to payment
        </Button>
      </div>
    </div>
  );
};

export default CurrencyBreakdown;