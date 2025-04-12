import React, { useState, useEffect } from "react";
import { Search, Menu } from "lucide-react";
import UserAvatar from "../UserAvatar";

export default function MerchantHeader({ toggleMobileMenu }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    const handleSidebarStateChange = (event) => {
      setSidebarCollapsed(event.detail.isCollapsed);
    };

    window.addEventListener('sidebarStateChange', handleSidebarStateChange);
    return () => {
      window.removeEventListener('sidebarStateChange', handleSidebarStateChange);
    };
  }, []);

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMobileMenu();
  };

  return (
    <header className={`flex justify-between items-center bg-white px-4 md:px-6 border-b h-20 transition-all duration-300 ${
      sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={handleMenuClick}
          className="md:hidden focus:ring-2 focus:ring-bluePrimary focus:ring-offset-2 text-bluePrimary hover:text-blueSecondary focus:outline-none"
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
            <div className="top-full left-0 z-50 absolute bg-white shadow-lg mt-2 p-2 rounded-lg w-64">
              <input
                type="text"
                placeholder="Search Event ID..."
                className="px-3 py-2 border rounded-md focus:ring-2 focus:ring-bluePrimary w-full focus:outline-none"
              />
            </div>
          )}
        </div>
      </div>

      <UserAvatar showName={true} auth={false} merchantLinks={true} />
    </header>
  );
}
