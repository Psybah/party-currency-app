import PropTypes from "prop-types";

const EventTabs = ({ activeTab, setActiveTab }) => (
  <div className="flex space-x-2 sm:space-x-3 lg:space-x-4 mb-3 sm:mb-4 lg:mb-6 border-b">
    <button
      className={`pb-1.5 sm:pb-2 px-2 sm:px-3 lg:px-4 text-sm sm:text-base ${
        activeTab === "ongoing"
          ? "border-b-2 border-gold text-gold"
          : "text-gray-500"
      }`}
      onClick={() => setActiveTab("ongoing")}
    >
      Ongoing Events
    </button>
    <button
      className={`pb-1.5 sm:pb-2 px-2 sm:px-3 lg:px-4 text-sm sm:text-base ${
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

EventTabs.propTypes = {
  activeTab: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
};

export default EventTabs;