"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Shield, LogIn, UserPlus } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/auth-provider";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const pathname = usePathname();
  const { user } = useAuth();
  const isLanding = pathname === "/";

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 border-b-[3px] border-card-border",
        "bg-background/80 backdrop-blur-md"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-cyber-green/10 border-[2px] border-cyber-green rounded-[4px] flex items-center justify-center group-hover:bg-cyber-green/20 transition-colors">
            <Shield className="w-5 h-5 text-cyber-green" />
          </div>
          <span className="font-mono font-bold text-lg tracking-wider text-foreground">
            CIPHERIUM
          </span>
        </Link>

        <div className="flex items-center gap-3">
          {user ? (
            <Link href="/dashboard">
              <Button variant="primary" size="sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  <LogIn className="w-4 h-4" />
                  Login
                </Button>
              </Link>
              <Link href="/signup">
                <Button variant="primary" size="sm">
                  <UserPlus className="w-4 h-4" />
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
