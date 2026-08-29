"use client";

import React, { useState } from "react";
import { User, Lock, GraduationCap, Users, Shield, KeyRound, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PortalUserRole } from "@/lib/types";
import { COLLEGE_INFO } from "@/lib/data/constants";
import { supabase, isSupabaseConfigured } from "@/lib/supabase/client";
import { loginIdToInternalEmail } from "@/lib/supabase/auth-helpers";

interface AuthCardProps {
  activeRole: PortalUserRole;
  onRoleChange: (role: PortalUserRole) => void;
  onLoginSuccess: (userId: string, role: PortalUserRole, fullName?: string) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  activeRole,
  onRoleChange,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "create_password" | "forgot_password">("login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [tempPassword, setTempPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [infoMessage, setInfoMessage] = useState<string | null>(null);

  const resetFormState = () => {
    setError(null);
    setInfoMessage(null);
  };

  const handleRoleSelect = (role: PortalUserRole) => {
    onRoleChange(role);
    setAuthMode("login");
    resetFormState();
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Fallback for offline demo mode
        onLoginSuccess(loginId || "BCH-2026-0101", activeRole, "Muhammad Hamza Khan");
        return;
      }

      const internalEmail = loginIdToInternalEmail(loginId, activeRole);
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: password,
      });

      if (authError || !authData.user) {
        setError("Incorrect ID or password. First time logging in? Use Create Password below.");
        return;
      }

      // Fetch profile to verify must_change_password & role
      const { data: profile, error: profileErr } = await supabase
        .from("profiles")
        .select("must_change_password, full_name, role")
        .eq("id", authData.user.id)
        .single();

      if (profileErr) {
        console.warn("Could not retrieve profile:", profileErr.message);
      }

      if (profile?.must_change_password) {
        // Switch user to Create Password mode to set a permanent password
        setAuthMode("create_password");
        setInfoMessage("First-time login detected. Please enter your temporary password to create a permanent password.");
        return;
      }

      onLoginSuccess(loginId, activeRole, profile?.full_name);
    } catch (err: any) {
      setError(err.message || "An unexpected login error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfoMessage(null);
    setIsLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // Fallback
        onLoginSuccess(loginId || "BCH-2026-0101", activeRole, "Muhammad Hamza Khan");
        return;
      }

      const internalEmail = loginIdToInternalEmail(loginId, activeRole);

      // Sign in with the temporary password first
      const { data: signData, error: signErr } = await supabase.auth.signInWithPassword({
        email: internalEmail,
        password: tempPassword,
      });

      if (signErr || !signData.user) {
        setError("Invalid ID or Temporary Password. Please verify the credentials issued by the Admin Office.");
        return;
      }

      // Update password to the new permanent password
      const { error: updateAuthErr } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (updateAuthErr) {
        setError(updateAuthErr.message || "Failed to update password. Ensure it meets security requirements.");
        return;
      }

      // Update profile to mark must_change_password as false
      const { error: updateProfileErr } = await supabase
        .from("profiles")
        .update({ must_change_password: false })
        .eq("id", signData.user.id);

      if (updateProfileErr) {
        console.warn("Profile flag update note:", updateProfileErr.message);
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", signData.user.id)
        .single();

      onLoginSuccess(loginId, activeRole, profile?.full_name);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const roles = [
    { role: "student", label: "Student Login", icon: GraduationCap },
    { role: "parent", label: "Parent Login", icon: Users },
    { role: "teacher", label: "Faculty Login", icon: User },
    { role: "admin", label: "Admin Portal", icon: Shield },
  ] as const;

  return (
    <div className="space-y-6">
      {/* Role Switcher */}
      <div className="flex justify-center">
        <div className="p-1.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-wrap gap-1">
          {roles.map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeRole === tab.role;
            return (
              <button
                key={tab.role}
                onClick={() => handleRoleSelect(tab.role)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                  isSelected
                    ? "bg-navy-950 text-white dark:bg-medical-500 dark:text-navy-950 shadow-md"
                    : "text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
        <div className="text-center space-y-1">
          <Badge variant="medical" size="sm">
            {activeRole === "admin"
              ? "Administrative Access"
              : activeRole === "teacher"
              ? "Faculty Gateway"
              : activeRole === "parent"
              ? "Parent Verification"
              : "Student Identity"}
          </Badge>
          <h3 className="font-display font-bold text-xl sm:text-2xl text-slate-900 dark:text-white mt-2">
            {authMode === "create_password"
              ? "Set College Password"
              : authMode === "forgot_password"
              ? "Reset Credentials"
              : `Sign In as ${activeRole.toUpperCase()}`}
          </h3>
          <p className="text-xs text-slate-500">
            {activeRole === "student"
              ? "Use your College ID (e.g. BCH-2026-0101)"
              : activeRole === "parent"
              ? "Use your ward's Roll ID + Parent Pin"
              : activeRole === "teacher"
              ? "Use Faculty ID (e.g. TCH-003)"
              : "Administrative credentials required"}
          </p>
        </div>

        {/* Inline Alerts */}
        {error && (
          <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{error}</div>
          </div>
        )}

        {infoMessage && (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
            <KeyRound className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="leading-snug">{infoMessage}</div>
          </div>
        )}

        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {activeRole === "student" || activeRole === "parent"
                  ? "College Roll ID"
                  : activeRole === "teacher"
                  ? "Teacher ID"
                  : "Admin Username / ID"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  activeRole === "student" || activeRole === "parent"
                    ? "BCH-2026-0101"
                    : activeRole === "teacher"
                    ? "TCH-003"
                    : "admin-01"
                }
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  resetFormState();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("forgot_password");
                    resetFormState();
                  }}
                  className="text-[11px] font-semibold text-medical-600 dark:text-medical-400 hover:underline cursor-pointer"
                >
                  Forgot?
                </button>
              </div>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  resetFormState();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? "Signing In..." : "Sign In to Portal"}</span>
            </Button>

            {(activeRole === "student" || activeRole === "parent" || activeRole === "teacher") && (
              <div className="pt-2 text-center text-xs text-slate-500">
                First time logging in?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode("create_password");
                    resetFormState();
                  }}
                  className="font-bold text-medical-600 dark:text-medical-400 hover:underline cursor-pointer"
                >
                  Create Password
                </button>
              </div>
            )}
          </form>
        )}

        {authMode === "create_password" && (
          <form onSubmit={handleCreatePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                College ID Card Number / Roll ID
              </label>
              <input
                type="text"
                required
                placeholder="BCH-2026-0101"
                value={loginId}
                onChange={(e) => {
                  setLoginId(e.target.value);
                  resetFormState();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Temporary Password (from Admin Office)
              </label>
              <input
                type="password"
                required
                placeholder="e.g. 8-character temp code"
                value={tempPassword}
                onChange={(e) => {
                  setTempPassword(e.target.value);
                  resetFormState();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Set New Permanent Password
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 6 characters"
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  resetFormState();
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isLoading}
              className="w-full justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>{isLoading ? "Saving Password..." : "Save Password & Continue"}</span>
            </Button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setAuthMode("login");
                  resetFormState();
                }}
                className="text-xs text-slate-500 hover:underline cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </form>
        )}

        {authMode === "forgot_password" && (
          <div className="space-y-4 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              To reset your credentials, please visit the Student Affairs Office (Window 2) with your physical College ID card, or contact the administrative helpline at <strong>{COLLEGE_INFO.phonePrimary}</strong>.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setAuthMode("login");
                resetFormState();
              }}
            >
              Back to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
