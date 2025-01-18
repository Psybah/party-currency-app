import React from "react";
import { Loader } from "lucide-react";

export function LoadingDisplay({ message = "Loading, please wait..." }) {
  return (
    <div className="flex flex-col justify-center items-center gap-5 min-h-[50vh] w-full p-4">
      <div className="relative">
        <Loader className="w-12 h-12 animate-spin text-bluePrimary" />
        <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white opacity-50"></div>
      </div>
      <h1 className="font-bold text-lg text-gray-800">{message}</h1>
      <p className="text-gray-600 text-center max-w-md">
        We are processing your request. This may take a few moments.
      </p>
    </div>
  );
}