import { useState, useContext, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { LogOut, PanelRightOpen, PanelLeftOpen, X, History, Settings, Wallet, CalendarDays } from "lucide-react";
import { USER_PROFILE_CONTEXT } from "@/context";
import { deleteAuth } from "@/lib/util";
import SidebarLogo from "../sidebar/SidebarLogo";
import LogoutConfirmation from "../sidebar/LogoutConfirmation";
import { cn } from "@/lib/utils";
import PropTypes from 'prop-types';

export function MerchantSidebar({ isOpen, onClose }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { setUserProfile } = useContext(USER_PROFILE_CONTEXT);
  const navigate = useNavigate();
  const location = useLocation();

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

  const navigation = [
    {
      name: "Virtual Account",
      href: "/merchant/virtual-account",
      icon: <Wallet className="w-5 h-5 min-w-[20px]" />,
    },
    {
      name: "Transaction History",
      href: "/merchant/transactions",
      icon: <History className="w-5 h-5 min-w-[20px]" />,
    },
    {
      name: "Event History",
      href: "/merchant/events",
      icon: <CalendarDays className="w-5 h-5 min-w-[20px]" />,
    },
    {
      name: "Settings",
      href: "/merchant/settings",
      icon: <Settings className="w-5 h-5 min-w-[20px]" />,
    },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <div
        className={cn(
          "hidden lg:fixed lg:flex flex-col left-0 top-0 h-screen bg-bluePrimary text-white transition-all duration-300",
          isCollapsed ? "w-20" : "w-64"
        )}
      >
        <div className="flex justify-between items-center border-b border-white/10 px-3 py-2 h-20">
          <SidebarLogo isCollapsed={isCollapsed} />
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white hover:text-gray-300 transition-colors"
          >
            {isCollapsed ? (
              <PanelLeftOpen className="w-5 h-5" />
            ) : (
              <PanelRightOpen className="w-5 h-5" />
            )}
          </button>
        </div>

        <nav className="flex-1 space-y-2 px-3 py-4">
          {navigation.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                location.pathname === link.href
                  ? "bg-white/20 text-white"
                  : "text-white/80 hover:bg-white/10 hover:text-white"
              )}
            >
              {link.icon}
              {!isCollapsed && <span>{link.name}</span>}
            </Link>
          ))}
        </nav>

        <div className="mt-auto px-3 mb-6">
          <button
            onClick={() => setIsPopupOpen(true)}
            className="flex items-center gap-3 w-full px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span>Log out</span>}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <div
          className={cn(
            "absolute left-0 top-0 h-screen w-64 bg-bluePrimary transform transition-transform",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex justify-between items-center border-b border-white/10 px-3 py-2 h-20">
            <SidebarLogo isCollapsed={false} />
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 space-y-2 p-4">
            {navigation.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                  location.pathname === link.href
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
                onClick={onClose}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </nav>

          <div className="mt-auto p-4 border-t border-white/10">
            <button
              onClick={() => setIsPopupOpen(true)}
              className="flex items-center gap-3 w-full px-3 py-2 text-white/80 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
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

MerchantSidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};
