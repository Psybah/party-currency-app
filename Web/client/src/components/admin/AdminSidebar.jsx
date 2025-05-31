import React, { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  LogOut,
  PanelRightOpen,
  PanelLeftOpen,
  X,
  Calendar,
  ArrowRightLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SidebarLogo from "../sidebar/SidebarLogo";
import { USER_PROFILE_CONTEXT } from "@/context";
import { deleteAuth, clearAllAuth } from "@/lib/util";

export function AdminSidebar({ isOpen, onClose }) {
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();

  const handleCollapse = (collapsed) => {
    setIsCollapsed(collapsed);
    window.dispatchEvent(
      new CustomEvent("sidebarStateChange", {
        detail: { isCollapsed: collapsed },
      })
    );
  };

  const handleLogout = () => {
    // Clear all auth data
    clearAllAuth();
    // Clear user profile
    setUserProfile(null);
    // Clear any stored tokens
    localStorage.removeItem("resetToken");
    localStorage.removeItem("userType");
    // Force a page reload to clear any cached states
    window.location.href = "/";
  };

  const navLinks = [
    {
      path: "/admin/dashboard",
      icon: <LayoutDashboard className="w-5 h-5 min-w-[20px]" />,
      label: "Dashboard",
    },
    {
      path: "/admin/user-management",
      icon: <Users className="w-5 h-5 min-w-[20px]" />,
      label: "User Management",
    },
    {
      path: "/admin/events",
      icon: <Calendar className="w-5 h-5 min-w-[20px]" />,
      label: "Events",
    },
    {
      path: "/admin/transactions",
      icon: <ArrowRightLeft className="w-5 h-5 min-w-[20px]" />,
      label: "Transactions",
    },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={`hidden lg:fixed lg:flex flex-col left-0 top-0 h-screen bg-bluePrimary text-white transition-all duration-300 ${
          isCollapsed ? "w-20" : "w-64"
        }`}
      >
        <div className="flex justify-between items-center border-b border-white/10 px-3 py-2 h-20">
          <SidebarLogo isCollapsed={isCollapsed} />
          <button
            onClick={() => handleCollapse(!isCollapsed)}
            className="text-white hover:text-gray-300"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                isActive(link.path)
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.icon}
              {!isCollapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-3 mb-6">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
          >
            <LogOut className="w-5 h-5" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      {isOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          <div className="fixed inset-y-0 left-0 w-64 bg-bluePrimary flex flex-col h-full">
            <div className="flex justify-between items-center border-b border-white/10 px-4 py-6">
              <SidebarLogo isCollapsed={false} />
              <button onClick={onClose} className="text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="flex-1 space-y-2 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                    isActive(link.path)
                      ? "bg-white/20 text-white"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  onClick={onClose}
                >
                  {link.icon}
                  <span>{link.label}</span>
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 p-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span>Log out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
