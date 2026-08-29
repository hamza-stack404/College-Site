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

/**
 * Server Action: Submit an Online Admission Application
 */
export async function submitAdmissionApplicationAction(input: AdmissionApplicationInput) {
  if (!isSupabaseConfigured) {
    // Graceful fallback for local development without active DB
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

/**
 * Server Action: Publish a new Notice (Admin)
 */
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

export interface CreatePortalAccountInput {
  accessToken: string; // current admin's session access token, from supabase.auth.getSession()
  loginId: string;
  role: PortalUserRole;
  fullName: string;
  fatherName?: string;
  discipline?: "Pre-Medical" | "Pre-Engineering" | "Computer Science";
  classLevel?: string;
  section?: string;
  category?: "Civilian" | "Armed Forces";
  contactPhone?: string;
  tempPassword?: string; // if omitted, generate a random one and return it
}

function generateTempPassword(): string {
  return Math.random().toString(36).slice(-8) + "A1";
}

/**
 * Server Action: Admin creates a student, teacher, or parent account.
 * Authenticates admin caller via caller's accessToken.
 */
export async function createPortalAccountAction(input: CreatePortalAccountInput) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured. Add SUPABASE_SERVICE_ROLE_KEY." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(input.accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "admin") {
    return { success: false, message: "Not authorized. Admin access required." };
  }

  const tempPassword = input.tempPassword || generateTempPassword();
  const email = loginIdToInternalEmail(input.loginId, input.role);

  const { data: newUser, error: createErr } = await supabaseAdmin.auth.admin.createUser({
    email,
    password: tempPassword,
    email_confirm: true,
  });

  if (createErr || !newUser.user) {
    return { success: false, message: createErr?.message || "Failed to create account." };
  }

  const { error: profileErr } = await supabaseAdmin.from("profiles").insert({
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
    // Roll back the auth user if the profile insert failed, so we don't leave an orphaned account
    await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
    return { success: false, message: profileErr.message };
  }

  return {
    success: true,
    message: "Account created successfully.",
    data: { loginId: input.loginId, tempPassword, role: input.role, userId: newUser.user.id },
  };
}

export interface AdminResetPasswordInput {
  accessToken: string;
  userId: string;
}

/**
 * Server Action: Admin resets a user's password to a fresh temp password
 * and sets must_change_password: true on their profile.
 */
export async function adminResetPasswordAction(input: AdminResetPasswordInput) {
  if (!isSupabaseAdminConfigured || !supabaseAdmin) {
    return { success: false, message: "Admin client not configured. Add SUPABASE_SERVICE_ROLE_KEY." };
  }

  const { data: callerData, error: callerErr } = await supabaseAdmin.auth.getUser(input.accessToken);
  if (callerErr || !callerData.user) {
    return { success: false, message: "Not authenticated." };
  }

  const { data: callerProfile } = await supabaseAdmin
    .from("profiles")
    .select("role")
    .eq("id", callerData.user.id)
    .single();

  if (!callerProfile || callerProfile.role !== "admin") {
    return { success: false, message: "Not authorized. Admin access required." };
  }

  const newTempPassword = generateTempPassword();

  const { error: updateAuthErr } = await supabaseAdmin.auth.admin.updateUserById(input.userId, {
    password: newTempPassword,
  });

  if (updateAuthErr) {
    return { success: false, message: updateAuthErr.message || "Failed to reset password." };
  }

  const { error: updateProfileErr } = await supabaseAdmin
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
