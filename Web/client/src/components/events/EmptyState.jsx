import React from "react";
import { Info } from "lucide-react";
import { Link } from "react-router-dom";

const EmptyState = ({ type }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <Info className="w-12 h-12 text-gold mb-4" />
    <p className="mb-4 text-gray-600">No {type} events</p>
    <Link to="/create-event" className="text-gold hover:underline">
      Create an event
    </Link>
  </div>
);

export default EmptyState;