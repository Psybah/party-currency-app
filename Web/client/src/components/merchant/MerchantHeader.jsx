import React, { useState } from "react";
import { Search, Menu } from "lucide-react";
import UserAvatar from "../UserAvatar";

export default function MerchantHeader({ toggleMobileMenu }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  };

  return (
    <header className="h-20 border-b flex items-center justify-between px-4 md:px-6 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={handleMenuClick}
          className="md:hidden text-bluePrimary hover:text-blueSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="text-bluePrimary hover:text-blueSecondary"
            aria-label="Toggle search"
          >
            <Search className="w-5 h-5" />
          </button>
          {isSearchOpen && (
            <div className="absolute left-0 top-full mt-2 w-64 bg-white shadow-lg rounded-lg p-2 z-50">
              <input
                type="text"
                placeholder="Search Event ID..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-bluePrimary"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <UserAvatar showName={true} auth={false} />
      </div>
    </header>
  );
}
