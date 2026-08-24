"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  ChevronDown,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Award,
  BellRing,
} from "lucide-react";
import { CrestLogo } from "../icons/CrestLogo";
import { AnnouncementBar } from "./AnnouncementBar";
import { MegaMenu } from "./MegaMenu";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isGroupsHovered, setIsGroupsHovered] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
    setIsGroupsHovered(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Groups Offered", href: "/groups", hasMegaMenu: true },
    { label: "Admissions", href: "/admissions" },
    { label: "Notice Board", href: "/notice-board", isBadge: true },
    { label: "Announcements", href: "/announcements" },
    { label: "Results", href: "/results" },
    { label: "Facilities", href: "/facilities" },
    { label: "Faculty", href: "/faculty" },
    { label: "Alumni", href: "/alumni" },
    { label: "Gallery", href: "/gallery" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 flex flex-col transition-all duration-300">
        <AnnouncementBar />

        {/* Main Navbar */}
        <div
          className={cn(
            "w-full transition-all duration-300 border-b",
            isScrolled
              ? "bg-white/95 dark:bg-slate-950/95 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/80 shadow-md py-2.5"
              : "bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 py-3.5"
          )}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
            {/* Brand Logo */}
            <Link href="/" className="group flex items-center focus:outline-none">
              <CrestLogo />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);

                if (link.hasMegaMenu) {
                  return (
                    <div
                      key={link.label}
                      className="relative"
                      onMouseEnter={() => setIsGroupsHovered(true)}
                    >
                      <Link
                        href={link.href}
                        className={cn(
                          "px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1 transition-all duration-150",
                          isActive
                            ? "text-medical-600 dark:text-medical-400 bg-medical-50/80 dark:bg-medical-950/50"
                            : "text-slate-700 dark:text-slate-200 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                        )}
                      >
                        <span>{link.label}</span>
                        <ChevronDown className="w-3.5 h-3.5 transition-transform group-hover:rotate-180" />
                      </Link>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={cn(
                      "px-2.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-150 relative",
                      isActive
                        ? "text-medical-600 dark:text-medical-400 bg-medical-50/80 dark:bg-medical-950/50"
                        : "text-slate-700 dark:text-slate-200 hover:text-medical-600 dark:hover:text-medical-400 hover:bg-slate-50 dark:hover:bg-slate-900"
                    )}
                  >
                    <span>{link.label}</span>
                    {link.isBadge && (
                      <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Header Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open Search"
                className="flex items-center gap-1.5 p-2 sm:px-2.5 sm:py-1.5 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                <span className="hidden md:inline">Search</span>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Quick Result / Portal Link */}
              <Link href="/portal" className="hidden sm:inline-flex">
                <Button size="sm" variant="outline" className="text-xs py-1.5 px-3">
                  Student Portal
                </Button>
              </Link>

              {/* Apply Now Primary Action */}
              <Link href="/admissions" className="hidden sm:inline-flex">
                <Button size="sm" variant="gold" className="text-xs py-1.5 px-3" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Admissions 2026
                </Button>
              </Link>

              {/* Mobile Menu Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                aria-label="Toggle navigation menu"
                className="xl:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer"
              >
                {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Desktop MegaMenu on Hover */}
          <AnimatePresence>
            {isGroupsHovered && (
              <MegaMenu onClose={() => setIsGroupsHovered(false)} />
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Navigation Drawer */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="xl:hidden bg-white dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-6 max-h-[80vh] overflow-y-auto shadow-2xl"
            >
              <div className="space-y-1">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);
                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsMobileOpen(false)}
                      className={cn(
                        "block px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400"
                          : "text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-900"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2.5">
                <Link
                  href="/admissions"
                  onClick={() => setIsMobileOpen(false)}
                  className="block w-full"
                >
                  <Button variant="gold" size="md" className="w-full justify-center">
                    Admissions 2026 (Apply Online)
                  </Button>
                </Link>
                <Link
                  href="/results"
                  onClick={() => setIsMobileOpen(false)}
                  className="block w-full"
                >
                  <Button variant="outline" size="sm" className="w-full justify-center gap-2">
                    <Award className="w-4 h-4 text-gold-500" />
                    Check BISE Board Results
                  </Button>
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
};
