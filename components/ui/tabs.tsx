"use client";

import { cn } from "@/lib/utils";
import { useState } from "react";

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  className?: string;
}

export function Tabs({ tabs, activeTab, onTabChange, className }: TabsProps) {
  return (
    <div className={cn("flex gap-2", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-4 py-2.5 font-mono text-sm font-bold uppercase tracking-wider",
            "border-[3px] rounded-[4px] transition-all duration-100",
            "flex items-center gap-2",
            activeTab === tab.id
              ? "border-cyber-green bg-cyber-green/10 text-cyber-green shadow-[3px_3px_0_theme(colors.cyber-green)]"
              : "border-card-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
          )}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}
