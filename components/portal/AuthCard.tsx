"use client";

import React, { useState } from "react";
import { User, Lock, GraduationCap, Users, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { PortalUserRole } from "@/lib/types";
import { COLLEGE_INFO } from "@/lib/data/constants";

interface AuthCardProps {
  activeRole: PortalUserRole;
  onRoleChange: (role: PortalUserRole) => void;
  onLoginSuccess: (userId: string, role: PortalUserRole) => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  activeRole,
  onRoleChange,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<"login" | "create_password" | "forgot_password">("login");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLoginSuccess(loginId || "BCH-2026-0101", activeRole);
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
                onClick={() => {
                  onRoleChange(tab.role);
                  setAuthMode("login");
                }}
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

        {authMode === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                {activeRole === "student" || activeRole === "parent"
                  ? "College Roll ID"
                  : activeRole === "teacher"
                  ? "Teacher ID"
                  : "Admin Username / Email"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  activeRole === "student" || activeRole === "parent"
                    ? "BCH-2026-0101"
                    : activeRole === "teacher"
                    ? "TCH-003"
                    : "admin@bahriahanif.edu.pk"
                }
                value={loginId}
                onChange={(e) => setLoginId(e.target.value)}
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
                  onClick={() => setAuthMode("forgot_password")}
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
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>

            <Button type="submit" variant="primary" size="md" className="w-full justify-center">
              Sign In to Portal
            </Button>

            {(activeRole === "student" || activeRole === "parent") && (
              <div className="pt-2 text-center text-xs text-slate-500">
                First time student?{" "}
                <button
                  type="button"
                  onClick={() => setAuthMode("create_password")}
                  className="font-bold text-medical-600 dark:text-medical-400 hover:underline cursor-pointer"
                >
                  Create Password
                </button>
              </div>
            )}
          </form>
        )}

        {authMode === "create_password" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert("Password configured! You can now log in.");
              setAuthMode("login");
            }}
            className="space-y-4"
          >
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                College ID Card Number
              </label>
              <input
                type="text"
                required
                placeholder="BCH-2026-0101"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Set New Secure Password
              </label>
              <input
                type="password"
                required
                placeholder="Min 6 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-medical-500 focus:outline-none"
              />
            </div>
            <Button type="submit" variant="primary" size="md" className="w-full justify-center">
              Save Password & Continue
            </Button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => setAuthMode("login")}
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
              To reset your credentials, please visit the Student Affairs Office (Window 2) with your physical College ID card, or contact the helpline at <strong>{COLLEGE_INFO.phonePrimary}</strong>.
            </p>
            <Button variant="outline" size="sm" onClick={() => setAuthMode("login")}>
              Back to Sign In
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
