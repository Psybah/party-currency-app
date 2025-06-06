import { Check, AlertCircle, XCircle, ExternalLink, Search, Eye } from "lucide-react";
import { Input } from "./ui/input";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const statusIcons = {
  successful: <Check className="text-green-500 w-3 h-3 sm:w-4 sm:h-4" />,
  pending: <AlertCircle className="text-yellow-500 w-3 h-3 sm:w-4 sm:h-4" />,
  cancelled: <XCircle className="text-red-500 w-3 h-3 sm:w-4 sm:h-4" />,
};

// Helper function to format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

export default function TransactionHistory({ transactions, onSearch }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-3 sm:p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3 h-3 sm:w-4 sm:h-4" />
          <Input
            type="text"
            placeholder="Search events..."
            className="pl-8 sm:pl-10 text-sm sm:text-base h-8 sm:h-10"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>
      
      {/* Mobile Card View */}
      <div className="block md:hidden">
        <div className="divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <div key={transaction.event_id} className="p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-gray-900 truncate text-left">
                    {transaction.event_name}
                  </h4>
                  <p className="text-xs text-gray-500 text-left mt-0.5">
                    <span className="font-medium">ID:</span> {transaction.event_id}
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/event/${transaction.event_id}`)}
                  className="ml-3 text-bluePrimary hover:text-bluePrimary/80 p-1 flex-shrink-0"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="text-left">
                  <span className="text-gray-500 font-medium">Location:</span>
                  <div className="text-gray-900 font-medium mt-0.5">{`${transaction.city}, ${transaction.state}`}</div>
                </div>
                <div className="text-left">
                  <span className="text-gray-500 font-medium">Date:</span>
                  <div className="text-gray-900 font-medium mt-0.5">{formatDate(transaction.start_date)}</div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
                <div className="text-left">
                  <div className="text-xs text-gray-500 font-medium mb-1">Payment Status</div>
                  <div className="flex items-center gap-1">
                    {statusIcons[transaction.payment_status]}
                    <span className="text-xs capitalize font-medium text-gray-700">{transaction.payment_status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500 font-medium mb-1">Delivery Status</div>
                  <div className="flex items-center gap-1 justify-end">
                    {statusIcons[transaction.delivery_status]}
                    <span className="text-xs capitalize font-medium text-gray-700">{transaction.delivery_status}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event ID
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event Name
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delivery Status
              </th>
              <th className="px-4 lg:px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.event_id} className="hover:bg-gray-50">
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-900 text-center">
                  {transaction.event_id}
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-900 text-center">
                  {transaction.event_name}
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-500 text-center">
                  {`${transaction.city}, ${transaction.state}`}
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-gray-500 text-center">
                  {formatDate(transaction.start_date)}
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-center">
                  <div className="flex items-center justify-center gap-1 lg:gap-2">
                    {statusIcons[transaction.payment_status]}
                    <span className="capitalize">{transaction.payment_status}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-center">
                  <div className="flex items-center justify-center gap-1 lg:gap-2">
                    {statusIcons[transaction.delivery_status]}
                    <span className="capitalize">{transaction.delivery_status}</span>
                  </div>
                </td>
                <td className="px-4 lg:px-6 py-3 whitespace-nowrap text-xs lg:text-sm text-center">
                  <button
                    onClick={() => navigate(`/event/${transaction.event_id}`)}
                    className="text-bluePrimary hover:text-bluePrimary/80 mx-auto inline-flex items-center gap-1 px-2 py-1 rounded text-xs hover:bg-blue-50"
                    title="View Event Details"
                  >
                    <ExternalLink className="w-3 h-3" />
                    <span className="hidden lg:inline">View</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

TransactionHistory.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      event_id: PropTypes.string.isRequired,
      event_name: PropTypes.string.isRequired,
      city: PropTypes.string.isRequired,
      state: PropTypes.string.isRequired,
      start_date: PropTypes.string.isRequired,
      payment_status: PropTypes.string.isRequired,
      delivery_status: PropTypes.string.isRequired,
    })
  ).isRequired,
  onSearch: PropTypes.func.isRequired,
};