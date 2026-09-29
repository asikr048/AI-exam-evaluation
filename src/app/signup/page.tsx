"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  UserPlus,
  Mail,
  Lock,
  User,
  GraduationCap,
  Building2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation checks
    if (!name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase()) {
      setError("Email addresses do not match. Please verify your email.");
      return;
    }

    if (role === "TEACHER" && !institution.trim()) {
      setError("Please provide your institution, coaching, school, or college name.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please ensure both password fields are identical.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          password,
          role,
          institution: institution.trim() || (role === "STUDENT" ? "Dhaka College" : "My Coaching Academy"),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (role === "TEACHER") {
          router.push("/profile?tab=institutions");
        } else {
          router.push("/profile");
        }
        router.refresh();
      } else {
        setError(data.error || "Failed to create account.");
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during signup");
    } finally {
      setIsLoading(false);
    }
  };

  const isEmailMismatch = confirmEmail && email.trim().toLowerCase() !== confirmEmail.trim().toLowerCase();
  const isPasswordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-4 py-8">
      <div className="w-full max-w-xl rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
            <UserPlus className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Create Your KhataAI Account</h1>
          <p className="text-xs text-muted-foreground">
            Join Bangladesh's premier AI examination and grading ecosystem.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Account Role Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-foreground">Choose Account Type:</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole("STUDENT")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "STUDENT"
                  ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20"
                  : "border-border bg-background hover:bg-accent/60"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <GraduationCap className="h-4 w-4 text-emerald-600" />
                Student
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Take public exams, join coaching portals, and view AI graded scripts.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setRole("TEACHER")}
              className={`p-4 rounded-2xl border text-left transition-all ${
                role === "TEACHER"
                  ? "border-emerald-600 bg-emerald-50/80 dark:bg-emerald-950/60 ring-2 ring-emerald-500/20"
                  : "border-border bg-background hover:bg-accent/60"
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-xs text-foreground">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Institution / Educator
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                Add coaching, school, college or varsity, create exams, and share test links.
              </p>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              Full Name:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={role === "STUDENT" ? "e.g. Samiul Islam" : "e.g. Prof. Rafiqul Islam / Principal Kabir"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Email Address & Confirm Email Address */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                Email Address:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                  Confirm Email Address:
                </span>
                {confirmEmail && !isEmailMismatch && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Matches
                  </span>
                )}
              </label>
              <input
                type="email"
                required
                value={confirmEmail}
                onChange={(e) => setConfirmEmail(e.target.value)}
                placeholder="Re-enter email address"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:outline-none ${
                  isEmailMismatch
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:ring-emerald-500"
                }`}
              />
              {isEmailMismatch && (
                <p className="text-[11px] text-destructive">Email addresses do not match</p>
              )}
            </div>
          </div>

          {/* Institution / College / School Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                {role === "STUDENT" ? "College / School / Varsity Name:" : "Institution / Coaching Name (Required):"}
              </span>
              {role === "TEACHER" && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-800">
                  Creates Your Portal
                </span>
              )}
            </label>
            <input
              type="text"
              required={role === "TEACHER"}
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder={
                role === "STUDENT"
                  ? "e.g. Dhaka College / Notre Dame / BUET"
                  : "e.g. Apex Coaching Center / Sunrise Model College / Paragon Academy"
              }
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            {role === "TEACHER" && (
              <p className="text-[11px] text-muted-foreground">
                An institution portal will be created exclusively for you where only you can create exams and batches.
              </p>
            )}
          </div>

          {/* Password & Confirm Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Password:
                </span>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  {showPassword ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                  {showPassword ? "Hide" : "Show"}
                </button>
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                  Confirm Password:
                </span>
                {confirmPassword && !isPasswordMismatch && (
                  <span className="text-[10px] text-emerald-600 font-bold flex items-center gap-0.5">
                    <CheckCircle2 className="h-3 w-3" /> Matches
                  </span>
                )}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-background text-sm focus:ring-2 focus:outline-none ${
                  isPasswordMismatch
                    ? "border-destructive focus:ring-destructive"
                    : "border-border focus:ring-emerald-500"
                }`}
              />
              {isPasswordMismatch && (
                <p className="text-[11px] text-destructive">Passwords do not match</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !!isEmailMismatch || !!isPasswordMismatch}
            className="w-full py-3.5 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? "Creating Account..." : "Create Account & Get Started"}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
