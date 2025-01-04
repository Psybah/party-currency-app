import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  ClipboardList,
  Coins,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { USER_PROFILE_CONTEXT } from "@/context"; // Import the context
import { deleteAuth } from "@/lib/util"; // Import the deleteAuth function

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PenSquare, label: "Create Event", href: "/create-event" },
  { icon: ClipboardList, label: "Manage Event", href: "/manage-event" },
  { icon: Coins, label: "Currency Templates", href: "/templates" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // State for popup visibility
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT); // Access the context
  const navigate = useNavigate(); // For redirecting after logout

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleLogout = () => {
    // Clear the user profile from context
    setUserProfile(null);

    // Delete the authentication token
    deleteAuth();

    // Redirect to the login page
    navigate("/login");
  };

  const openPopup = () => {
    setIsPopupOpen(true); // Open the confirmation popup
  };

  const closePopup = () => {
    setIsPopupOpen(false); // Close the confirmation popup
  };

  return (
    <div
      className={`fixed left-0 top-0 h-screen bg-bluePrimary text-white p-4 transition-all duration-300 ${
        isCollapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Logo Section with Collapse Button */}
      <div className="flex justify-between items-center border-white/10 px-3 py-2 border-b h-16">
        {!isCollapsed && (
          <img
            src="/main_logo.svg"
            alt="Party Currency"
            width={120}
            height={40}
          />
        )}
        <button
          onClick={toggleSidebar}
          className="text-white hover:text-gray-300"
        >
          {isCollapsed ? (
            <ChevronsRight className="w-5 h-5" />
          ) : (
            <ChevronsLeft className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="space-y-2 mt-8">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="bottom-8 left-0 absolute px-4 w-full">
        <button
          onClick={openPopup} // Open the confirmation popup
          className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!isCollapsed && <span>Log out</span>}
        </button>
      </div>

      {/* Confirmation Popup
      <ConfirmationPopup
        isOpen={isPopupOpen}
        onConfirm={handleLogout} // Confirm logout
        onCancel={closePopup} // Close the popup
      /> */}
    </div>
  );
}
