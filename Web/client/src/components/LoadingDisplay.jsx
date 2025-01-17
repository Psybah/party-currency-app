import React from "react";
import { Link } from "react-router-dom";

export default function LoadingDisplay() {
  return (
    <div className="flex flex-col justify-center items-center gap-5 m-5 min-h-screen size-full">
      <div className="loader"></div>
      <h1 className="font-bold text-lg">Loading, please wait...</h1>
      <p className="text-gray-600">We are fetching the latest data for you.</p>
      <div className="flex gap-3 mt-4">
        <Link to="/" className="bg-bluePrimary px-4 py-2 rounded-lg text-white">
          Home
        </Link>
        <Link
          className="bg-blueSecondary px-4 py-2 rounded-lg text-white"
          to="/contact"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}
