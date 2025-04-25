import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FileText, Search, Settings, LogOut, Bot, Globe } from "lucide-react";
import Cookies from 'js-cookie'

const DashboardSidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => {
    return location.pathname === path
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Globe, label: "Website Scan", path: "/dashboard/website-scan" },
    { icon: FileText, label: "Scanned Reports", path: "/dashboard/scanned" },
    { icon: Bot, label: "Agent", path: "/dashboard/agent" },
    // { icon: Settings, label: "Settings", path: "/dashboard/settings" },
  ]

  const navigate = useNavigate()

  const handleLogout = () => {
    Cookies.remove('guardex_user')
    navigate('/')
  }


  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar border-r border-sidebar-border overflow-y-auto">
      <div className="flex h-full flex-col">
        {/* Sidebar header */}
        <div className="flex h-16 items-center border-b border-sidebar-border px-6">
          <div className="flex items-center space-x-2">
            <div className="size-8 rounded-lg bg-guardex-500 text-white font-bold flex items-center justify-center">
              G
            </div>
            <span className="font-bold text-lg text-sidebar-foreground">guardex</span>
          </div>
        </div>

        {/* Sidebar navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {menuItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`
                flex items-center px-3 py-3 text-sidebar-foreground rounded-md text-sm mb-1 transition-colors
                ${isActive(item.path)
                  ? "bg-guardex-500/10 text-guardex-400 glow-sm"
                  : "hover:bg-sidebar-accent hover:text-guardex-400"
                }
              `}
            >
              <item.icon size={18} className="mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t border-sidebar-border p-4">
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-3 text-sidebar-foreground hover:text-guardex-400 rounded-md text-sm transition-colors w-full text-left"
          >
            <LogOut size={18} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  )
}

export default DashboardSidebar
