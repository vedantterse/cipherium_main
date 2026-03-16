"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  LayoutDashboard,
  ScanSearch,
  History,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/analyze", label: "New Analysis", icon: ScanSearch },
  { href: "/dashboard/history", label: "History", icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="p-6 border-b-[3px] border-card-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-cyber-green/10 border-[2px] border-cyber-green rounded-[4px] flex items-center justify-center">
            <Shield className="w-5 h-5 text-cyber-green" />
          </div>
          <span className="font-mono font-bold text-lg tracking-wider">
            CIPHERIUM
          </span>
        </Link>
      </div>

      {/* Nav Items */}
      <div className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-[4px] font-mono text-sm font-medium",
                "transition-all duration-100 border-[2px]",
                isActive
                  ? "border-cyber-green bg-cyber-green/10 text-cyber-green shadow-[3px_3px_0_theme(colors.cyber-green)]"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted hover:border-card-border"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 border-t-[3px] border-card-border">
          <div className="px-4 py-2 mb-2">
            <p className="font-mono text-sm font-bold text-foreground truncate">
              {user.name}
            </p>
            <p className="font-mono text-xs text-muted-foreground truncate">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-[4px] font-mono text-sm text-muted-foreground hover:text-cyber-red hover:bg-cyber-red/5 transition-colors border-[2px] border-transparent hover:border-cyber-red/30"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border-[3px] border-card-border rounded-[4px] shadow-[3px_3px_0_theme(colors.cyber-green)]"
      >
        {mobileOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen w-64 bg-card border-r-[3px] border-card-border flex flex-col z-40",
          "lg:translate-x-0 transition-transform duration-200",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {sidebarContent}
      </aside>
    </>
  );
}
