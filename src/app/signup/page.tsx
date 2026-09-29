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
  Sparkles,
} from "lucide-react";
import { UserRole } from "@/lib/types";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("STUDENT");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [institution, setInstitution] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          institution: institution || (role === "STUDENT" ? "Dhaka College" : "My Coaching Academy"),
        }),
      });

      const data = await res.json();

      if (data.success) {
        if (role === "TEACHER") {
          router.push("/profile");
        } else {
          router.push("/student");
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

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
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
          <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold">
            {error}
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
              placeholder={role === "STUDENT" ? "e.g. Tahmid Hasan" : "e.g. Prof. Rafiqul Islam"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

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
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
              {role === "STUDENT" ? "College / School / Varsity Name:" : "Institution / Coaching Name:"}
            </label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder={role === "STUDENT" ? "e.g. Dhaka College" : "e.g. Udvash Academic Care / Sunrise School"}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              Create Password:
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading ? "Creating Account..." : "Create Account & Get Started"}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
