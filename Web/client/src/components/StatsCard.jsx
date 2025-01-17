import React from "react";

export default function StatsCard({ label, value, status }) {
  return (
    <div className="bg-softbg p-6 rounded-lg">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
          <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
        {status && <span className="text-gray-500">{status}</span>}
      </div>
    </div>
  );
}