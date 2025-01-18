import React from "react";
import { Link } from "react-router-dom";

export default function SidebarLogo({ isCollapsed }) {
  return (
    !isCollapsed && (
      <Link to="/">
        <img src="/main_logo.svg" alt="Party Currency" width={120} height={40} />
      </Link>
    )
  );
}