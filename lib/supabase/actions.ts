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
  subject?: string;
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
      .select("id, roll_number, full_name, father_name, discipline, class_level, section, category")
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
    father_name: input.fatherName ? input.fatherName.trim() : null,
    role: input.role,
    discipline: input.discipline || null,
    class_level: input.classLevel || null,
    section: input.section || null,
    category: input.category || "Civilian",
    contact_phone: input.contactPhone || null,
    subject: input.subject || null,
    classes_taught: input.classesTaught || [],
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
    const { data, error } = await supabase
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

/* =========================================================================
   10. Examination Marks & Results Management (Assessment vs Send-up)
   ========================================================================= */

export interface SubjectMarksEntry {
  studentId: string;
  obtainedMarks: number;
  totalMarks?: number;
}

export interface SaveMarksInput {
  examType: "Assessment" | "Send-up" | "Pre-Board";
  subject: string;
  entries: SubjectMarksEntry[];
}

/**
 * Teacher marks entry server action:
 * - Locks entry to teacher's assigned subject
 * - Enforces marks_entry_open check from app_settings
 * - Updates or appends subject marks in internal_exam_results without clobbering other subjects
 */
export async function saveMarksAction(input: SaveMarksInput, accessToken: string) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  // Verify caller profile
  const { data: teacherProfile, error: profileErr } = await supabaseAdmin
    .from("profiles")
    .select("role, subject, full_name")
    .eq("id", callerData.user.id)
    .single();

  if (profileErr || !teacherProfile) {
    return { success: false, message: "Teacher profile not found." };
  }

  if (teacherProfile.role !== "teacher" && teacherProfile.role !== "admin") {
    return { success: false, message: "Only teachers or administrators can enter marks." };
  }

  // If teacher, enforce matching subject
  if (teacherProfile.role === "teacher" && teacherProfile.subject) {
    if (teacherProfile.subject.trim().toLowerCase() !== input.subject.trim().toLowerCase()) {
      return {
        success: false,
        message: `You are authorized to enter marks for "${teacherProfile.subject}" only.`,
      };
    }
  }

  // Check app_settings for marks_entry_open
  const { data: settingsData } = await supabaseAdmin
    .from("app_settings")
    .select("setting_value")
    .eq("setting_key", "marks_entry_open")
    .maybeSingle();

  if (settingsData && settingsData.setting_value === false) {
    return {
      success: false,
      message: "Marks entry is currently closed by the college administration.",
    };
  }

  try {
    const defaultTotal = input.examType === "Assessment" ? 50 : 100;

    for (const entry of input.entries) {
      if (!entry.studentId) continue;

      const marksVal = Number(entry.obtainedMarks);
      if (isNaN(marksVal) || marksVal < 0) continue;

      const totalMarks = entry.totalMarks || defaultTotal;

      // Fetch existing exam result for this student and exam_type
      const { data: existingRow } = await supabaseAdmin
        .from("internal_exam_results")
        .select("*")
        .eq("student_id", entry.studentId)
        .eq("exam_type", input.examType)
        .maybeSingle();

      let subjectsList: any[] = [];
      if (existingRow && Array.isArray(existingRow.subjects)) {
        subjectsList = [...existingRow.subjects];
      }

      // Find or replace the subject entry
      const existingSubIndex = subjectsList.findIndex(
        (s) => s.name?.toLowerCase() === input.subject.toLowerCase()
      );

      const ratio = totalMarks > 0 ? marksVal / totalMarks : 0;
      const grade =
        ratio >= 0.8 ? "A+" : ratio >= 0.7 ? "A" : ratio >= 0.6 ? "B" : ratio >= 0.5 ? "C" : "F";

      const subjectData = {
        name: input.subject,
        totalMarks,
        obtainedMarks: marksVal,
        grade,
      };

      if (existingSubIndex >= 0) {
        subjectsList[existingSubIndex] = subjectData;
      } else {
        subjectsList.push(subjectData);
      }

      // Recompute totals
      const totalObtained = subjectsList.reduce((sum, s) => sum + Number(s.obtainedMarks || 0), 0);
      const totalMax = subjectsList.reduce((sum, s) => sum + Number(s.totalMarks || defaultTotal), 0);
      const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

      await supabaseAdmin
        .from("internal_exam_results")
        .upsert(
          {
            student_id: entry.studentId,
            exam_type: input.examType,
            exam_name: input.examType === "Assessment" ? "Monthly Assessment" : `${input.examType} Exam`,
            exam_date: new Date().toISOString().split("T")[0],
            subjects: subjectsList,
            total_obtained: totalObtained,
            total_max: totalMax,
            percentage,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "student_id,exam_type" }
        );
    }

    revalidatePath("/portal");
    return { success: true, message: `Marks for ${input.subject} saved successfully.` };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to save marks." };
  }
}

export interface SubmitMarksInput {
  studentId: string;
  examType: "Assessment" | "Send-up" | "Pre-Board";
  examName: string;
  examDate: string;
  subjects: {
    name: string;
    totalMarks: number;
    obtainedMarks: number;
    grade?: string;
  }[];
}

export async function submitStudentMarksAction(input: SubmitMarksInput, accessToken: string) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  // Calculate totals
  const totalObtained = input.subjects.reduce((sum, s) => sum + Number(s.obtainedMarks || 0), 0);
  const totalMax = input.subjects.reduce((sum, s) => sum + Number(s.totalMarks || 100), 0);
  const percentage = totalMax > 0 ? Number(((totalObtained / totalMax) * 100).toFixed(2)) : 0;

  try {
    const { data, error } = await supabaseAdmin
      .from("internal_exam_results")
      .upsert(
        {
          student_id: input.studentId,
          exam_type: input.examType,
          exam_name: input.examName,
          exam_date: input.examDate,
          subjects: input.subjects,
          total_obtained: totalObtained,
          total_max: totalMax,
          percentage,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "student_id,exam_type" }
      )
      .select()
      .single();

    if (error) throw error;

    revalidatePath("/portal");
    return { success: true, message: "Examination marks submitted successfully.", data };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to save exam marks." };
  }
}

export async function getStudentExamResultsAction(studentId: string, examType?: string) {
  if (!isSupabaseConfigured) return { success: false, data: [] };

  try {
    let query = supabase
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


