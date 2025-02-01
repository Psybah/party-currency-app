import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export function ReconciliationSection({ formData, handleInputChange, showReconciliationInfo, setShowReconciliationInfo }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="reconciliation_service"
            name="reconciliation_service"
            checked={formData.reconciliation_service}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600"
          />
          <label htmlFor="reconciliation_service" className="text-sm font-medium text-left">
            Enable Reconciliation Service
          </label>
        </div>

        <button
          type="button"
          onClick={() => setShowReconciliationInfo(!showReconciliationInfo)}
          className="text-sm text-blue-600 hover:underline flex items-center space-x-1"
        >
          <span>{showReconciliationInfo ? "Hide Info" : "What is this?"}</span>
          {showReconciliationInfo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>

      {showReconciliationInfo && (
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 transition-all duration-500 ease-in-out">
          <p className="text-sm text-gray-600 text-left">
            Party currency reconciliation service streamlines event management by providing
            foot soldiers to assist with currency transfers, a kiosk operator to convert party
            currency to real cash for guest artists, and an event wallet for hosts to monitor
            balances and transactions effortlessly, ensuring a stress-free experience with no
            risk of theft or fraud.
          </p>
        </div>
      )}
    </div>
  );
}