import React from "react";
import { Info } from "lucide-react";

export default function TransactionHistory() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mt-6">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      <div className="flex flex-col items-center justify-center py-8">
        <Info className="w-12 h-12 text-gray-400 mb-4" />
        <p className="text-gray-600">Yet to perform any transaction</p>
      </div>
    </div>
  );
}