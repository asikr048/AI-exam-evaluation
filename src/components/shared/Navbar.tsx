"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { User } from "@/lib/types";
import {
  FileCheck2,
  GraduationCap,
  Building2,
  Sparkles,
  User as UserIcon,
  LogOut,
  ChevronDown,
  ShieldCheck,
  History,
  Menu,
  X,
  CreditCard,
  School,
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const cached = localStorage.getItem("khata_user");
      if (cached) {
        setCurrentUser(JSON.parse(cached));
      }
    } catch {}

    fetch("/api/auth/current-user")
      .then((res) => res.json())
      .then((data) => {
        if (data.currentUser) {
          setCurrentUser(data.currentUser);
          try {
            localStorage.setItem("khata_user", JSON.stringify(data.currentUser));
          } catch {}
        } else {
          setCurrentUser(null);
          try {
            localStorage.removeItem("khata_user");
          } catch {}
        }
      })
      .catch(() => {});
  }, [pathname]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      try {
        localStorage.removeItem("khata_user");
      } catch {}
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setIsUserMenuOpen(false);
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  const navLinks = [
    { label: "Overview", href: "/" },
    { label: "Student Arena", href: "/student", icon: GraduationCap },
    { label: "Institution Portals", href: "/portal", icon: Building2 },
    { label: "Plans & Pricing", href: "/pricing", icon: CreditCard },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 transition-all">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-foreground">
                  Khata<span className="text-emerald-600">AI</span>
                </span>
                <span className="bengali-font rounded-md bg-emerald-50 dark:bg-emerald-950 px-1.5 py-0.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                  খাতা AI
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground font-medium -mt-0.5">
                AI Exam Evaluation Platform
              </p>
            </div>
          </Link>

          {/* Clean Primary Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-1.5 ${
                    isActive
                      ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  }`}
                >
                  {Icon && <Icon className={`h-4 w-4 ${isActive ? "text-emerald-600" : "text-muted-foreground"}`} />}
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Section: Auth & Profile */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            /* User Profile & Account Dropdown */
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2.5 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border border-border bg-card hover:bg-accent/60 transition-all shadow-sm"
              >
                <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                  {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-foreground leading-tight truncate max-w-[130px]">
                    {currentUser.name}
                  </div>
                  <div className="text-[10px] font-semibold text-emerald-600 capitalize">
                    {currentUser.role === "ADMIN"
                      ? "⚡ Admin"
                      : currentUser.role === "TEACHER"
                      ? "🏛️ Institution"
                      : "🎓 Student"}
                  </div>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                  <div className="px-3 py-2.5 border-b border-border mb-1">
                    <p className="text-xs font-bold text-foreground truncate">{currentUser.name}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{currentUser.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {currentUser.role === "ADMIN" ? "Super Admin" : currentUser.role === "TEACHER" ? "Institution / Educator" : "Student Account"}
                    </span>
                  </div>

                  <Link
                    href="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <History className="h-4 w-4 text-emerald-600" />
                    <span>My Profile & Exam History</span>
                  </Link>

                  <Link
                    href="/profile?tab=institutions"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <Building2 className="h-4 w-4 text-emerald-600" />
                    <span>My Institution Portals</span>
                  </Link>

                  <Link
                    href="/portal"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-accent transition-colors"
                  >
                    <School className="h-4 w-4 text-emerald-600" />
                    <span>Browse All Institutions</span>
                  </Link>

                  {currentUser.role === "ADMIN" && (
                    <Link
                      href="/admin/ai-settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      <span>Admin AI Gateway</span>
                    </Link>
                  )}

                  <div className="pt-1 border-t border-border mt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-destructive hover:bg-destructive/10 transition-colors text-left"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Logged Out Actions: Sign In & Sign Up */
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="px-3.5 py-1.5 text-xs font-bold text-foreground hover:text-emerald-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-xs font-bold text-white shadow-md shadow-emerald-600/20 transition-all"
              >
                Create Account
              </Link>
            </div>
          )}

          {/* Quick Live AI Demo CTA */}
          <Link
            href="/#demo"
            className="hidden lg:inline-flex items-center gap-1.5 rounded-xl bg-muted/80 hover:bg-muted border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-all"
          >
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Live Demo
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl border border-border hover:bg-accent text-foreground"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-card p-4 space-y-2 animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-xl text-sm font-semibold ${
                pathname === link.href
                  ? "bg-emerald-50 dark:bg-emerald-950 text-emerald-700"
                  : "text-foreground hover:bg-accent"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {!currentUser && (
            <div className="pt-2 border-t border-border flex gap-2">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl border border-border text-xs font-bold"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 py-2 text-center rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
