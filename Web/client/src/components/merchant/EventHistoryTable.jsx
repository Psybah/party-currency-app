import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function EventHistoryTable({ searchQuery }) {
  const [events] = useState([
    {
      id: "3FV56YGF",
      date: "13-09-2025",
      location: "Kuje,Abuja",
      merchantId: "001231907896"
    },
    // Add more mock data as needed
  ]);

  const filteredEvents = events.filter(event => 
    event.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 p-4">
              <Checkbox />
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Event ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Location
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Merchant ID
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {filteredEvents.map((event) => (
            <tr key={event.id}>
              <td className="p-4">
                <Checkbox />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {event.id}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {event.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {event.location}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {event.merchantId}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 