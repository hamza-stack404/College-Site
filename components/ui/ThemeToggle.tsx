"use client";

import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = "" }) => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 ${className}`} />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle Dark / Light Theme"
      className={`relative p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-medical-500 cursor-pointer ${className}`}
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-gold-400 transition-transform rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="w-5 h-5 text-navy-800 transition-transform -rotate-12 hover:rotate-0" />
      )}
    </button>
  );
};
