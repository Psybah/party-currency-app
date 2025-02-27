import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  ClipboardList,
  Banknote,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PenSquare, label: "Create Event", href: "/create-event" },
  { icon: ClipboardList, label: "Manage Event", href: "/manage-event" },
  { icon: Banknote, label: "Currency Templates", href: "/templates" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function SidebarNavLinks({ isCollapsed, onLinkClick }) {
  return (
    <nav className="flex-1 space-y-6 mt-8 px-3">
      <div className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-3 mb-4 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5 min-w-[10px]" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}