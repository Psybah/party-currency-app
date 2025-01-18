import React from "react";
import { Link } from "react-router-dom";
import {
  LayoutDashboard,
  PenSquare,
  ClipboardList,
  Coins,
  Settings,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: PenSquare, label: "Create Event", href: "/create-event" },
  { icon: ClipboardList, label: "Manage Event", href: "/manage-event" },
  { icon: Coins, label: "Currency Templates", href: "/templates" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export default function SidebarNavLinks({ isCollapsed, onLinkClick }) {
  return (
    <nav className="flex-1 space-y-2 mt-8 px-3 h-full flex flex-col">
      <div className="flex-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            onClick={onLinkClick}
            className="flex items-center gap-3 hover:bg-white/10 px-3 py-2 rounded-lg transition-colors"
          >
            <item.icon className="w-5 h-5 min-w-[20px]" />
            {!isCollapsed && <span>{item.label}</span>}
          </Link>
        ))}
      </div>
    </nav>
  );
}