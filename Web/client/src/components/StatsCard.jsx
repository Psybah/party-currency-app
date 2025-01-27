import React from "react";

export default function StatsCard({ label, value, status }) {
  return (
    <div className="bg-softbg p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{label}</h3>
          <p className="text-3xl font-semibold mt-2">{value}</p>
        </div>
        {status && (
          <span className="text-sm px-2 py-1 bg-blue-100 text-blue-800 rounded">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}