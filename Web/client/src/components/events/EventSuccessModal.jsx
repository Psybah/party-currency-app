import React from "react";
import { X, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EventSuccessModal({ eventId, onClose, onNavigate }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-green-600 flex items-center gap-2">
            <CheckCircle className="h-6 w-6" />
            Event Created Successfully!
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Below is your unique Event ID. You can copy it for future reference.
        </p>
        <div className="bg-gray-100 p-3 rounded mb-4 text-center">
          <code className="text-lg font-mono">{eventId}</code>
        </div>
        <Button
          className="w-full bg-bluePrimary hover:bg-bluePrimary/90 text-white"
          onClick={onNavigate}
        >
          Choose Currency Template
        </Button>
      </div>
    </div>
  );
}