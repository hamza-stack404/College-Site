"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { initialNoticesData } from "@/lib/data/notices";
import { initialAnnouncementsData } from "@/lib/data/announcements";
import { facultyData } from "@/lib/data/faculty";
import { galleryData } from "@/lib/data/gallery";
import { NoticeItem, PortalUserRole, StaffMember, GalleryItem } from "@/lib/types";
import {
  Plus,
  Trash2,
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
  GraduationCap,
  Image as ImageIcon,
  Printer,
  FileText,
  Upload,
  Calendar,
} from "lucide-react";
import {
  createNoticeAction,
  deleteNoticeAction,
  createAnnouncementAction,
  deleteAnnouncementAction,
  createFacultyAction,
  deleteFacultyAction,
  createGalleryItemAction,
  deleteGalleryItemAction,
  createPortalAccountAction,
  adminResetPasswordAction,
  getAppSettingAction,
  updateAppSettingAction,
} from "@/lib/supabase/actions";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { uploadFileToStorage } from "@/lib/supabase/storage";
import { CrestLogo } from "../icons/CrestLogo";

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
  isMarksEntryOpen: propMarksEntryOpen,
  onToggleMarksEntry: propToggleMarksEntry,
}) => {
  const [activeAdminTab, setActiveAdminTab] = useState<
    "notices" | "announcements" | "faculty" | "gallery" | "accounts" | "admit_cards"
  >("notices");

  // Gate controls (Supabase-backed settings)
  const [isMarksEntryOpen, setIsMarksEntryOpen] = useState(propMarksEntryOpen);
  const [isAdmissionsOpen, setIsAdmissionsOpen] = useState(true);
  const [isTogglingGate, setIsTogglingGate] = useState(false);

  // Status message
  const [actionMessage, setActionMessage] = useState("");
  const showNotification = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(""), 4000);
  };

  // Helper to fetch session token for admin actions
  const getAccessToken = async (): Promise<string | null> => {
    if (!isSupabaseConfigured) return "mock-token";
    const { data } = await supabase.auth.getSession();
    return data.session?.access_token || null;
  };

  // Load app settings on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        const marksRes = await getAppSettingAction("marks_entry_open", true);
        if (typeof marksRes?.value === "boolean") setIsMarksEntryOpen(marksRes.value);

        const admRes = await getAppSettingAction("admissions_open", true);
        if (typeof admRes?.value === "boolean") setIsAdmissionsOpen(admRes.value);
      } catch (err) {
        console.warn("Could not load admin app settings:", err);
      }
    }
    loadSettings();
  }, []);

  const handleToggleMarksGate = async () => {
    setIsTogglingGate(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const nextVal = !isMarksEntryOpen;
      const res = await updateAppSettingAction("marks_entry_open", nextVal, token);
      if (res.success) {
        setIsMarksEntryOpen(nextVal);
        propToggleMarksEntry();
        showNotification(`Marks Entry Window ${nextVal ? "Unlocked" : "Locked"} successfully.`);
      }
    } finally {
      setIsTogglingGate(false);
    }
  };

  const handleToggleAdmissionsGate = async () => {
    setIsTogglingGate(true);
    try {
      const token = await getAccessToken();
      if (!token) return;
      const nextVal = !isAdmissionsOpen;
      const res = await updateAppSettingAction("admissions_open", nextVal, token);
      if (res.success) {
        setIsAdmissionsOpen(nextVal);
        showNotification(`Admissions Portal ${nextVal ? "Opened" : "Closed / Locked"} successfully.`);
      }
    } finally {
      setIsTogglingGate(false);
    }
  };

  /* =========================================================================
     1. Notices Management
     ========================================================================= */
  const [noticesList, setNoticesList] = useState<NoticeItem[]>(initialNoticesData);
  const [newNoticeTitle, setNewNoticeTitle] = useState("");
  const [newNoticeCategory, setNewNoticeCategory] = useState<any>("General Notice");
  const [newNoticeDesc, setNewNoticeDesc] = useState("");
  const [isPublishingNotice, setIsPublishingNotice] = useState(false);

  const fetchNotices = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("notices")
        .select("*")
        .order("date", { ascending: false });
      if (data && !error && data.length > 0) {
        setNoticesList(data as NoticeItem[]);
      }
    } catch (e) {
      console.warn("Notice fetch note:", e);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "notices") fetchNotices();
  }, [activeAdminTab]);

  const handleAddNotice = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingNotice(true);
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
        showNotification("Notice published live!");
      }
    } finally {
      setIsPublishingNotice(false);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this official circular?")) return;
    const token = await getAccessToken();
    if (token) {
      await deleteNoticeAction(id, token);
    }
    setNoticesList(noticesList.filter((n) => n.id !== id));
    showNotification("Notice deleted successfully.");
  };

  /* =========================================================================
     2. Announcements Management (Real CRUD)
     ========================================================================= */
  const [announcementsList, setAnnouncementsList] = useState(initialAnnouncementsData);
  const [newAnnHeading, setNewAnnHeading] = useState("");
  const [newAnnDesc, setNewAnnDesc] = useState("");
  const [newAnnDate, setNewAnnDate] = useState(new Date().toISOString().split("T")[0]);
  const [annImageFile, setAnnImageFile] = useState<File | null>(null);
  const [isPublishingAnn, setIsPublishingAnn] = useState(false);

  const fetchAnnouncements = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("date", { ascending: false });
      if (data && !error && data.length > 0) {
        setAnnouncementsList(data as any);
      }
    } catch (e) {
      console.warn("Announcements fetch note:", e);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "announcements") fetchAnnouncements();
  }, [activeAdminTab]);

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsPublishingAnn(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      let imageUrl = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80";
      if (annImageFile) {
        const uploadRes = await uploadFileToStorage(annImageFile, "gallery-media");
        if (uploadRes.url) imageUrl = uploadRes.url;
      }

      const res = await createAnnouncementAction(
        {
          heading: newAnnHeading,
          description: newAnnDesc,
          image_url: imageUrl,
          date: newAnnDate,
        },
        token
      );

      if (res.success && res.data) {
        setAnnouncementsList([res.data as any, ...announcementsList]);
        setNewAnnHeading("");
        setNewAnnDesc("");
        setAnnImageFile(null);
        showNotification("Announcement published live!");
      }
    } finally {
      setIsPublishingAnn(false);
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this announcement?")) return;
    const token = await getAccessToken();
    if (token) {
      await deleteAnnouncementAction(id, token);
    }
    setAnnouncementsList(announcementsList.filter((a) => a.id !== id));
    showNotification("Announcement removed.");
  };

  /* =========================================================================
     3. Faculty Management (Real CRUD)
     ========================================================================= */
  const [facultyList, setFacultyList] = useState<StaffMember[]>(facultyData);
  const [facultyName, setFacultyName] = useState("");
  const [facultyRole, setFacultyRole] = useState("Subject Teacher");
  const [facultySubject, setFacultySubject] = useState("");
  const [facultyQual, setFacultyQual] = useState("");
  const [facultyClassTaught, setFacultyClassTaught] = useState("11th Pre-Medical");
  const [facultyPhotoFile, setFacultyPhotoFile] = useState<File | null>(null);
  const [isSavingFaculty, setIsSavingFaculty] = useState(false);

  const fetchFaculty = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("faculty")
        .select("*")
        .order("created_at", { ascending: false });
      if (data && !error && data.length > 0) {
        setFacultyList(
          data.map((f) => ({
            id: f.id,
            name: f.name,
            role: f.role,
            subject: f.subject,
            labType: f.lab_type,
            qualification: f.qualification,
            classesTaught: f.classes_taught || [],
            image: f.image_url,
          }))
        );
      }
    } catch (e) {
      console.warn("Faculty fetch note:", e);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "faculty") fetchFaculty();
  }, [activeAdminTab]);

  const handleAddFaculty = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingFaculty(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      let photoUrl = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80";
      if (facultyPhotoFile) {
        const uploadRes = await uploadFileToStorage(facultyPhotoFile, "faculty-photos");
        if (uploadRes.url) photoUrl = uploadRes.url;
      }

      const res = await createFacultyAction(
        {
          name: facultyName,
          role: facultyRole,
          subject: facultySubject || undefined,
          qualification: facultyQual,
          classes_taught: [{ classLevel: "11th", group: facultyClassTaught, section: "Section A" }],
          image_url: photoUrl,
        },
        token
      );

      if (res.success && res.data) {
        setFacultyName("");
        setFacultySubject("");
        setFacultyQual("");
        setFacultyPhotoFile(null);
        fetchFaculty();
        showNotification("Faculty member added successfully.");
      }
    } finally {
      setIsSavingFaculty(false);
    }
  };

  const handleDeleteFaculty = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this faculty profile?")) return;
    const token = await getAccessToken();
    if (token) {
      await deleteFacultyAction(id, token);
    }
    setFacultyList(facultyList.filter((f) => f.id !== id));
    showNotification("Faculty profile removed.");
  };

  /* =========================================================================
     4. Gallery Management (Real CRUD)
     ========================================================================= */
  const [galleryList, setGalleryList] = useState<GalleryItem[]>(galleryData);
  const [galleryTitle, setGalleryTitle] = useState("");
  const [galleryCategory, setGalleryCategory] = useState("Medical Labs");
  const [galleryCaption, setGalleryCaption] = useState("");
  const [galleryDate, setGalleryDate] = useState(new Date().toISOString().split("T")[0]);
  const [galleryFile, setGalleryFile] = useState<File | null>(null);
  const [isSavingGallery, setIsSavingGallery] = useState(false);

  const fetchGallery = async () => {
    if (!isSupabaseConfigured) return;
    try {
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("date", { ascending: false });
      if (data && !error && data.length > 0) {
        setGalleryList(
          data.map((g) => ({
            id: g.id,
            title: g.title,
            category: g.category,
            caption: g.caption || "",
            date: g.date || "",
            type: (g.media_type || g.type || "image") as "image" | "video",
            mediaUrl: g.media_url,
            thumbnailUrl: g.thumbnail_url || g.media_url,
          }))
        );
      }
    } catch (e) {
      console.warn("Gallery fetch note:", e);
    }
  };

  useEffect(() => {
    if (activeAdminTab === "gallery") fetchGallery();
  }, [activeAdminTab]);

  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSavingGallery(true);
    try {
      const token = await getAccessToken();
      if (!token) return;

      let mediaUrl = "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80";
      if (galleryFile) {
        const uploadRes = await uploadFileToStorage(galleryFile, "gallery-media");
        if (uploadRes.url) mediaUrl = uploadRes.url;
      }

      const res = await createGalleryItemAction(
        {
          title: galleryTitle,
          category: galleryCategory,
          caption: galleryCaption,
          date: galleryDate,
          media_type: "image",
          media_url: mediaUrl,
        },
        token
      );

      if (res.success && res.data) {
        setGalleryTitle("");
        setGalleryCaption("");
        setGalleryFile(null);
        fetchGallery();
        showNotification("Gallery item published live.");
      }
    } finally {
      setIsSavingGallery(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm("Are you sure you want to remove this gallery photograph?")) return;
    const token = await getAccessToken();
    if (token) {
      await deleteGalleryItemAction(id, token);
    }
    setGalleryList(galleryList.filter((g) => g.id !== id));
    showNotification("Gallery photograph removed.");
  };

  /* =========================================================================
     5. User Accounts & Temporary Password Management
     ========================================================================= */
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

  const [tempPasswordResult, setTempPasswordResult] = useState<{
    loginId: string;
    role: string;
    tempPassword: string;
    actionType: "created" | "reset";
  } | null>(null);
  const [hasCopiedPassword, setHasCopiedPassword] = useState(false);

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
    if (activeAdminTab === "accounts") fetchProfiles();
  }, [activeAdminTab]);

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setAccountError(null);
    setIsCreatingAccount(true);

    try {
      const token = await getAccessToken();
      if (!token) {
        setAccountError("Admin session expired. Please sign out and sign back in.");
        return;
      }

      const res = await createPortalAccountAction({
        accessToken: token,
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

        setAccountLoginId("");
        setAccountFullName("");
        setAccountFatherName("");
        setAccountContactPhone("");
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
      const token = await getAccessToken();
      if (!token) {
        setAccountError("Admin session expired. Please sign out and sign back in.");
        return;
      }

      const res = await adminResetPasswordAction({
        accessToken: token,
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

  /* =========================================================================
     6. Admit Card Generator (Admin-Only Tool)
     ========================================================================= */
  const [admitStudentName, setAdmitStudentName] = useState("Muhammad Hamza Khan");
  const [admitFatherName, setAdmitFatherName] = useState("Tariq Mahmood Khan");
  const [admitRollNo, setAdmitRollNo] = useState("BCH-2026-0101");
  const [admitGroup, setAdmitGroup] = useState<"Pre-Medical" | "Pre-Engineering" | "Computer Science">("Pre-Medical");
  const [admitExamCenter, setAdmitExamCenter] = useState("Hanif Examination Hall, Main Campus, Karachi");
  const [admitExamDate, setAdmitExamDate] = useState("October 15, 2026");
  const [admitCardPreview, setAdmitCardPreview] = useState(false);

  const handlePrintAdmitCard = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Top Notification Bar */}
      {actionMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-emerald-800 dark:text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Dual Gate Control Strip (Real Supabase Settings) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Marks Entry Gate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-medical-600 dark:text-medical-400 uppercase tracking-wider">
              Academic Assessment Gateway
            </div>
            <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Faculty Marks Submission Window
            </h4>
            <p className="text-xs text-slate-500">
              Current Status:{" "}
              <strong className={isMarksEntryOpen ? "text-emerald-600" : "text-rose-600"}>
                {isMarksEntryOpen ? "UNLOCKED (Open for submissions)" : "LOCKED (Read-only)"}
              </strong>
            </p>
          </div>

          <Button
            variant={isMarksEntryOpen ? "gold" : "primary"}
            size="sm"
            onClick={handleToggleMarksGate}
            disabled={isTogglingGate}
            className="gap-1.5 w-fit text-xs"
          >
            {isMarksEntryOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isMarksEntryOpen ? "Lock Marks Entry" : "Unlock Marks Entry Window"}</span>
          </Button>
        </div>

        {/* Admissions Portal Gate */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm flex flex-col justify-between gap-4">
          <div className="space-y-1">
            <div className="text-[11px] font-bold text-gold-600 dark:text-gold-400 uppercase tracking-wider">
              Admissions Intake Gateway
            </div>
            <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
              Online Admissions & Registration Lock
            </h4>
            <p className="text-xs text-slate-500">
              Public Portal Status:{" "}
              <strong className={isAdmissionsOpen ? "text-emerald-600" : "text-rose-600"}>
                {isAdmissionsOpen ? "OPEN (Accepting online forms)" : "CLOSED (Intake locked)"}
              </strong>
            </p>
          </div>

          <Button
            variant={isAdmissionsOpen ? "gold" : "primary"}
            size="sm"
            onClick={handleToggleAdmissionsGate}
            disabled={isTogglingGate}
            className="gap-1.5 w-fit text-xs"
          >
            {isAdmissionsOpen ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            <span>{isAdmissionsOpen ? "Lock Admissions Intake" : "Reopen Admissions Intake"}</span>
          </Button>
        </div>
      </div>

      {/* Admin Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {[
          { id: "notices", label: "Notices CMS" },
          { id: "announcements", label: "Announcements" },
          { id: "faculty", label: "Faculty Directory" },
          { id: "gallery", label: "Media Gallery" },
          { id: "accounts", label: "User Accounts & Passwords" },
          { id: "admit_cards", label: "Admit Card Generator" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              activeAdminTab === tab.id
                ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-sm"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Notices CMS Manager */}
      {activeAdminTab === "notices" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Publish Official College Notice
            </h4>

            <form onSubmit={handleAddNotice} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Circular Heading *
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

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Notice Description & Instructions *
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

              <Button type="submit" variant="primary" size="md" disabled={isPublishingNotice}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{isPublishingNotice ? "Publishing to Supabase..." : "Publish Circular Live"}</span>
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
                    title="Delete Notice"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Announcements Manager (Real CRUD) */}
      {activeAdminTab === "announcements" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Publish Campus Announcement
            </h4>

            <form onSubmit={handleAddAnnouncement} className="space-y-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Title / Heading *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Inauguration of New High-Throughput PCR Diagnostics Facility"
                  value={newAnnHeading}
                  onChange={(e) => setNewAnnHeading(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Announcement Details *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Event recap, keynote speeches, or campus guidelines..."
                  value={newAnnDesc}
                  onChange={(e) => setNewAnnDesc(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={newAnnDate}
                    onChange={(e) => setNewAnnDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Upload Banner Photo (Supabase Storage)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setAnnImageFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-medical-50 file:text-medical-700 dark:file:bg-medical-950 dark:file:text-medical-300 cursor-pointer"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" disabled={isPublishingAnn}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{isPublishingAnn ? "Uploading & Publishing..." : "Publish Announcement"}</span>
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Active Announcements ({announcementsList.length})
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
                    onClick={() => handleDeleteAnnouncement(a.id)}
                    className="text-rose-500 hover:text-rose-600"
                    title="Delete Announcement"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Faculty Directory (Real CRUD) */}
      {activeAdminTab === "faculty" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Add Teaching Faculty or Lab Staff
            </h4>

            <form onSubmit={handleAddFaculty} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Member Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Prof. Dr. Tariq Khan"
                    value={facultyName}
                    onChange={(e) => setFacultyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Designation Role *
                  </label>
                  <select
                    value={facultyRole}
                    onChange={(e) => setFacultyRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Principal">Principal</option>
                    <option value="Vice Principal">Vice Principal</option>
                    <option value="Subject Teacher">Subject Teacher</option>
                    <option value="Lab Teacher">Lab Teacher / Demonstrator</option>
                    <option value="PTI">Physical Training Instructor (PTI)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Teaching Subject (Optional)
                  </label>
                  <input
                    placeholder="e.g. Biology & Genetics"
                    value={facultySubject}
                    onChange={(e) => setFacultySubject(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Academic Qualifications *
                  </label>
                  <input
                    required
                    placeholder="e.g. M.Phil (Biochemistry), B.Ed"
                    value={facultyQual}
                    onChange={(e) => setFacultyQual(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Class Allocation
                  </label>
                  <select
                    value={facultyClassTaught}
                    onChange={(e) => setFacultyClassTaught(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Pre-Medical">Class 11 & 12 Pre-Medical</option>
                    <option value="Pre-Engineering">Class 11 & 12 Pre-Engineering</option>
                    <option value="Computer Science">Class 11 & 12 Computer Science (ICS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Staff Photograph (faculty-photos bucket)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFacultyPhotoFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-medical-50 file:text-medical-700 dark:file:bg-medical-950 dark:file:text-medical-300 cursor-pointer"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" disabled={isSavingFaculty}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{isSavingFaculty ? "Uploading & Saving..." : "Add Faculty Member"}</span>
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Faculty Members Directory ({facultyList.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {facultyList.map((f) => (
                <div key={f.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{f.name}</div>
                    <div className="text-xs text-slate-400">
                      {f.role} • {f.subject || f.qualification}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteFaculty(f.id)}
                    className="text-rose-500 hover:text-rose-600"
                    title="Delete Faculty Profile"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Gallery Management (Real CRUD) */}
      {activeAdminTab === "gallery" && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
            <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
              Upload Official Gallery Photograph
            </h4>

            <form onSubmit={handleAddGalleryItem} className="space-y-4 max-w-2xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Photograph Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Molecular Biology Thermal Cycler Session"
                    value={galleryTitle}
                    onChange={(e) => setGalleryTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category Tag *
                  </label>
                  <select
                    value={galleryCategory}
                    onChange={(e) => setGalleryCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  >
                    <option value="Medical Labs">Medical Labs</option>
                    <option value="Anatomy & Surgery">Anatomy & Surgery</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Sports & Fitness">Sports & Fitness</option>
                    <option value="Convocations">Convocations</option>
                    <option value="Science Expo">Science Expo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Caption / Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Short explanatory context for visitors..."
                  value={galleryCaption}
                  onChange={(e) => setGalleryCaption(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Capture Date
                  </label>
                  <input
                    type="date"
                    value={galleryDate}
                    onChange={(e) => setGalleryDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Image File (gallery-media bucket)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setGalleryFile(e.target.files?.[0] || null)}
                    className="w-full text-xs text-slate-500 file:mr-2 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-medical-50 file:text-medical-700 dark:file:bg-medical-950 dark:file:text-medical-300 cursor-pointer"
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" size="md" disabled={isSavingGallery}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>{isSavingGallery ? "Uploading & Publishing..." : "Add to Gallery"}</span>
              </Button>
            </form>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-4">
            <h4 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              Media Archive ({galleryList.length})
            </h4>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {galleryList.map((item) => (
                <div key={item.id} className="py-3.5 flex items-center justify-between text-xs sm:text-sm">
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{item.title}</div>
                    <div className="text-xs text-slate-400">
                      {item.category} • {item.date}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteGallery(item.id)}
                    className="text-rose-500 hover:text-rose-600"
                    title="Delete Media"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: Accounts & Auth Provisioning Manager */}
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

      {/* TAB 6: Admit Card Generator (Admin-Only Tool) */}
      {activeAdminTab === "admit_cards" && (
        <div className="space-y-8">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6 no-print">
            <div>
              <h4 className="font-display font-bold text-xl text-slate-900 dark:text-white">
                Generate Official Candidate Admit Card
              </h4>
              <p className="text-xs text-slate-500 mt-1">
                Enter candidate particulars to generate a printable examination hall entry slip.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Candidate Student Name *
                </label>
                <input
                  type="text"
                  value={admitStudentName}
                  onChange={(e) => setAdmitStudentName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Father&apos;s Name *
                </label>
                <input
                  type="text"
                  value={admitFatherName}
                  onChange={(e) => setAdmitFatherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Roll / Exam Seat Number *
                </label>
                <input
                  type="text"
                  value={admitRollNo}
                  onChange={(e) => setAdmitRollNo(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Academic Stream / Group *
                </label>
                <select
                  value={admitGroup}
                  onChange={(e) => setAdmitGroup(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
                >
                  <option value="Pre-Medical">F.Sc Pre-Medical</option>
                  <option value="Pre-Engineering">F.Sc Pre-Engineering</option>
                  <option value="Computer Science">ICS Computer Science</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Designated Examination Center *
                </label>
                <input
                  type="text"
                  value={admitExamCenter}
                  onChange={(e) => setAdmitExamCenter(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Commencement Date *
                </label>
                <input
                  type="text"
                  value={admitExamDate}
                  onChange={(e) => setAdmitExamDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="primary"
                size="md"
                onClick={() => setAdmitCardPreview(true)}
                className="gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Generate / Update Card Preview</span>
              </Button>
            </div>
          </div>

          {/* Printable Admit Card Layout */}
          {(admitCardPreview || true) && (
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-10 shadow-xl space-y-6">
              <div className="flex justify-between items-center no-print border-b border-slate-200 dark:border-slate-800 pb-4">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Admit Card Ready for Print
                </div>
                <Button variant="gold" size="sm" onClick={handlePrintAdmitCard} className="gap-2 text-xs">
                  <Printer className="w-4 h-4" />
                  <span>Print Admit Card</span>
                </Button>
              </div>

              {/* Physical Print Slip Card */}
              <div className="border-2 border-navy-900 p-6 sm:p-8 rounded-2xl bg-white text-slate-900 space-y-6 font-sans">
                {/* Header Strip */}
                <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-navy-900 pb-4 gap-4 text-center sm:text-left">
                  <div className="flex items-center gap-3">
                    <CrestLogo showText={false} className="w-16 h-16" />
                    <div>
                      <h2 className="font-display font-black text-xl text-navy-950 uppercase tracking-tight">
                        Bahria College Hanif Campus
                      </h2>
                      <div className="text-xs font-bold text-medical-700 uppercase tracking-wider">
                        Affiliated with Federal Board (FBISE) Islamabad
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Official Academic Term Examination Authority
                      </div>
                    </div>
                  </div>

                  <div className="border-2 border-navy-900 px-4 py-2 rounded-xl text-center">
                    <div className="text-[10px] font-bold text-slate-500 uppercase">Examination Roll No</div>
                    <div className="font-mono font-black text-xl text-navy-950">{admitRollNo}</div>
                  </div>
                </div>

                {/* Subtitle Banner */}
                <div className="bg-navy-950 text-white text-center py-1.5 px-4 rounded-lg font-bold text-xs uppercase tracking-widest">
                  PROVISIONAL ADMIT CARD & CANDIDATE ENTRY PASS — CLASS 11 (HSSC-I)
                </div>

                {/* Candidate Particulars Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-8 text-xs border border-slate-300 p-4 rounded-xl bg-slate-50/50">
                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600">Candidate Name:</span>
                    <span className="font-bold text-navy-950 uppercase">{admitStudentName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600">Father&apos;s Name:</span>
                    <span className="font-semibold text-slate-900">{admitFatherName}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600">Discipline / Group:</span>
                    <span className="font-bold text-medical-700">{admitGroup}</span>
                  </div>

                  <div className="flex justify-between border-b border-slate-200 pb-1.5">
                    <span className="font-bold text-slate-600">Commencement Date:</span>
                    <span className="font-semibold text-slate-900">{admitExamDate}</span>
                  </div>

                  <div className="sm:col-span-2 flex justify-between pt-1">
                    <span className="font-bold text-slate-600">Examination Venue:</span>
                    <span className="font-semibold text-slate-900 text-right">{admitExamCenter}</span>
                  </div>
                </div>

                {/* Examination Instructions */}
                <div className="border border-slate-200 rounded-xl p-4 text-[11px] text-slate-600 space-y-1.5 bg-slate-50/30">
                  <div className="font-bold text-slate-900 uppercase tracking-wider text-xs mb-1">
                    Mandatory Candidate Instructions:
                  </div>
                  <p>1. Candidates must arrive at the examination center 30 minutes prior to scheduled start time.</p>
                  <p>2. Possession of mobile phones, smartwatches, or unauthorized study notes inside the hall is strictly prohibited.</p>
                  <p>3. This card along with the physical college student ID pass must be displayed on the candidate desk at all times.</p>
                  <p>4. Non-compliance with invigilator directions will result in immediate disqualification under FBISE exam bylaws.</p>
                </div>

                {/* Signatures & Seal */}
                <div className="grid grid-cols-3 gap-4 pt-6 text-center text-xs">
                  <div className="space-y-10">
                    <div className="h-10 border-b border-dashed border-slate-400" />
                    <span className="font-bold text-slate-700 text-[11px]">Candidate Signature</span>
                  </div>

                  <div className="flex items-center justify-center">
                    <div className="w-20 h-20 rounded-full border-2 border-dashed border-gold-600 text-gold-700 flex items-center justify-center text-[10px] font-bold uppercase text-center p-1">
                      Official Institutional Seal
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="h-10 border-b border-dashed border-slate-400" />
                    <span className="font-bold text-slate-700 text-[11px]">Controller of Examinations</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
