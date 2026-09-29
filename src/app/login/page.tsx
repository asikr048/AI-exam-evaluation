"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight, Sparkles, User, ShieldCheck, GraduationCap, Building2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailOrId, password }),
      });
      const data = await res.json();

      if (data.success) {
        if (data.user?.role === "ADMIN") {
          router.push("/admin/ai-settings");
        } else if (data.user?.role === "TEACHER") {
          router.push("/profile");
        } else {
          router.push("/student");
        }
        router.refresh();
      } else {
        setError(data.error || "Login failed. Check your credentials.");
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = (type: "student" | "institution" | "admin") => {
    if (type === "student") {
      setEmailOrId("student@dhakacollege.edu.bd");
      setPassword("password123");
    } else if (type === "institution") {
      setEmailOrId("teacher@udvash.com");
      setPassword("password123");
    } else if (type === "admin") {
      setEmailOrId("admin");
      setPassword("admin123");
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="h-12 w-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200 shadow-inner">
            <Lock className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-black text-foreground">Welcome Back to KhataAI</h1>
          <p className="text-xs text-muted-foreground">
            Sign in to access your student exam arena, view past results, or manage your institution portal.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              Email or Admin ID:
            </label>
            <input
              type="text"
              required
              value={emailOrId}
              onChange={(e) => setEmailOrId(e.target.value)}
              placeholder="e.g. student@college.edu or admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
              <Lock className="h-3.5 w-3.5 text-muted-foreground" />
              Password:
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
            {isLoading ? "Signing in..." : "Sign In to KhataAI"}
          </button>
        </form>

        {/* 1-Click Fast Fill Helpers */}
        <div className="pt-3 border-t border-border space-y-2">
          <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider text-center">
            One-Click Demo Fill
          </p>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => handleFillDemo("student")}
              className="py-1.5 px-2 rounded-lg bg-muted hover:bg-accent text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors"
            >
              <GraduationCap className="h-3 w-3 text-emerald-600" /> Student
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("institution")}
              className="py-1.5 px-2 rounded-lg bg-muted hover:bg-accent text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors"
            >
              <Building2 className="h-3 w-3 text-emerald-600" /> Institution
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("admin")}
              className="py-1.5 px-2 rounded-lg bg-muted hover:bg-accent text-[11px] font-semibold text-foreground flex items-center justify-center gap-1 transition-colors"
            >
              <ShieldCheck className="h-3 w-3 text-amber-500" /> Admin
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/signup" className="font-bold text-emerald-600 hover:text-emerald-700">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
}
