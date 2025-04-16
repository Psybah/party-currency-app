import React, { useState, useEffect } from "react";
import { Menu } from "lucide-react";
import UserAvatar from "../UserAvatar";
import { cn } from "@/lib/utils";

export default function MerchantHeader({ toggleMobileMenu }) {
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

  return (
    <header className={`h-20 border-b flex items-center justify-between px-4 md:px-6 bg-white transition-all duration-300 ${
      sidebarCollapsed ? "lg:pl-20" : "lg:pl-64"
    }`}>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleMobileMenu}
          className="lg:hidden text-bluePrimary hover:text-blueSecondary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-bluePrimary"
          aria-label="Toggle mobile menu"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      <UserAvatar showName={true} auth={false} merchantLinks={true} />
    </header>
  );
}
