"use client";

import React, { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { initialNoticesData } from "@/lib/data/notices";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { NoticeItem } from "@/lib/types";
import { Plus, Trash2, Shield, Lock, Unlock, CheckCircle2, Megaphone, BellRing, Users } from "lucide-react";
import { createNoticeAction } from "@/lib/supabase/actions";

interface AdminDashboardProps {
  isMarksEntryOpen: boolean;
  onToggleMarksEntry: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isMarksEntryOpen,
  onToggleMarksEntry,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<"notices" | "announcements" | "accounts">("notices");
  const [noticesList, setNoticesList] = useState<NoticeItem[]>(initialNoticesData);
  const [announcementsList, setAnnouncementsList] = useState(initialAnnouncementsData);

  // New Notice form
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeCategory, setNewNoticeCategory] = useState<any>("General Notice");
  const [newNoticeDesc, setNewNoticeDesc] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [actionMessage, setActionMessage] = useState("");

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishing(true);
    try {
      const res = await createNoticeAction({
        title: newNoticeTitle,
        category: newNoticeCategory,
        description: newNoticeDesc,
        is_pinned: false,
      });

      if (res.success && res.data) {
        setNoticesList([res.data as any, ...noticesList]);
        setNewNoticeTitle("");
        setNewNoticeDesc("");
        setActionMessage("Notice published live!");
        setTimeout(() => setActionMessage(""), 4000);
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteNotice = (id: string) => {
    setNoticesList(noticesList.filter((n) => n.id !== id));
  };

  return (
    <div className="space-y-8">
      {/* Admin Gate Control Strip */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
            Academic Assessment Window
          </div>
          <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
            Teacher Marks Submission Gateway
          </h4>
          <p className="text-xs text-slate-500">
            Control whether faculty members can enter or modify student marks in the portal.
          </p>
        </div>

        <Button
          variant={isMarksEntryOpen ? "gold" : "primary"}
          size="sm"
          onClick={onToggleMarksEntry}
          className="gap-1.5"
        >
          {isMarksEntryOpen ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          <span>{isMarksEntryOpen ? "Lock Marks Entry" : "Unlock Marks Entry Window"}</span>
        </Button>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {(["notices", "announcements", "accounts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveAdminTab(tab)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold capitalize transition-all cursor-pointer ${
              activeAdminTab === tab
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            Manage {tab}
          </button>
        ))}
      </div>

      {/* Notices CMS Manager */}
      {activeAdminTab === "notices" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Publish Official College Notice
              </h4>
              {actionMessage && (
                <span className="text-xs text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {actionMessage}
                </span>
              )}
            </div>

            <form onSubmit={handleAddNotice} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Circular Heading
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Schedule for 1st Term Practical Assessment 2026"
                  value={newNoticeTitle}
                  onChange={(e) => setNewNoticeTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Notice Category
                  </label>
                  <select
                    value={newNoticeCategory}
                    onChange={(e) => setNewNoticeCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Date Sheet">Date Sheet</option>
                    <option value="Roll No Slip">Roll No Slip</option>
                    <option value="Holiday">Holiday Notification</option>
                    <option value="Fee Due Date">Fee Due Date Notice</option>
                    <option value="General Notice">General Circular</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Description & Instructions
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed guidelines for students and faculty..."
                  value={newNoticeDesc}
                  onChange={(e) => setNewNoticeDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <Button type="submit" variant="primary" size="md" disabled={isPublishing}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{isPublishing ? "Publishing to Supabase..." : "Publish Circular Live"}</span>
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Active Circulars ({noticesList.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {noticesList.map((n) => (
                <div key={n.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900 dark:text-white">{n.title}</div>
                    <div className="text-xs text-slate-400">{n.category} • Published {n.date}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteNotice(n.id)}
                    className="text-rose-500 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Announcements Manager */}
      {activeAdminTab === "announcements" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
          <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Campus Announcements ({announcementsList.length})
          </h4>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {announcementsList.map((a) => (
              <div key={a.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{a.heading}</div>
                  <div className="text-xs text-slate-400">{a.date}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setAnnouncementsList(announcementsList.filter((item) => item.id !== a.id))}
                  className="text-rose-500 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accounts Creator */}
      {activeAdminTab === "accounts" && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
          <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            Generate Student or Faculty Login Credentials
          </h4>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Account provisioned and assigned in database.");
            }}
            className="space-y-4 max-w-md"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Account Role
              </label>
              <select className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white">
                <option>Student Account</option>
                <option>Parent Account</option>
                <option>Teacher / Faculty Account</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Assign College Roll ID (e.g. BCH-2026-0102)
              </label>
              <input
                required
                placeholder="BCH-2026-0102"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
            </div>
            <Button type="submit" variant="primary" size="md">
              Create & Authorize Account
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
