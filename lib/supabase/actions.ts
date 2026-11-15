"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "./client";
import { supabaseAdmin, isSupabaseAdminConfigured } from "./admin-client";
import { loginIdToInternalEmail } from "./auth-helpers";
import { PortalUserRole } from "@/lib/types";
import {
  SUBJECT_MARKS,
  EXAM_SUBJECTS,
  ExamType,
  calculateGrade,
} from "@/lib/data/constants";

// Server-side client with persistSession: false
const serverSupabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project-ref.supabase.co",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy",
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
);

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
  contactPhone?: string;
  tempPassword?: string;
  subject?: string;
  isClassTeacher?: boolean;
  classTeacherGroup?: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  classTeacherLevel?: "11th" | "12th";
  classTeacherSection?: string;
  classesTaught?: any[];
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
async function verifyAdminCaller(accessToken: string): Promise<{ authorized: boolean; error?: string; callerId?: string }> {
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

  return { authorized: true, callerId: callerData.user.id };
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
    const { data, error } = await serverSupabase
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
    const { data, error } = await serverSupabase
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

export async function createNoticeAction(notice: NoticeInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
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

export async function lookupStudentAction(loginId: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data: student, error } = await supabaseAdmin!
      .from("profiles")
      .select("id, roll_number, full_name, father_name, discipline, class_level, section")
      .eq("roll_number", loginId.trim())
      .eq("role", "student")
      .maybeSingle();

    if (error) throw error;
    if (!student) {
      return { success: false, message: `No registered student found with ID "${loginId}".` };
    }

    return { success: true, student };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to lookup student." };
  }
}

export async function createPortalAccountAction(input: CreatePortalAccountInput) {
  const auth = await verifyAdminCaller(input.accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  // Parent validation: verify student exists
  if (input.role === "parent") {
    const { data: studentRecord, error: lookupErr } = await supabaseAdmin!
      .from("profiles")
      .select("id, roll_number, full_name, father_name")
      .eq("roll_number", input.loginId.trim())
      .eq("role", "student")
      .maybeSingle();

    if (lookupErr || !studentRecord) {
      return {
        success: false,
        message: `Cannot create parent account: No registered student found with ID "${input.loginId}". Please verify the student's ID first.`,
      };
    }
  }

  // Teacher validation: check duplicate class teacher if isClassTeacher
  if (input.role === "teacher" && input.isClassTeacher) {
    if (!input.classTeacherGroup || !input.classTeacherLevel || !input.classTeacherSection) {
      return {
        success: false,
        message: "Group, class level, and section are required when assigning a class teacher.",
      };
    }

    const { data: existingClassTeacher } = await supabaseAdmin!
      .from("profiles")
      .select("full_name")
      .eq("is_class_teacher", true)
      .eq("class_teacher_group", input.classTeacherGroup)
      .eq("class_teacher_level", input.classTeacherLevel)
      .eq("class_teacher_section", input.classTeacherSection)
      .maybeSingle();

    if (existingClassTeacher) {
      return {
        success: false,
        message: `A class teacher (${existingClassTeacher.full_name}) is already assigned to ${input.classTeacherLevel} ${input.classTeacherGroup} (${input.classTeacherSection}).`,
      };
    }
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
    roll_number: input.loginId.trim(),
    full_name: input.fullName.trim(),
    father_name: input.role === "student" && input.fatherName ? input.fatherName.trim() : null,
    role: input.role,
    discipline: input.role === "student" ? (input.discipline || null) : null,
    class_level: input.role === "student" ? (input.classLevel || null) : null,
    section: input.role === "student" ? (input.section || null) : null,
    contact_phone: input.contactPhone ? input.contactPhone.trim() : null,
    subject: input.role === "teacher" ? (input.subject || null) : null,
    is_class_teacher: input.role === "teacher" ? (input.isClassTeacher || false) : false,
    class_teacher_group: input.role === "teacher" && input.isClassTeacher ? input.classTeacherGroup : null,
    class_teacher_level: input.role === "teacher" && input.isClassTeacher ? input.classTeacherLevel : null,
    class_teacher_section: input.role === "teacher" && input.isClassTeacher ? input.classTeacherSection : null,
    classes_taught: input.classesTaught || [],
    must_change_password: true,
  });

  if (profileErr) {
    await supabaseAdmin!.auth.admin.deleteUser(newUser.user.id);
    if (profileErr.code === "23505" || profileErr.message?.toLowerCase().includes("unique")) {
      return {
        success: false,
        message: "An account with this ID or class teacher section already exists.",
      };
    }
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

export interface DeletePortalAccountInput {
  userId: string;
  accessToken: string;
}

/**
 * Server Action: Admin deletes a user account completely (Auth user + Profile row)
 * Prevents self-deletion.
 */
export async function deletePortalAccountAction(input: DeletePortalAccountInput) {
  const auth = await verifyAdminCaller(input.accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  if (auth.callerId && auth.callerId === input.userId) {
    return {
      success: false,
      message: "Action prohibited: You cannot delete your own administrative account.",
    };
  }

  try {
    // Delete profile row first
    await supabaseAdmin!.from("profiles").delete().eq("id", input.userId);
    // Delete auth user from Supabase Auth
    const { error: deleteErr } = await supabaseAdmin!.auth.admin.deleteUser(input.userId);

    if (deleteErr) {
      console.warn("Auth user deletion warning:", deleteErr.message);
    }

    revalidatePath("/portal");
    return { success: true, message: "Account deleted permanently." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete account." };
  }
}

/* =========================================================================
   8. Timetable Management (Per Section Image)
   ========================================================================= */

export interface TimetableInput {
  discipline: string;
  classLevel: string;
  section: string;
  imageUrl: string;
}

export async function upsertTimetableAction(input: TimetableInput, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("timetables")
      .upsert(
        {
          discipline: input.discipline,
          class_level: input.classLevel,
          section: input.section,
          image_url: input.imageUrl,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "discipline,class_level,section" }
      )
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/portal");
    return { success: true, message: "Section timetable uploaded & updated successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to save timetable." };
  }
}

export async function deleteTimetableAction(id: string, accessToken: string) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { error } = await supabaseAdmin!
      .from("timetables")
      .delete()
      .eq("id", id);

    if (error) throw error;

    revalidatePath("/portal");
    return { success: true, message: "Timetable removed successfully." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete timetable." };
  }
}

export async function getTimetableAction(discipline: string, classLevel: string, section: string) {
  if (!isSupabaseConfigured) return { success: false, data: null };

  try {
    const { data, error } = await serverSupabase
      .from("timetables")
      .select("*")
      .eq("discipline", discipline)
      .eq("class_level", classLevel)
      .eq("section", section)
      .single();

    if (error || !data) {
      return { success: false, data: null };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, data: null };
  }
}

/* =========================================================================
   9. Teacher Assigned Classes Management
   ========================================================================= */

export async function updateTeacherClassesAction(
  teacherId: string,
  classesTaught: any[],
  accessToken: string
) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const { data, error } = await supabaseAdmin!
      .from("profiles")
      .update({ classes_taught: classesTaught })
      .eq("id", teacherId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/portal");
    return { success: true, message: "Teacher class allocations updated.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update classes." };
  }
}

export async function updateTeacherAction(
  input: {
    teacherId: string;
    subject?: string;
    classesTaught?: any[];
  },
  accessToken: string
) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    const updatePayload: Record<string, any> = {};
    if (input.subject !== undefined) updatePayload.subject = input.subject;
    if (input.classesTaught !== undefined) updatePayload.classes_taught = input.classesTaught;

    const { data, error } = await supabaseAdmin!
      .from("profiles")
      .update(updatePayload)
      .eq("id", input.teacherId)
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/portal");
    return { success: true, message: "Teacher information updated successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update teacher." };
  }
}

export async function updateClassTeacherAssignmentAction(
  input: {
    teacherId: string;
    isClassTeacher: boolean;
    group?: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
    classLevel?: "11th" | "12th";
    section?: string;
  },
  accessToken: string
) {
  const auth = await verifyAdminCaller(accessToken);
  if (!auth.authorized) {
    return { success: false, message: auth.error || "Unauthorized" };
  }

  try {
    if (input.isClassTeacher) {
      if (!input.group || !input.classLevel || !input.section) {
        return { success: false, message: "Group, class level, and section are required." };
      }

      // Check if another teacher is already assigned as class teacher for this section
      const { data: existing } = await supabaseAdmin!
        .from("profiles")
        .select("id, full_name")
        .eq("is_class_teacher", true)
        .eq("class_teacher_group", input.group)
        .eq("class_teacher_level", input.classLevel)
        .eq("class_teacher_section", input.section)
        .neq("id", input.teacherId)
        .maybeSingle();

      if (existing) {
        return {
          success: false,
          message: `Class teacher (${existing.full_name}) is already assigned to ${input.classLevel} ${input.group} (${input.section}).`,
        };
      }

      const { error } = await supabaseAdmin!
        .from("profiles")
        .update({
          is_class_teacher: true,
          class_teacher_group: input.group,
          class_teacher_level: input.classLevel,
          class_teacher_section: input.section,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.teacherId);

      if (error) {
        if (error.code === "23505" || error.message?.toLowerCase().includes("unique")) {
          return { success: false, message: "This class section already has an assigned class teacher." };
        }
        return { success: false, message: error.message || "Failed to update class teacher assignment." };
      }

      revalidatePath("/portal");
      return { success: true, message: "Class teacher assignment updated successfully." };
    } else {
      const { error } = await supabaseAdmin!
        .from("profiles")
        .update({
          is_class_teacher: false,
          class_teacher_group: null,
          class_teacher_level: null,
          class_teacher_section: null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", input.teacherId);

      if (error) {
        return { success: false, message: error.message || "Failed to clear class teacher assignment." };
      }

      revalidatePath("/portal");
      return { success: true, message: "Class teacher assignment cleared successfully." };
    }
  } catch (err: any) {
    return { success: false, message: err.message || "An unexpected error occurred." };
  }
}

/* =========================================================================
   10. Examination Marks & Results Management (Single Write Path)
   ========================================================================= */

export async function getClassTeacherRosterAction(
  accessToken: string,
  examType: ExamType
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  const { data: teacherProfile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id, roll_number, full_name, role, is_class_teacher, class_teacher_group, class_teacher_level, class_teacher_section")
    .eq("id", callerData.user.id)
    .single();

  if (profileErr || !teacherProfile) {
    return { success: false, message: "Teacher profile not found." };
  }

  if (teacherProfile.role !== "teacher" && teacherProfile.role !== "admin") {
    return { success: false, message: "Access restricted to faculty members." };
  }

  if (!teacherProfile.is_class_teacher || !teacherProfile.class_teacher_group || !teacherProfile.class_teacher_level || !teacherProfile.class_teacher_section) {
    return { success: false, message: "You are not designated as a Class Teacher for any section." };
  }

  const group = teacherProfile.class_teacher_group;
  const classLevel = teacherProfile.class_teacher_level;
  const section = teacherProfile.class_teacher_section;

  try {
    const { data: students, error: studentsErr } = await supabaseAdmin
      .from("profiles")
      .select("id, roll_number, full_name, father_name, contact_phone, discipline, class_level, section")
      .eq("role", "student")
      .eq("discipline", group)
      .eq("class_level", classLevel)
      .eq("section", section)
      .order("roll_number", { ascending: true });

    if (studentsErr) throw studentsErr;

    const studentIds = (students || []).map((s) => s.id);
    const marksMap: Record<string, any> = {};

    if (studentIds.length > 0) {
      const { data: results, error: resultsErr } = await supabaseAdmin
        .from("internal_exam_results")
        .select("student_id, exam_type, subjects, total_obtained, total_max, percentage")
        .in("student_id", studentIds)
        .eq("exam_type", examType);

      if (!resultsErr && results) {
        for (const r of results) {
          marksMap[r.student_id] = r;
        }
      }
    }

    return {
      success: true,
      classInfo: {
        group,
        classLevel,
        section,
      },
      students: (students || []).map((s) => ({
        id: s.id,
        rollNumber: s.roll_number,
        fullName: s.full_name,
        fatherName: s.father_name,
        contactPhone: s.contact_phone,
        discipline: s.discipline,
        classLevel: s.class_level,
        section: s.section,
        examResult: marksMap[s.id] || null,
      })),
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to load class roster." };
  }
}

export interface StudentSubjectMarksPayload {
  theory?: number | string | null;
  practical?: number | string | null;
}

export interface ClassMarksStudentEntry {
  studentId: string;
  subjects: Record<string, StudentSubjectMarksPayload>;
}

export interface SaveClassMarksInput {
  examType: ExamType;
  entries: ClassMarksStudentEntry[];
}

export async function saveClassMarksAction(
  input: SaveClassMarksInput,
  accessToken: string
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  // Load teacher profile from DB
  const { data: teacherProfile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id, role, is_class_teacher, class_teacher_group, class_teacher_level, class_teacher_section")
    .eq("id", callerData.user.id)
    .single();

  if (profileErr || !teacherProfile) {
    return { success: false, message: "Profile not found." };
  }

  if (teacherProfile.role !== "teacher" && teacherProfile.role !== "admin") {
    return { success: false, message: "Unauthorized. Teacher role required." };
  }

  if (teacherProfile.role === "teacher" && !teacherProfile.is_class_teacher) {
    return { success: false, message: "Only the designated class teacher can enter marks for this section." };
  }

  // Check admin marks entry lock via shared helper
  const marksSetting = await getAppSettingAction("marks_entry_open", true);
  if (marksSetting?.value === false) {
    return {
      success: false,
      message: "Marks entry is currently locked by college administration.",
    };
  }

  // Check if exam type has configured maxima
  if (input.examType === "Assessment") {
    return {
      success: false,
      message: "Maximum marks for Assessment are not configured yet. Marks entry is disabled.",
    };
  }

  const teacherGroup = teacherProfile.class_teacher_group;
  const teacherLevel = teacherProfile.class_teacher_level;
  const teacherSection = teacherProfile.class_teacher_section;

  if (!teacherGroup || !teacherLevel || !teacherSection) {
    return { success: false, message: "Class teacher section is not assigned." };
  }

  // Verify all students belong to teacher's section
  const { data: validStudents, error: studentsErr } = await supabaseAdmin
    .from("profiles")
    .select("id, roll_number, discipline, class_level, section")
    .eq("role", "student")
    .eq("discipline", teacherGroup)
    .eq("class_level", teacherLevel)
    .eq("section", teacherSection);

  if (studentsErr || !validStudents) {
    return { success: false, message: "Failed to verify student roster." };
  }

  const validStudentMap = new Map(validStudents.map((s) => [s.id, s]));

  // Validate every entry
  for (const entry of input.entries) {
    const student = validStudentMap.get(entry.studentId);
    if (!student) {
      return {
        success: false,
        message: `Student ID "${entry.studentId}" does not belong to ${teacherLevel} ${teacherGroup} (${teacherSection}).`,
      };
    }

    const groupDisciplines = student.discipline as "Pre-Medical" | "Pre-Engineering" | "Computer Science";
    const classLevel = (student.class_level || "11th") as "11th" | "12th";
    const allowedSubjects = EXAM_SUBJECTS[groupDisciplines]?.[classLevel] || [];

    for (const [subjectName, markData] of Object.entries(entry.subjects)) {
      if (!allowedSubjects.includes(subjectName)) {
        return {
          success: false,
          message: `Subject "${subjectName}" is not valid for ${classLevel} ${groupDisciplines}.`,
        };
      }

      const subjectConfig = SUBJECT_MARKS[subjectName];
      if (subjectConfig === null) {
        // Locked / unconfigured subject (e.g. THQ)
        continue;
      }

      const rawTheory = markData.theory;
      const rawPractical = markData.practical;

      const isTheoryEmpty = rawTheory === "" || rawTheory === null || rawTheory === undefined;
      const isPracticalEmpty = rawPractical === "" || rawPractical === null || rawPractical === undefined;

      // If completely untouched/blank: skip
      if (isTheoryEmpty && isPracticalEmpty) {
        continue;
      }

      // If practical subject
      if (subjectConfig.practical > 0) {
        if (isTheoryEmpty || isPracticalEmpty) {
          return {
            success: false,
            message: `Incomplete marks for ${subjectName} (${student.roll_number}): both Theory (max ${subjectConfig.theory}) and Practical (max ${subjectConfig.practical}) marks must be entered.`,
          };
        }

        const tVal = Number(rawTheory);
        const pVal = Number(rawPractical);

        if (isNaN(tVal) || tVal < 0 || tVal > subjectConfig.theory) {
          return {
            success: false,
            message: `Invalid Theory marks for ${subjectName} (${student.roll_number}): must be between 0 and ${subjectConfig.theory}.`,
          };
        }
        if (isNaN(pVal) || pVal < 0 || pVal > subjectConfig.practical) {
          return {
            success: false,
            message: `Invalid Practical marks for ${subjectName} (${student.roll_number}): must be between 0 and ${subjectConfig.practical}.`,
          };
        }
      } else {
        // Theory only subject
        if (isTheoryEmpty) {
          continue;
        }

        const tVal = Number(rawTheory);
        if (isNaN(tVal) || tVal < 0 || tVal > subjectConfig.theory) {
          return {
            success: false,
            message: `Invalid Theory marks for ${subjectName} (${student.roll_number}): must be between 0 and ${subjectConfig.theory}.`,
          };
        }
      }
    }
  }

  // Save to database
  try {
    for (const entry of input.entries) {
      const student = validStudentMap.get(entry.studentId)!;
      const groupDisciplines = student.discipline as "Pre-Medical" | "Pre-Engineering" | "Computer Science";
      const classLevel = (student.class_level || "11th") as "11th" | "12th";
      const allowedSubjects = EXAM_SUBJECTS[groupDisciplines]?.[classLevel] || [];

      // Fetch existing row for student and exam
      const { data: existingRow } = await supabaseAdmin
        .from("internal_exam_results")
        .select("*")
        .eq("student_id", entry.studentId)
        .eq("exam_type", input.examType)
        .maybeSingle();

      let existingSubjects: any[] = [];
      if (existingRow && Array.isArray(existingRow.subjects)) {
        existingSubjects = [...existingRow.subjects];
      }

      // Build updated subjects list
      for (const [subjectName, markData] of Object.entries(entry.subjects)) {
        if (!allowedSubjects.includes(subjectName)) continue;
        const subjectConfig = SUBJECT_MARKS[subjectName];
        if (!subjectConfig) continue; // THQ or null

        const rawTheory = markData.theory;
        const rawPractical = markData.practical;

        const isTheoryEmpty = rawTheory === "" || rawTheory === null || rawTheory === undefined;
        const isPracticalEmpty = rawPractical === "" || rawPractical === null || rawPractical === undefined;

        // Skip completely blank inputs - NEVER turn into 0
        if (isTheoryEmpty && isPracticalEmpty) {
          continue;
        }

        let theoryNum: number | null = null;
        let practicalNum: number | null = null;
        const totalMarks = subjectConfig.theory + subjectConfig.practical;
        let obtainedMarks = 0;

        if (subjectConfig.practical > 0) {
          if (!isTheoryEmpty && !isPracticalEmpty) {
            theoryNum = Number(rawTheory);
            practicalNum = Number(rawPractical);
            obtainedMarks = theoryNum + practicalNum;
          } else {
            continue; // incomplete, do not save
          }
        } else {
          if (!isTheoryEmpty) {
            theoryNum = Number(rawTheory);
            practicalNum = 0;
            obtainedMarks = theoryNum;
          } else {
            continue;
          }
        }

        const grade = calculateGrade(obtainedMarks, totalMarks);

        const subObj = {
          name: subjectName,
          theory: theoryNum,
          practical: practicalNum,
          obtainedMarks,
          totalMarks,
          grade,
        };

        const existingIdx = existingSubjects.findIndex(
          (s) => s.name?.toLowerCase() === subjectName.toLowerCase()
        );
        if (existingIdx >= 0) {
          existingSubjects[existingIdx] = subObj;
        } else {
          existingSubjects.push(subObj);
        }
      }

      // Recompute totalObtained and totalMax ONLY from entered subjects that have configured maxima
      const validCompletedSubjects = existingSubjects.filter((s) => {
        const cfg = SUBJECT_MARKS[s.name];
        return cfg !== null && typeof s.obtainedMarks === "number" && !isNaN(s.obtainedMarks);
      });

      const totalObtained = validCompletedSubjects.reduce((sum, s) => sum + Number(s.obtainedMarks || 0), 0);
      const totalMax = validCompletedSubjects.reduce((sum, s) => sum + Number(s.totalMarks || 0), 0);
      const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

      await supabaseAdmin
        .from("internal_exam_results")
        .upsert(
          {
            student_id: entry.studentId,
            exam_type: input.examType,
            exam_name: `${input.examType} Examination`,
            exam_date: new Date().toISOString().split("T")[0],
            subjects: existingSubjects,
            total_obtained: totalObtained,
            total_max: totalMax,
            percentage,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,exam_type" }
        );
    }

    revalidatePath("/portal");
    return { success: true, message: "Marks saved and published successfully." };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to save marks." };
  }
}

export async function getTeacherSectionMarksAction(
  group: string,
  classLevel: string,
  section: string,
  examType: ExamType,
  accessToken: string
) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  const { data: teacherProfile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id, role, classes_taught, is_class_teacher, class_teacher_group, class_teacher_level, class_teacher_section")
    .eq("id", callerData.user.id)
    .single();

  if (profileErr || !teacherProfile) {
    return { success: false, message: "Profile not found." };
  }

  if (teacherProfile.role !== "teacher" && teacherProfile.role !== "admin") {
    return { success: false, message: "Unauthorized." };
  }

  if (teacherProfile.role === "teacher") {
    const isAssigned =
      (Array.isArray(teacherProfile.classes_taught) &&
        teacherProfile.classes_taught.some(
          (c: any) => c.group === group && c.classLevel === classLevel && c.section === section
        )) ||
      (teacherProfile.is_class_teacher &&
        teacherProfile.class_teacher_group === group &&
        teacherProfile.class_teacher_level === classLevel &&
        teacherProfile.class_teacher_section === section);

    if (!isAssigned) {
      return { success: false, message: "You are not assigned to this section." };
    }
  }

  try {
    const { data: students, error: studentsErr } = await supabaseAdmin
      .from("profiles")
      .select("id, roll_number, full_name, father_name, contact_phone, discipline, class_level, section")
      .eq("role", "student")
      .eq("discipline", group)
      .eq("class_level", classLevel)
      .eq("section", section)
      .order("roll_number", { ascending: true });

    if (studentsErr) throw studentsErr;

    const studentIds = (students || []).map((s) => s.id);
    const marksMap: Record<string, any> = {};

    if (studentIds.length > 0) {
      const { data: results } = await supabaseAdmin
        .from("internal_exam_results")
        .select("student_id, exam_type, subjects, total_obtained, total_max, percentage")
        .in("student_id", studentIds)
        .eq("exam_type", examType);

      if (results) {
        for (const r of results) {
          marksMap[r.student_id] = r;
        }
      }
    }

    return {
      success: true,
      students: (students || []).map((s) => ({
        id: s.id,
        rollNumber: s.roll_number,
        fullName: s.full_name,
        fatherName: s.father_name,
        contactPhone: s.contact_phone,
        discipline: s.discipline,
        classLevel: s.class_level,
        section: s.section,
        examResult: marksMap[s.id] || null,
      })),
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to load section marks." };
  }
}

export async function getParentChildDataAction(accessToken: string) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  const { data: parentProfile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("id, roll_number, full_name, role")
    .eq("id", callerData.user.id)
    .single();

  if (profileErr || !parentProfile || parentProfile.role !== "parent") {
    return { success: false, message: "Parent profile not found." };
  }

  if (!parentProfile.roll_number) {
    return { success: false, message: "No child roll number associated with this parent account." };
  }

  try {
    const { data: child, error: childErr } = await supabaseAdmin
      .from("profiles")
      .select("id, roll_number, full_name, father_name, discipline, class_level, section")
      .eq("roll_number", parentProfile.roll_number.trim())
      .eq("role", "student")
      .maybeSingle();

    if (childErr || !child) {
      return { success: false, message: "Child student profile not found." };
    }

    let classTeacherName = "Not assigned yet";
    if (child.discipline && child.class_level && child.section) {
      const { data: teacher } = await supabaseAdmin
        .from("profiles")
        .select("full_name")
        .eq("role", "teacher")
        .eq("is_class_teacher", true)
        .eq("class_teacher_group", child.discipline)
        .eq("class_teacher_level", child.class_level)
        .eq("class_teacher_section", child.section)
        .maybeSingle();

      if (teacher && teacher.full_name) {
        classTeacherName = teacher.full_name;
      }
    }

    return {
      success: true,
      child: {
        id: child.id,
        rollNumber: child.roll_number,
        fullName: child.full_name,
        fatherName: child.father_name,
        discipline: child.discipline,
        classLevel: child.class_level,
        section: child.section,
      },
      classTeacherName,
    };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to load child data." };
  }
}

export async function getStudentExamResultsAction(studentId: string, examType?: string) {
  if (!isSupabaseConfigured) return { success: false, data: [] };

  try {
    let query = serverSupabase
      .from("internal_exam_results")
      .select("*")
      .eq("student_id", studentId);

    if (examType) {
      query = query.eq("exam_type", examType);
    }

    const { data, error } = await query;
    if (error) throw error;

    return { success: true, data: data || [] };
  } catch (err: any) {
    return { success: false, data: [] };
  }
}


