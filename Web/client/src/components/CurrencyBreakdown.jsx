import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";
import { getEvents } from "@/api/eventApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CurrencyBreakdown = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [amount, setAmount] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [events, setEvents] = useState([]);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [denominations, setDenominations] = useState({
    "1000": 0,
    "500": 0,
    "200": 0,
  });

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await getEvents();
        setEvents(data.events || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        toast.error("Failed to load events. Please try again.");
      } finally {
        setIsLoadingEvents(false);
      }
    };

    fetchEvents();
  }, []);

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const calculateDenominationAmount = (percentage, totalAmount) => {
    return Math.floor((percentage / 100) * totalAmount);
  };

  const adjustPercentage = (denomination, increment) => {
    const step = 10;
    setDenominations((prev) => {
      // Calculate new value with limits
      const newValue = Math.max(0, Math.min(100, prev[denomination] + (increment ? step : -step)));
      const diff = newValue - prev[denomination];
      
      // If no change, return previous state
      if (diff === 0) return prev;

      // Create result with the updated denomination
      const result = { ...prev, [denomination]: newValue };
      
      // If incrementing, check if total would exceed 100%
      if (increment) {
        const newTotal = Object.values(result).reduce((sum, val) => sum + val, 0);
        if (newTotal > 100) {
          // If exceeding 100%, don't allow the change
          return prev;
        }
      } else {
        // If decrementing, we don't need additional logic as it won't exceed 100%
      }
      
      return result;
    });
  };

  const getTotal = () => {
    return Object.values(denominations).reduce((sum, val) => sum + val, 0);
  };

  const calculateBreakdown = () => {
    if (!amount) return {};
    
    const totalAmount = parseInt(amount);
    const breakdown = {};
    
    Object.entries(denominations).forEach(([denomination, percentage]) => {
      breakdown[denomination] = calculateDenominationAmount(percentage, totalAmount);
    });
    
    return breakdown;
  };

  const handleProceed = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    
    if (!selectedEvent) {
      toast.error("Please select an event");
      return;
    }
    
    const total = getTotal();
    if (total !== 100) {
      toast.error("Denomination percentages must add up to 100%");
      return;
    }

    const breakdown = calculateBreakdown();
    toast.success("Proceeding with currency breakdown");
  };

  const isAmountValid = parseInt(amount) >= 1000;
  const isFormValid = isAmountValid && getTotal() === 100 && selectedEvent;

  return (
    <div className={`space-y-6 p-6 rounded-lg border bg-white ${isEnabled ? "" : "opacity-50 pointer-events-none"}`}>
      <h3 className="text-xl font-semibold text-bluePrimary">Currency Breakdown</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount" className="text-sm text-gray-600">
            Enter Amount (1 party currency = 1 naira)
          </Label>
          <div className="relative mt-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">₦</span>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0.00"
              className="pl-8"
            />
          </div>
          {amount && !isAmountValid && (
            <p className="text-sm text-red-500 mt-1">
              Please enter an amount greater than or equal to ₦1,000
            </p>
          )}
        </div>

        <div className="space-y-4 mt-6">
          {Object.entries(denominations).map(([denomination, percentage]) => {
            const breakdown = calculateBreakdown();
            const denominationAmount = breakdown[denomination] || 0;
            
            return (
              <div key={denomination} className="flex items-center justify-between gap-4">
                <div className="flex flex-col">
                  <span className="text-gray-600">₦{denomination}</span>
                  {amount && (
                    <span className="text-sm text-gray-500">
                      Amount: ₦{denominationAmount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => adjustPercentage(denomination, false)}
                    disabled={!isAmountValid}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center">{percentage}%</span>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => adjustPercentage(denomination, true)}
                    disabled={!isAmountValid}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="space-y-2">
          <Label htmlFor="event" className="text-sm text-gray-600">
            Select Event
          </Label>
          <Select
            value={selectedEvent}
            onValueChange={setSelectedEvent}
            disabled={isLoadingEvents}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder={isLoadingEvents ? "Loading events..." : "Select an event"} />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.event_id} value={event.event_id}>
                  {event.event_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleProceed}
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90 mt-6"
          disabled={!isFormValid}
        >
          Proceed to payment
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CurrencyBreakdown;