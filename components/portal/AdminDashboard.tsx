"use client";

import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { initialNoticesData } from "@/lib/data/notices";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { NoticeItem, PortalUserRole } from "@/lib/types";
import {
  Plus,
  Trash2,
  Shield,
  Lock,
  Unlock,
  CheckCircle2,
  Megaphone,
  BellRing,
  Users,
  KeyRound,
  Copy,
  Check,
  AlertCircle,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { createNoticeAction, createPortalAccountAction, adminResetPasswordAction } from "@/lib/supabase/actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";

interface AdminDashboardProps {
  isMarksEntryOpen: boolean;
  onToggleMarksEntry: () => void;
}

interface ProfileRecord {
  id: string;
  roll_number: string;
  full_name: string;
  role: string;
  discipline?: string;
  section?: string;
  category?: string;
  must_change_password?: boolean;
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

  // Accounts Form State
  const [accountRole, setAccountRole] = useState<PortalUserRole>("student");
  const [accountLoginId, setAccountLoginId] = useState("");
  const [accountFullName, setAccountFullName] = useState("");
  const [accountFatherName, setAccountFatherName] = useState("");
  const [accountDiscipline, setAccountDiscipline] = useState<"Pre-Medical" | "Pre-Engineering" | "Computer Science">("Pre-Medical");
  const [accountClassLevel, setAccountClassLevel] = useState("11th");
  const [accountSection, setAccountSection] = useState("Section A");
  const [accountCategory, setAccountCategory] = useState<"Civilian" | "Armed Forces">("Civilian");
  const [accountContactPhone, setAccountContactPhone] = useState("");

  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [accountError, setAccountError] = useState<string | null>(null);

  // Created / Reset Account Temp Password Display
  const [tempPasswordResult, setTempPasswordResult] = useState<{
    loginId: string;
    role: string;
    tempPassword: string;
    actionType: "created" | "reset";
  } | null>(null);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

  // Profiles list
  const [profilesList, setProfilesList] = useState<ProfileRecord[]>([]);
  const [isLoadingProfiles, setIsLoadingProfiles] = useState(false);
  const [resettingUserId, setResettingUserId] = useState<string | null>(null);

  const fetchProfiles = async () => {
    if (!isSupabaseConfigured) return;
    setIsLoadingProfiles(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, roll_number, full_name, role, discipline, section, category, must_change_password")
        .order("created_at", { ascending: false });

      if (data && !error) {
        setProfilesList(data as ProfileRecord[]);
      }
    } catch (err) {
      console.error("Failed to load profiles:", err);
    } finally {
      setIsLoadingProfiles(false);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "accounts") {
      fetchProfiles();
    }
  }, [activeAdminTab]);

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

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setIsCreatingAccount(true);

    try {
      if (!isSupabaseConfigured) {
        setTempPasswordResult({
          loginId: accountLoginId,
          role: accountRole,
          tempPassword: "demo-pass-" + Math.random().toString(36).slice(-4),
          actionType: "created",
        });
        return;
      }

      const { data: sessionData, error: sessionErr } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken || sessionErr) {
        setAccountError("Admin session expired. Please sign out and sign back in.");
        return;
      }

      const res = await createPortalAccountAction({
        accessToken,
        loginId: accountLoginId,
        role: accountRole,
        fullName: accountFullName,
        fatherName: accountFatherName,
        discipline: accountRole === "student" ? accountDiscipline : undefined,
        classLevel: accountRole === "student" ? accountClassLevel : undefined,
        section: accountRole === "student" ? accountSection : undefined,
        category: accountCategory,
        contactPhone: accountContactPhone,
      });

      if (!res.success) {
        setAccountError(res.message);
        return;
      }

      if (res.data) {
        setTempPasswordResult({
          loginId: res.data.loginId,
          role: res.data.role,
          tempPassword: res.data.tempPassword,
          actionType: "created",
        });

        // Reset form
        setAccountLoginId("");
        setAccountFullName("");
        setAccountFatherName("");
        setAccountContactPhone("");

        // Refresh list
        fetchProfiles();
      }
    } catch (err: any) {
      setAccountError(err.message || "Failed to create account.");
    } finally {
      setIsCreatingAccount(false);
    }
  };

  const handleResetPassword = async (userId: string, rollNumber: string, role: string) => {
    setAccountError(null);
    setResettingUserId(userId);

    try {
      if (!isSupabaseConfigured) {
        setTempPasswordResult({
          loginId: rollNumber,
          role,
          tempPassword: "new-pass-" + Math.random().toString(36).slice(-4),
          actionType: "reset",
        });
        return;
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        setAccountError("Admin session expired. Please sign out and sign back in.");
        return;
      }

      const res = await adminResetPasswordAction({
        accessToken,
        userId,
      });

      if (!res.success) {
        setAccountError(res.message);
        return;
      }

      if (res.data) {
        setTempPasswordResult({
          loginId: rollNumber,
          role,
          tempPassword: res.data.tempPassword,
          actionType: "reset",
        });
        fetchProfiles();
      }
    } catch (err: any) {
      setAccountError(err.message || "Failed to reset password.");
    } finally {
      setResettingUserId(null);
    }
  };

  const handleCopyPassword = () => {
    if (tempPasswordResult) {
      navigator.clipboard.writeText(tempPasswordResult.tempPassword);
      setHasCopiedPassword(true);
      setTimeout(() => setHasCopiedPassword(false), 2500);
    }
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

      {/* Accounts & Auth Provisioning Manager */}
      {activeAdminTab === "accounts" && (
        <div className="space-y-8">
          {/* Temporary Password Announcement Banner */}
          {tempPasswordResult && (
            <div className="p-6 rounded-3xl bg-gradient-to-br from-gold-500/10 via-amber-500/15 to-gold-500/10 border-2 border-gold-400 dark:border-gold-500 shadow-xl space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gold-700 dark:text-gold-300 font-bold text-sm">
                  <KeyRound className="w-5 h-5 text-gold-500" />
                  <span>
                    {tempPasswordResult.actionType === "created"
                      ? "Account Successfully Provisioned!"
                      : "Account Password Successfully Reset!"}
                  </span>
                </div>
                <Badge variant="gold" size="sm">
                  {tempPasswordResult.role.toUpperCase()}
                </Badge>
              </div>

              <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                Hand this temporary password to the user. They will be required to set their own permanent password on first login:
              </div>

              <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-gold-300 dark:border-gold-700">
                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Login ID</div>
                  <div className="font-mono font-bold text-base text-navy-950 dark:text-white">
                    {tempPasswordResult.loginId}
                  </div>
                </div>

                <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />

                <div>
                  <div className="text-[10px] font-bold text-slate-400 uppercase">Temporary Password</div>
                  <div className="font-mono font-bold text-lg text-medical-600 dark:text-medical-400">
                    {tempPasswordResult.tempPassword}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopyPassword}
                  className="ml-auto gap-1.5 text-xs"
                >
                  {hasCopiedPassword ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{hasCopiedPassword ? "Copied!" : "Copy Password"}</span>
                </Button>
              </div>
            </div>
          )}

          {accountError && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-center gap-3 text-xs text-rose-800 dark:text-rose-200">
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
              <div>{accountError}</div>
            </div>
          )}

          {/* Account Creation Form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Create Student, Teacher or Parent Account
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Generates real Supabase Auth credentials with mandatory first-time password update.
              </p>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Account Role *
                  </label>
                  <select
                    value={accountRole}
                    onChange={(e) => setAccountRole(e.target.value as PortalUserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="student">Student Account</option>
                    <option value="parent">Parent Account</option>
                    <option value="teacher">Teacher / Faculty Account</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Login ID / Roll Number *
                  </label>
                  <input
                    required
                    placeholder={accountRole === "teacher" ? "TCH-004" : "BCH-2026-0102"}
                    value={accountLoginId}
                    onChange={(e) => setAccountLoginId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    required
                    placeholder="e.g. Zaid Ahmed"
                    value={accountFullName}
                    onChange={(e) => setAccountFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Father&apos;s Name
                  </label>
                  <input
                    placeholder="e.g. Ahmed Raza"
                    value={accountFatherName}
                    onChange={(e) => setAccountFatherName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              {accountRole === "student" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Academic Discipline
                    </label>
                    <select
                      value={accountDiscipline}
                      onChange={(e) => setAccountDiscipline(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                    >
                      <option value="Pre-Medical">Pre-Medical</option>
                      <option value="Pre-Engineering">Pre-Engineering</option>
                      <option value="Computer Science">Computer Science (ICS)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Class Level
                    </label>
                    <select
                      value={accountClassLevel}
                      onChange={(e) => setAccountClassLevel(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                    >
                      <option value="11th">Class 11 (HSSC Part-I)</option>
                      <option value="12th">Class 12 (HSSC Part-II)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Section
                    </label>
                    <input
                      placeholder="Section A"
                      value={accountSection}
                      onChange={(e) => setAccountSection(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Fee Quota Category
                  </label>
                  <select
                    value={accountCategory}
                    onChange={(e) => setAccountCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Civilian">Civilian Rate</option>
                    <option value="Armed Forces">Armed Forces Dependent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Phone (WhatsApp)
                  </label>
                  <input
                    placeholder="0300-1234567"
                    value={accountContactPhone}
                    onChange={(e) => setAccountContactPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isCreatingAccount}
                className="gap-2"
              >
                {isCreatingAccount && <Loader2 className="w-4 h-4 animate-spin" />}
                <span>{isCreatingAccount ? "Creating Account..." : "Create & Provision Account"}</span>
              </Button>
            </form>
          </div>

          {/* Active Accounts Table with Password Reset Action */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                  Active User Profiles & Password Management
                </h4>
                <p className="text-xs text-slate-500">
                  Manage accounts and generate emergency temporary passwords for students/parents.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={fetchProfiles}
                className="gap-1.5 text-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoadingProfiles ? "animate-spin" : ""}`} />
                <span>Refresh</span>
              </Button>
            </div>

            {profilesList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                      <th className="py-3 px-4 rounded-l-xl">Roll ID</th>
                      <th className="py-3 px-4">Full Name</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Discipline / Group</th>
                      <th className="py-3 px-4">Password Status</th>
                      <th className="py-3 px-4 rounded-r-xl text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {profilesList.map((p) => (
                      <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-bold text-navy-950 dark:text-white">
                          {p.roll_number}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {p.full_name}
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant={p.role === "admin" ? "gold" : "medical"} size="sm">
                            {p.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          {p.discipline || "—"} {p.section ? `(${p.section})` : ""}
                        </td>
                        <td className="py-3 px-4">
                          {p.must_change_password ? (
                            <span className="text-[11px] font-bold text-amber-600">Temp Password Active</span>
                          ) : (
                            <span className="text-[11px] font-medium text-emerald-600">Permanent Password Set</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={resettingUserId === p.id}
                            onClick={() => handleResetPassword(p.id, p.roll_number, p.role)}
                            className="gap-1 text-[11px] py-1 px-2.5"
                          >
                            <KeyRound className="w-3 h-3 text-gold-500" />
                            <span>{resettingUserId === p.id ? "Resetting..." : "Reset Password"}</span>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-xs text-slate-500">
                {isLoadingProfiles ? "Loading user accounts..." : "No user profiles found or Supabase offline. Create an account above."}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
