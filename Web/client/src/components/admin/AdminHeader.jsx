import React, { useState } from 'react';
import { Search, Menu } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function AdminHeader({ toggleMobileMenu }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="h-20 border-b flex items-center justify-between px-4 md:px-6 bg-white">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileMenu}
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
                placeholder="Search..."
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-bluePrimary"
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">Admin</span>
        <Avatar className="h-8 w-8">
          <AvatarImage src="/avatar.png" alt="Admin" />
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
