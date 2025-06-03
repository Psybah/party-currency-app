import PropTypes from "prop-types";

export default function StatsCard({ label, value, status }) {
  return (
    <div className="bg-softbg p-3 sm:p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-sm sm:text-lg font-medium text-gray-900">{label}</h3>
          <p className="text-xl sm:text-3xl font-semibold mt-1 sm:mt-2">{value}</p>
        </div>
        {status && (
          <span className="text-xs sm:text-sm px-1.5 sm:px-2 py-0.5 sm:py-1 bg-blue-100 text-blue-800 rounded">
            {status}
          </span>
        )}
      </div>
    </div>
  );
}

StatsCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  status: PropTypes.string,
};