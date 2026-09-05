"use server";

import { revalidatePath } from "next/cache";
import { supabase, isSupabaseConfigured } from "./client";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./admin-client";
import { loginIdToInternalEmail } from "./auth-helpers";
import { PortalUserRole } from "@/lib/types";

export interface NoticeInput {
  title: string;
  category: "Date Sheet" | "Roll No Slip" | "Holiday" | "Fee Due Date" | "General Notice";
  description: string;
  file_url?: string;
  file_size?: string;
  is_pinned?: boolean;
  is_urgent?: boolean;
}

export interface AdmissionApplicationInput {
  applicant_name: string;
  father_name: string;
  father_service_category: "Civilian" | "Navy" | "Army" | "Air Force";
  b_form_number: string;
  selected_discipline: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  matric_total_marks: number;
  matric_obtained_marks: number;
  contact_phone: string;
  contact_email?: string;
}

export interface CreatePortalAccountInput {
  accessToken: string;
  loginId: string;
  role: PortalUserRole;
  fullName: string;
  fatherName?: string;
  discipline?: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  classLevel?: string;
  section?: string;
  category?: "Civilian" | "Armed Forces";
  contactPhone?: string;
  tempPassword?: string;
}

export interface AdminResetPasswordInput {
  accessToken: string;
  userId: string;
}

export interface AnnouncementInput {
  heading: string;
  description: string;
  image_url: string;
  date?: string;
}

export interface FacultyInput {
  name: string;
  role: string;
  subject?: string;
  lab_type?: string;
  qualification: string;
  classes_taught?: any[];
  image_url?: string;
}

export interface GalleryItemInput {
  title: string;
  category: string;
  caption?: string;
  date?: string;
  media_type?: "image" | "video";
  media_url: string;
  thumbnail_url?: string;
}

function generateTempPassword(): string {
  return Math.random().toString(36).slice(-8) + "A1";
}

/**
 * Reusable admin verification helper verifying caller's session token and checking profiles.role === 'admin'
 */
async function verifyAdminCaller(accessToken: string): Promise<{ authorized: boolean; error?: string }> {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { authorized: false, error: "Admin client not configured. Add SUPABASE_SERVICE_ROLE_KEY." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { authorized: false, error: "Not authenticated." };
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "admin") {
    return { authorized: false, error: "Not authorized. Admin access required." };
  }

  return { authorized: true };
}

/* =========================================================================
   1. Admission Application Actions
   ========================================================================= */

export async function submitAdmissionApplicationAction(input: AdmissionApplicationInput) {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Application submitted in local mode. We have received your inquiry!",
      data: { ...input, id: "LOCAL-" + Date.now(), status: "Pending" },
    };
  }

  try {
    const { data, error } = await supabase
      .from("admission_applications")
      .insert([input])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/admissions");
    return {
      success: true,
      message: "Application submitted successfully! Tracking ID generated.",
      data,
    };
  } catch (err: any) {
    console.error("Admission submission error:", err);
    return {
      success: false,
      message: err.message || "Failed to submit application. Please try again.",
    };
  }
}

/* =========================================================================
   2. App Settings Actions (Admissions Lock & Marks Entry Lock)
   ========================================================================= */

export async function getAppSettingAction(key: string, defaultValue: any = null) {
  if (!isSupabaseConfigured) {
    // Default fallback values when DB is offline
    if (key === "admissions_open") return { success: true, value: true };
    if (key === "marks_entry_open") return { success: true, value: true };
    return { success: true, value: defaultValue };
  }

  try {
    const { data, error } = await supabase
      .from("app_settings")
      .select("value")
      .eq("key", key)
      .single();

    if (error || !data) {
      return { success: true, value: defaultValue };
    }

    return { success: true, value: data.value };
  } catch (err: any) {
    console.error(`Error reading setting ${key}:`, err);
    return { success: true, value: defaultValue };
  }
}

export async function updateAppSettingAction(key: string, value: any, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("app_settings")
      .upsert({
        key,
        value,
        updated_at: new Date().toISOString(),
      });

    if (error) throw error;

    revalidatePath("/admissions");
    revalidatePath("/portal");
    revalidatePath("/");
    return { success: true, message: `Setting '${key}' updated successfully.`, value };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update app setting." };
  }
}

/* =========================================================================
   3. Notice Actions (Publish & Real Delete)
   ========================================================================= */

export async function createNoticeAction(notice: NoticeInput) {
  if (!isSupabaseConfigured) {
    return {
      success: true,
      message: "Notice saved in local state mode.",
      data: { ...notice, id: "local-" + Date.now(), date: new Date().toISOString().split("T")[0] },
    };
  }

  try {
    const { data, error } = await supabase
      .from("notices")
      .insert([
        {
          ...notice,
          date: new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/notice-board");
    revalidatePath("/");
    return { success: true, message: "Notice published live successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create notice." };
  }
}

export async function deleteNoticeAction(noticeId: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("notices")
      .delete()
      .eq("id", noticeId);

    if (error) throw error;

    revalidatePath("/notice-board");
    revalidatePath("/");
    return { success: true, message: "Notice deleted successfully." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete notice." };
  }
}

/* =========================================================================
   4. Announcements Actions (Real CRUD)
   ========================================================================= */

export async function createAnnouncementAction(announcement: AnnouncementInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("announcements")
      .insert([
        {
          heading: announcement.heading,
          description: announcement.description,
          image_url: announcement.image_url,
          date: announcement.date || new Date().toISOString().split("T")[0],
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/announcements");
    revalidatePath("/");
    return { success: true, message: "Announcement published live.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create announcement." };
  }
}

export async function deleteAnnouncementAction(id: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("announcements")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/announcements");
    revalidatePath("/");
    return { success: true, message: "Announcement removed." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete announcement." };
  }
}

/* =========================================================================
   5. Faculty Actions (Real CRUD)
   ========================================================================= */

export async function createFacultyAction(input: FacultyInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("faculty")
      .insert([
        {
          name: input.name,
          role: input.role,
          subject: input.subject || null,
          lab_type: input.lab_type || null,
          qualification: input.qualification,
          classes_taught: input.classes_taught || [],
          image_url: input.image_url || null,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/faculty");
    revalidatePath("/");
    return { success: true, message: "Faculty member added successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to add faculty member." };
  }
}

export async function updateFacultyAction(id: string, input: FacultyInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("faculty")
      .update({
        name: input.name,
        role: input.role,
        subject: input.subject || null,
        lab_type: input.lab_type || null,
        qualification: input.qualification,
        classes_taught: input.classes_taught || [],
        image_url: input.image_url || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/faculty");
    revalidatePath("/");
    return { success: true, message: "Faculty profile updated successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update faculty profile." };
  }
}

export async function deleteFacultyAction(id: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("faculty")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/faculty");
    revalidatePath("/");
    return { success: true, message: "Faculty profile removed." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete faculty member." };
  }
}

/* =========================================================================
   6. Gallery Actions (Real CRUD)
   ========================================================================= */

export async function createGalleryItemAction(input: GalleryItemInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("gallery")
      .insert([
        {
          title: input.title,
          category: input.category,
          caption: input.caption || null,
          date: input.date || new Date().toISOString().split("T")[0],
          media_type: input.media_type || "image",
          media_url: input.media_url,
          thumbnail_url: input.thumbnail_url || input.media_url,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true, message: "Gallery item added successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to add gallery item." };
  }
}

export async function deleteGalleryItemAction(id: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/gallery");
    revalidatePath("/");
    return { success: true, message: "Gallery item removed." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete gallery item." };
  }
}

/* =========================================================================
   7. Portal Accounts & Password Management
   ========================================================================= */

export async function createPortalAccountAction(input: CreatePortalAccountInput) {
  const auth = await verifyAdminCaller(input.accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  const tempPassword = input.tempPassword || generateTempPassword();
  const email = loginIdToInternalEmail(input.loginId, input.role);

  const { data: newUser, error: createErr } = await supabaseAdmin!.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createErr || !newUser.user) {
    return { success: false, message: createErr?.message || "Failed to create account." };
  }

  const { error: profileErr } = await supabaseAdmin!.from("profiles").insert({
    id: newUser.user.id,
    roll_number: input.loginId,
    full_name: input.fullName,
    father_name: input.fatherName,
    role: input.role,
    discipline: input.discipline,
    class_level: input.classLevel,
    section: input.section,
    category: input.category || "Civilian",
    contact_phone: input.contactPhone,
    must_change_password: true,
  });

  if (profileErr) {
    await supabaseAdmin!.auth.admin.deleteUser(newUser.user.id);
    return { success: false, message: profileErr.message };
  }

  return {
    success: true,
    message: "Account created successfully.",
    data: { loginId: input.loginId, tempPassword, role: input.role, userId: newUser.user.id },
  };
}

export async function adminResetPasswordAction(input: AdminResetPasswordInput) {
  const auth = await verifyAdminCaller(input.accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  const newTempPassword = generateTempPassword();

  const { error: updateAuthErr } = await supabaseAdmin!.auth.admin.updateUserById(input.userId, {
    password: newTempPassword,
  });

  if (updateAuthErr) {
    return { success: false, message: updateAuthErr.message || "Failed to reset password." };
  }

  const { error: updateProfileErr } = await supabaseAdmin!
    .from("profiles")
    .update({ must_change_password: true })
    .eq("id", input.userId);

  if (updateProfileErr) {
    return { success: false, message: updateProfileErr.message || "Failed to update profile status." };
  }

  return {
    success: true,
    message: "Password reset successfully.",
    data: { tempPassword: newTempPassword },
  };
}
