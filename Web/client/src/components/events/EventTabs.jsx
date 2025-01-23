import React from "react";

const EventTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex space-x-4 mb-6 border-b">
    <button
      className={`pb-2 px-4 ${
        activeTab === "ongoing"
          ? "border-b-2 border-gold text-gold"
          : "text-gray-500"
      }`}
      onClick={() => setActiveTab("ongoing")}
    >
      Ongoing Events
    </button>
    <button
      className={`pb-2 px-4 ${
        activeTab === "concluded"
          ? "border-b-2 border-gold text-gold"
          : "text-gray-500"
      }`}
      onClick={() => setActiveTab("concluded")}
    >
      Concluded Events
    </button>
  </div>
);

export default EventTabs;