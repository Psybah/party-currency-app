import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Send, Plus, Minus } from "lucide-react";
import { toast } from "react-hot-toast";

const CurrencyBreakdown = ({ isEnabled = false }) => {
  const [amount, setAmount] = useState("");
  const [denominations, setDenominations] = useState({
    "1000": 0,
    "500": 0,
    "200": 0,
  });

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const adjustPercentage = (denomination, increment) => {
    const step = 10;
    setDenominations((prev) => {
      const newValue = Math.max(0, Math.min(100, prev[denomination] + (increment ? step : -step)));
      const diff = newValue - prev[denomination];
      
      if (diff === 0) return prev;

      const otherDenoms = Object.keys(prev).filter(d => d !== denomination);
      const remainingDiff = -diff;
      
      // Distribute the remaining difference among other denominations
      const result = { ...prev, [denomination]: newValue };
      
      if (remainingDiff !== 0) {
        const availableDenoms = otherDenoms.filter(d => 
          increment ? result[d] >= step : result[d] > 0
        );
        
        if (availableDenoms.length > 0) {
          const adjustPerDenom = remainingDiff / availableDenoms.length;
          availableDenoms.forEach(d => {
            result[d] = Math.max(0, Math.min(100, result[d] + adjustPerDenom));
          });
        } else {
          return prev; // Revert if we can't distribute
        }
      }
      
      return result;
    });
  };

  const getTotal = () => {
    return Object.values(denominations).reduce((sum, val) => sum + val, 0);
  };

  const handleProceed = () => {
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    
    const total = getTotal();
    if (total !== 100) {
      toast.error("Denomination percentages must add up to 100%");
      return;
    }

    toast.success("Proceeding with currency breakdown");
    // Handle the breakdown logic here
  };

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
        </div>

        <div className="space-y-4 mt-6">
          {Object.entries(denominations).map(([denomination, percentage]) => (
            <div key={denomination} className="flex items-center justify-between gap-4">
              <span className="w-16 text-gray-600">₦{denomination}</span>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => adjustPercentage(denomination, false)}
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
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleProceed}
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90 mt-6"
          disabled={!amount || getTotal() !== 100}
        >
          Proceed to payment
          <Send className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CurrencyBreakdown;