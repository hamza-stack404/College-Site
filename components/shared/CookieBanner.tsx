"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, X } from "lucide-react";
import { Button } from "../ui/Button";

export const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("bahria_cookie_consent");
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("bahria_cookie_consent", "accepted");
    setShow(false);
  };

  const handleDecline = () => {
    localStorage.setItem("bahria_cookie_consent", "declined");
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 p-5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 shadow-2xl"
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-medical-50 dark:bg-medical-950 text-medical-600 dark:text-medical-400 flex-shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                Institutional Privacy & Analytics
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                Bahria College Hanif uses privacy-compliant cookies to improve institutional navigation, optimize admissions portals, and deliver personalized academic experiences.
              </p>
              <div className="flex items-center gap-2 mt-4">
                <Button size="sm" variant="medical" onClick={handleAccept}>
                  Accept All
                </Button>
                <Button size="sm" variant="outline" onClick={handleDecline}>
                  Essential Only
                </Button>
              </div>
            </div>
            <button
              onClick={() => setShow(false)}
              aria-label="Dismiss cookie notice"
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
