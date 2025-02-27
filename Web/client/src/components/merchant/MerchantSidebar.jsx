import React, { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, PanelRightOpen, PanelLeftOpen, X, History, FileText, Settings } from "lucide-react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { deleteAuth } from "@/lib/util";
import SidebarLogo from "../sidebar/SidebarLogo";
import LogoutConfirmation from "../sidebar/LogoutConfirmation";

export function MerchantSidebar({ isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setUserProfile(null);
    deleteAuth();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    {
      path: "/merchant/transactions",
      icon: <History className="w-5 h-5 min-w-[20px]" />,
      label: "Transaction History"
    },
    {
      path: "/merchant/events",
      icon: <FileText className="w-5 h-5 min-w-[20px]" />,
      label: "Event History"
    },
    {
      path: "/merchant/settings",
      icon: <Settings className="w-5 h-5 min-w-[20px]" />,
      label: "Settings"
    }
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:fixed md:flex flex-col left-0 top-0 h-screen bg-bluePrimary text-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center border-b border-white/10 px-3 py-2 h-20">
          <SidebarLogo isCollapsed={isCollapsed} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-gray-300"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </button>
        </div>

        <div className="flex flex-col flex-1 gap-6 p-6">
          {/* Navigation Links */}
          <nav className="flex flex-col gap-4">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                to={link.path}
                className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-white ${
                  location.pathname === link.path ? "bg-opacity-10 bg-white" : ""
                }`}
              >
                {link.icon}
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-3 mb-6">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute left-0 top-0 h-screen w-64 bg-[#46469C] transform transition-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center border-b border-white/10 px-3 py-2 h-20">
            <SidebarLogo isCollapsed={false} />
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex flex-col flex-1 gap-6 p-6">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  to={link.path}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-colors hover:bg-opacity-10 hover:bg-white ${
                    location.pathname === link.path ? "bg-opacity-10 bg-white" : ""
                  }`}
                  onClick={onClose}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="mt-auto px-3 mb-6">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg w-full text-left transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log out</span>
            </button>
          </div>
        </div>
      </div>

      <LogoutConfirmation
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
}
