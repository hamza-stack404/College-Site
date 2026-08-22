"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { portalLoginSchema, PortalLoginData } from "@/lib/validations/forms";
import {
  GraduationCap,
  UserCheck,
  Users,
  Lock,
  User,
  ArrowRight,
  ShieldAlert,
  Info,
} from "lucide-react";
import { Button } from "../ui/Button";
import { PortalDemoDashboard } from "./PortalDemoDashboard";

export const PortalLoginForm: React.FC = () => {
  const [role, setRole] = useState<"student" | "faculty" | "parent">("student");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeUser, setActiveUser] = useState<any>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PortalLoginData>({
    resolver: zodResolver(portalLoginSchema),
    defaultValues: {
      role: "student",
      identifier: "BCH-2024-8842",
      password: "password123",
    },
  });

  const handleRoleChange = (newRole: "student" | "faculty" | "parent") => {
    setRole(newRole);
    setValue("role", newRole);
    if (newRole === "student") {
      setValue("identifier", "BCH-2024-8842");
    } else if (newRole === "faculty") {
      setValue("identifier", "FAC-TKHAN-201");
    } else {
      setValue("identifier", "42201-9876543-1");
    }
  };

  const onSubmit = async (data: PortalLoginData) => {
    // Simulate login delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    setActiveUser({
      role: data.role,
      name:
        data.role === "student"
          ? "Zainab Rashid"
          : data.role === "faculty"
          ? "Prof. Dr. Tariq Khan"
          : "Commodore (R) Rashid Minhas",
      identifier: data.identifier,
      department:
        data.role === "student"
          ? "F.Sc Pre-Medical (2nd Year)"
          : data.role === "faculty"
          ? "Dean of Medical Sciences"
          : "Parent of Zainab Rashid",
    });
    setIsLoggedIn(true);
  };

  if (isLoggedIn && activeUser) {
    return (
      <PortalDemoDashboard
        user={activeUser}
        onLogout={() => setIsLoggedIn(false)}
      />
    );
  }

  return (
    <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden p-6 sm:p-10">
      {/* Role Toggle Tabs */}
      <div className="flex rounded-2xl bg-slate-100 dark:bg-slate-800 p-1.5 mb-8">
        <button
          type="button"
          onClick={() => handleRoleChange("student")}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === "student"
              ? "bg-navy-900 text-white dark:bg-medical-600 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Student</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleChange("faculty")}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === "faculty"
              ? "bg-navy-900 text-white dark:bg-medical-600 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Faculty</span>
        </button>

        <button
          type="button"
          onClick={() => handleRoleChange("parent")}
          className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
            role === "parent"
              ? "bg-navy-900 text-white dark:bg-medical-600 shadow-sm"
              : "text-slate-600 dark:text-slate-300 hover:text-slate-900"
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Parent</span>
        </button>
      </div>

      {/* Demo Credentials Info Banner */}
      <div className="mb-6 p-3.5 rounded-xl bg-medical-50 dark:bg-medical-950/60 border border-medical-200 dark:border-medical-900 text-xs text-medical-800 dark:text-medical-300 flex items-start gap-2.5">
        <Info className="w-4 h-4 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Instant Demo Credentials:</span> Click &ldquo;Sign In to Portal&rdquo; below to preview the live interactive dashboard for the selected role.
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register("role")} value={role} />

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wider">
            {role === "student"
              ? "Roll Number / Student ID"
              : role === "faculty"
              ? "Faculty Employee Code"
              : "Registered CNIC Number"}
          </label>
          <div className="relative">
            <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              {...register("identifier")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
            />
          </div>
          {errors.identifier && (
            <span className="text-[11px] text-rose-500 mt-1 block">
              {errors.identifier.message}
            </span>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Password
            </label>
            <a
              href="#"
              onClick={(e) => {
                e.preventDefault();
                alert("Password reset instructions have been dispatched to the registered phone number.");
              }}
              className="text-xs text-medical-600 dark:text-medical-400 hover:underline font-semibold"
            >
              Forgot Password?
            </a>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="password"
              {...register("password")}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:ring-2 focus:ring-medical-500 focus:outline-none"
            />
          </div>
          {errors.password && (
            <span className="text-[11px] text-rose-500 mt-1 block">
              {errors.password.message}
            </span>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            size="lg"
            variant="medical"
            isLoading={isSubmitting}
            className="w-full justify-center gap-2"
          >
            <span>Sign In to {role.charAt(0).toUpperCase() + role.slice(1)} Portal</span>
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </form>

      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-400">
        Secured with 256-Bit SSL Encryption • Bahria IT Directorate
      </div>
    </div>
  );
};
