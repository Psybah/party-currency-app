import React from "react";
import { Menu } from "lucide-react";
import UserAvatar from "./UserAvatar";

export default function DashboardHeader({ toggleMobileMenu }) {
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
          className="lg:hidden text-bluePrimary hover:text-blueSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <UserAvatar showName={true} auth={false} />
    </header>
  );
}