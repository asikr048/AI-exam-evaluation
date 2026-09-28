"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@/lib/types";
import {
  GraduationCap,
  Sparkles,
  UserCheck,
  ChevronDown,
  Cpu,
  Layers,
  FileCheck2,
  Settings,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeModel, setActiveModel] = useState("gemini-3.8-flash");
  const [isPersonaMenuOpen, setIsPersonaMenuOpen] = useState(false);

  useEffect(() => {
    fetch("/api/auth/current-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.currentUser) setCurrentUser(data.currentUser);
      })
      .catch(() => {});

    fetch("/api/ai-settings")
      .then((res) => res.json())
      .then((data) => {
        if (data.settings?.defaultModelId) setActiveModel(data.settings.defaultModelId);
      })
      .catch(() => {});
  }, []);

  const switchPersona = async (role: "STUDENT" | "TEACHER" | "ADMIN") => {
    try {
      const res = await fetch("/api/auth/current-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      if (data.currentUser) {
        setCurrentUser(data.currentUser);
        setIsPersonaMenuOpen(false);
        // Refresh page or trigger re-render
        window.location.reload();
      }
    } catch (err) {
      console.error("Failed to switch persona", err);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  Khata<span className="text-emerald-600">AI</span>
                </span>
                <span className="bengali-font rounded-md bg-emerald-50 px-1.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  খাতা AI
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                AI Exam Evaluation Platform
              </p>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                pathname === "/" ? "bg-accent text-emerald-900 font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Overview
            </Link>
            <Link
              href="/teacher"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith("/teacher")
                  ? "bg-accent text-emerald-900 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Teacher Suite
            </Link>
            <Link
              href="/student"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith("/student")
                  ? "bg-accent text-emerald-900 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <FileCheck2 className="h-4 w-4" />
              Student Arena
            </Link>
            <Link
              href="/admin/ai-settings"
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                pathname.startsWith("/admin")
                  ? "bg-accent text-emerald-900 font-semibold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Cpu className="h-4 w-4 text-emerald-600" />
              AI Gateway
            </Link>
          </nav>
        </div>

        {/* Right Section: Active AI Model badge & Persona Switcher */}
        <div className="flex items-center gap-3">
          {/* Active Model Indicator */}
          <Link
            href="/admin/ai-settings"
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-medium hover:bg-emerald-100 transition-colors"
            title="Click to change AI Model in Admin Gateway"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600 animate-pulse" />
            <span>AI:</span>
            <span className="font-semibold">{activeModel}</span>
          </Link>

          {/* Persona Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsPersonaMenuOpen(!isPersonaMenuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-card text-xs font-medium hover:bg-accent/50 transition-colors shadow-sm"
            >
              <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-muted-foreground">Demo Role:</span>
              <span className="font-bold text-foreground">
                {currentUser?.role === "TEACHER"
                  ? "👨‍🏫 Teacher"
                  : currentUser?.role === "ADMIN"
                  ? "⚡ Admin"
                  : "🎓 Student"}
              </span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>

            {isPersonaMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-border bg-card p-2 shadow-xl z-50 text-xs animate-in fade-in slide-in-from-top-1">
                <p className="px-2 py-1.5 font-bold text-muted-foreground uppercase tracking-wider text-[10px]">
                  Switch Demo Account (One-Click)
                </p>
                <button
                  onClick={() => switchPersona("TEACHER")}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                    currentUser?.role === "TEACHER" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:bg-accent"
                  }`}
                >
                  <span className="text-base">👨‍🏫</span>
                  <div>
                    <div className="font-medium text-foreground">Teacher / Coach</div>
                    <div className="text-[10px] text-muted-foreground">Prof. Rafiqul Islam (Udvash)</div>
                  </div>
                </button>
                <button
                  onClick={() => switchPersona("STUDENT")}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                    currentUser?.role === "STUDENT" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:bg-accent"
                  }`}
                >
                  <span className="text-base">🎓</span>
                  <div>
                    <div className="font-medium text-foreground">Student</div>
                    <div className="text-[10px] text-muted-foreground">Tahmid Hasan (Dhaka College)</div>
                  </div>
                </button>
                <button
                  onClick={() => switchPersona("ADMIN")}
                  className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                    currentUser?.role === "ADMIN" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:bg-accent"
                  }`}
                >
                  <span className="text-base">⚡</span>
                  <div>
                    <div className="font-medium text-foreground">Super Admin</div>
                    <div className="text-[10px] text-muted-foreground">AI Gateway & Model Control</div>
                  </div>
                </button>
              </div>
            )}
          </div>

          {/* Quick CTA */}
          <Link
            href="/#demo"
            className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-emerald-700 transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Try Live AI
          </Link>
        </div>
      </div>
    </header>
  );
}
