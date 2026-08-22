"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { GalleryItem } from "@/lib/types";

interface LightboxProps {
  items: GalleryItem[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  items,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const currentItem = items[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex, items.length]);

  if (!isOpen || !currentItem) return null;

  const handlePrev = () => {
    onNavigate((currentIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    onNavigate((currentIndex + 1) % items.length);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-navy-950/95 backdrop-blur-lg select-none"
      >
        {/* Top Control Bar */}
        <div className="absolute top-0 inset-x-0 p-4 sm:p-6 flex items-center justify-between z-20 text-white bg-gradient-to-b from-black/60 to-transparent">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-medical-500/20 border border-medical-500/40 text-medical-300 text-xs font-semibold rounded-full uppercase tracking-wider">
              {currentItem.category}
            </span>
            <span className="text-xs sm:text-sm text-slate-300">
              {currentIndex + 1} of {items.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              aria-label="Close Lightbox"
              className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Previous Button */}
        <button
          onClick={handlePrev}
          aria-label="Previous image"
          className="absolute left-4 sm:left-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Main Content */}
        <div className="relative w-full max-w-5xl h-[70vh] sm:h-[80vh] flex flex-col items-center justify-center p-4">
          <motion.div
            key={currentItem.id}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full flex items-center justify-center"
          >
            <Image
              src={currentItem.mediaUrl}
              alt={currentItem.title}
              fill
              className="object-contain rounded-xl"
              sizes="(max-width: 1280px) 100vw, 1280px"
              priority
            />
          </motion.div>

          {/* Caption Overlay */}
          <div className="mt-4 text-center max-w-2xl px-4">
            <h4 className="text-white font-display font-semibold text-lg sm:text-xl">
              {currentItem.title}
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              {currentItem.caption}
            </p>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          aria-label="Next image"
          className="absolute right-4 sm:right-8 z-20 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-md transition-all hover:scale-105 cursor-pointer"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </motion.div>
    </AnimatePresence>
  );
};
