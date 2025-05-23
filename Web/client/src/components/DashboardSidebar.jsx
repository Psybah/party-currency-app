import React, { useState, useContext, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogOut, PanelRightOpen, PanelLeftOpen, X, Coins, Palette } from "lucide-react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { deleteAuth } from "@/lib/util";
import SidebarLogo from "./sidebar/SidebarLogo";
import SidebarNavLinks from "./sidebar/SidebarNavLinks";
import LogoutConfirmation from "./sidebar/LogoutConfirmation";

export default function Sidebar({ isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sidebarStateChange', { 
      detail: { isCollapsed } 
    }));
  }, [isCollapsed]);

  const handleLogout = () => {
    setUserProfile(null);
    deleteAuth();
    navigate("/login");
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:fixed lg:flex flex-col left-0 top-0 h-screen bg-bluePrimary text-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center border-b border-white/10 px-8 py-2 h-20">
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

        <SidebarNavLinks isCollapsed={isCollapsed} />

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

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      >
        <div
          className={`fixed top-0 left-0 h-screen w-64 bg-bluePrimary text-white transform transition-transform duration-300 flex flex-col ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center px-4 py-6 border-b border-white/10">
            <SidebarLogo isCollapsed={false} />
            <button onClick={onClose} className="text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <SidebarNavLinks isCollapsed={false} onLinkClick={onClose} />

          <div className="mt-auto px-4 mb-6">
            <button
              onClick={() => {
                onClose();
                setIsPopupOpen(true);
              }}
              className="flex items-center gap-3 py-3 hover:bg-white/10 px-3 rounded-lg w-full text-left"
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