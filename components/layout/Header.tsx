"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Award,
  BellRing,
  Phone,
  Mail,
  MapPin,
  Compass,
} from "lucide-react";
import { CrestLogo } from "../icons/CrestLogo";
import { AnnouncementBar } from "./AnnouncementBar";
import { SearchModal } from "./SearchModal";
import { ThemeToggle } from "../ui/ThemeToggle";
import { Button } from "../ui/Button";
import { cn } from "@/lib/utils";
import { COLLEGE_INFO } from "@/lib/data/constants";

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleGlobalKeyDown);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleGlobalKeyDown);
    };
  }, []);

  // Close menu on route navigation
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when menu drawer is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Groups Offered", href: "/groups" },
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            {/* Brand Logo with Full Institutional Typography */}
            <Link href="/" className="group flex items-center focus:outline-none flex-shrink-0">
              <CrestLogo />
            </Link>

            {/* Right Header Actions (Always visible outside the menu) */}
            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              {/* Search Trigger */}
              <button
                onClick={() => setIsSearchOpen(true)}
                aria-label="Open Search (Ctrl+K)"
                className="flex items-center gap-1.5 p-2 sm:px-3 sm:py-2 text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                <span className="hidden md:inline">Search</span>
                <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.5 text-[10px] text-slate-400 bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-700 ml-1">
                  ⌘K
                </kbd>
              </button>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Quick Student Portal Link */}
              <Link href="/portal">
                <Button size="sm" variant="outline" className="text-xs py-1.5 px-3">
                  Student Portal
                </Button>
              </Link>

              {/* Global Navigation Menu Toggle (Active at all screen sizes) */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                className={cn(
                  "p-2 sm:px-3 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all cursor-pointer border",
                  isMenuOpen
                    ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 border-navy-950 shadow-md"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
                )}
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                <span className="hidden sm:inline">{isMenuOpen ? "Close" : "Menu"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Global Slide-Out Menu Drawer (Responsive across all screen sizes) */}
        <AnimatePresence>
          {isMenuOpen && (
            <>
              {/* Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed inset-0 top-[100px] bg-slate-950/60 backdrop-blur-sm z-40"
              />

              {/* Drawer Container */}
              <motion.div
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 250 }}
                className="fixed top-[95px] right-0 bottom-0 w-full max-w-sm sm:max-w-md bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 z-50 flex flex-col shadow-2xl overflow-y-auto"
              >
                {/* Drawer Header */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="flex items-center gap-2">
                    <Compass className="w-5 h-5 text-medical-600 dark:text-medical-400" />
                    <span className="font-display font-bold text-base text-slate-900 dark:text-white uppercase tracking-wider">
                      Campus Navigation
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMenuOpen(false)}
                    className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Navigation Links Grid */}
                <div className="p-6 flex-1 space-y-1">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
                    Academic & Campus Pages
                  </div>
                  {navLinks.map((link) => {
                    const isActive =
                      link.href === "/"
                        ? pathname === "/"
                        : pathname.startsWith(link.href);

                    return (
                      <Link
                        key={link.label}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={cn(
                          "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-colors",
                          isActive
                            ? "bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400"
                            : "text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                        )}
                      >
                        <span>{link.label}</span>
                        {link.isBadge && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
                            Circulars
                          </span>
                        )}
                      </Link>
                    );
                  })}

                  {/* Actions & Admissions CTA */}
                  <div className="pt-6 mt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    {/* ADMISSIONS_REOPEN: uncomment when admissions reopen
                    <Link
                      href="/admissions"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="gold" size="md" className="w-full justify-center gap-2">
                        <span>Admissions 2026 (Apply Online)</span>
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                    */}

                    <Link
                      href="/portal"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="primary" size="md" className="w-full justify-center gap-2">
                        <GraduationCap className="w-4 h-4" />
                        <span>Academic Portal (Student / Staff)</span>
                      </Button>
                    </Link>

                    <Link
                      href="/results"
                      onClick={() => setIsMenuOpen(false)}
                      className="block w-full"
                    >
                      <Button variant="outline" size="sm" className="w-full justify-center gap-2">
                        <Award className="w-4 h-4 text-gold-500" />
                        <span>FBISE Board Examination Results</span>
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Drawer Footer Details */}
                <div className="p-6 bg-slate-50 dark:bg-slate-950/60 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-medical-600 dark:text-medical-400" />
                    <span>{COLLEGE_INFO.phonePrimary}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-medical-600 dark:text-medical-400" />
                    <span>{COLLEGE_INFO.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gold-500" />
                    <span>{COLLEGE_INFO.address}</span>
                  </div>
                </div>
              </motion.div>
            </>
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
