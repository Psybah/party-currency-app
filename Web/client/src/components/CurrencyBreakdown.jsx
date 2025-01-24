import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";

const CurrencyBreakdown = ({ isEnabled = false }) => {
  const [amount, setAmount] = useState("");
  const [ratios, setRatios] = useState({
    "1000": 0,
    "500": 0,
    "200": 0,
  });

  const handleAmountChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setAmount(value);
  };

  const handleRatioChange = (denomination, value) => {
    const newValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    setRatios((prev) => ({
      ...prev,
      [denomination]: newValue,
    }));
  };

  const handleProceed = () => {
    const total = Object.values(ratios).reduce((sum, ratio) => sum + ratio, 0);
    if (total !== 100) {
      toast.error("Ratios must add up to 100%");
      return;
    }
    if (!amount) {
      toast.error("Please enter an amount");
      return;
    }
    toast.success("Proceeding with currency breakdown");
    // Handle the breakdown logic here
  };

  return (
    <div className={`space-y-6 p-6 rounded-lg border ${isEnabled ? "" : "opacity-50 pointer-events-none"}`}>
      <h3 className="text-xl font-semibold text-bluePrimary">Currency Breakdown</h3>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="amount">Amount (₦)</Label>
          <Input
            id="amount"
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="Enter amount"
            className="mt-1"
          />
        </div>

        <div className="space-y-3">
          <Label>Denomination Ratios (%)</Label>
          {Object.keys(ratios).map((denomination) => (
            <div key={denomination} className="flex items-center gap-3">
              <span className="w-16">₦{denomination}</span>
              <Input
                type="number"
                min="0"
                max="100"
                value={ratios[denomination]}
                onChange={(e) => handleRatioChange(denomination, e.target.value)}
                className="w-24"
              />
              <span>%</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleProceed}
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90"
        >
          Proceed
        </Button>
      </div>
    </div>
  );
};

export default CurrencyBreakdown;