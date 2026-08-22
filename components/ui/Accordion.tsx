"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItemData {
  id: string;
  title: string;
  content: React.ReactNode;
  badge?: string;
}

interface AccordionProps {
  items: AccordionItemData[];
  allowMultiple?: boolean;
  className?: string;
  defaultExpandedIds?: string[];
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  allowMultiple = false,
  className,
  defaultExpandedIds = [],
}) => {
  const [expandedIds, setExpandedIds] = useState<string[]>(defaultExpandedIds);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setExpandedIds((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setExpandedIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isExpanded = expandedIds.includes(item.id);
        return (
          <div
            key={item.id}
            className="border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm overflow-hidden transition-all duration-200 hover:border-slate-300 dark:hover:border-slate-700"
          >
            <button
              onClick={() => toggleItem(item.id)}
              aria-expanded={isExpanded}
              className="w-full px-5 py-4 flex items-center justify-between text-left gap-4 font-semibold text-slate-900 dark:text-slate-100 hover:text-medical-600 dark:hover:text-medical-400 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm sm:text-base font-display">{item.title}</span>
                {item.badge && (
                  <span className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-medical-50 dark:bg-medical-950 text-medical-700 dark:text-medical-300 rounded-full border border-medical-200 dark:border-medical-800">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                className={cn(
                  "w-5 h-5 flex-shrink-0 text-slate-400 transition-transform duration-200",
                  isExpanded && "rotate-180 text-medical-600 dark:text-medical-400"
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 pt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-800/50">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
