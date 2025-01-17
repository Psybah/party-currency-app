import React from "react";
import { Search } from "lucide-react";
import UserAvatar from "./UserAvatar"; // Import the UserAvatar component

export default function DashboardHeader() {
  return (
    <header className="h-20 border-b flex items-center justify-between px-6">
      {/* Left Section (Empty for now) */}
      <div></div>

      {/* Right Section */}
      <div className="flex items-center gap-6">
        {/* Search Button */}
        <button>
          <Search className="w-5 h-5 text-gray-500" />
        </button>

        {/* User Info */}
        <UserAvatar showName={true} auth={false} />
      </div>
    </header>
  );
}