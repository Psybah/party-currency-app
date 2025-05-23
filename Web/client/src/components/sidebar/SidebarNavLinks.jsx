import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  ClipboardList,
  Settings,
  Coins,
  Palette,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PenSquare, label: "Create Event", href: "/create-event" },
  { icon: ClipboardList, label: "Manage Event", href: "/manage-event" },
  // My Currencies and Customize Currency will be handled with toggler below
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function SidebarNavLinks({ isCollapsed, onLinkClick }) {
  const [showCustomize, setShowCustomize] = useState(false);
  const location = useLocation();

  // Find index of Manage Event to insert after
  const manageEventIdx = navItems.findIndex(item => item.label === "Manage Event");
  const before = navItems.slice(0, manageEventIdx + 1);
  const after = navItems.slice(manageEventIdx + 1);

  return (
    <nav className="flex-1 space-y-6 mt-8 px-3">
      <div className="flex-1">
        {before.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 hover:bg-white/10 px-3 py-3 mb-4 rounded-lg transition-colors ${location.pathname === item.href ? 'bg-white/10' : ''}`}
          >
            <item.icon className="w-5 h-5 min-w-[10px]" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {/* My Currencies toggler+link */}
        <div className={`flex items-center gap-3 hover:bg-white/10 px-3 py-3 mb-2 rounded-lg transition-colors w-full ${location.pathname.startsWith('/my-currencies') || location.pathname.startsWith('/templates') ? 'bg-white/10' : ''}`}
        >
          <Link
            to="/my-currencies"
            onClick={onLinkClick}
            className="flex items-center gap-3 flex-1 min-w-0"
            style={{ textDecoration: 'none' }}
          >
            <Coins className="w-5 h-5 min-w-[10px]" />
            {!isCollapsed && <span className="truncate">My Currencies</span>}
          </Link>
          {!isCollapsed && (
            <button
              type="button"
              onClick={e => { e.stopPropagation(); setShowCustomize(v => !v); }}
              className="ml-2 focus:outline-none"
              tabIndex={0}
            >
              {showCustomize ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          )}
        </div>
        {/* Customize Currency sub-link */}
        {showCustomize && !isCollapsed && (
          <Link
            to="/templates"
            onClick={onLinkClick}
            className={`flex items-center gap-3 hover:bg-white/10 px-3 py-2 mb-2 rounded-lg transition-colors text-sm truncate ${location.pathname === '/templates' ? 'bg-white/10' : ''}`}
          >
            <Palette className="w-5 h-5 min-w-[10px]" />
            <span>Customize Currency</span>
          </Link>
        )}

        {after.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className={`flex items-center gap-3 hover:bg-white/10 px-3 py-3 mb-4 rounded-lg transition-colors ${location.pathname === item.href ? 'bg-white/10' : ''}`}
          >
            <item.icon className="w-5 h-5 min-w-[10px]" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}