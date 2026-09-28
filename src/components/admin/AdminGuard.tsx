"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldCheck, Lock, User, KeyRound, ArrowLeft, LogOut, CheckCircle2 } from "lucide-react";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/check");
      const data = await res.json();
      setIsAuthenticated(data.authenticated);
    } catch {
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ adminId, password }),
      });
      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
      } else {
        setError(data.error || "Invalid Admin ID or Password");
      }
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleFillDemo = () => {
    setAdminId("admin");
    setPassword("admin123");
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="h-8 w-8 rounded-full border-2 border-emerald-600 border-t-transparent animate-spin" />
        <p className="text-xs font-semibold text-muted-foreground">Verifying admin credentials...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="h-14 w-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200 shadow-inner">
              <Lock className="h-7 w-7" />
            </div>
            <h2 className="text-2xl font-black text-foreground">Admin Protected Area</h2>
            <p className="text-xs text-muted-foreground">
              This section is restricted to platform administrators. Please enter your Admin ID and Password to continue.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl border border-destructive/40 bg-destructive/10 text-destructive text-xs font-semibold">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Admin ID or Email:
              </label>
              <input
                type="text"
                required
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                placeholder="e.g. admin or admin@khata.ai"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <KeyRound className="h-3.5 w-3.5 text-muted-foreground" />
                Admin Password:
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
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isSubmitting ? "Authenticating..." : "Unlock Admin Dashboard"}
            </button>
          </form>

          {/* Quick Demo Fill Helper */}
          <div className="pt-2 border-t border-border text-center space-y-2">
            <button
              onClick={handleFillDemo}
              type="button"
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 py-1.5 px-3 rounded-lg border border-emerald-200 transition-colors"
            >
              Fill Demo Credentials (`admin` / `admin123`)
            </button>
            <div>
              <Link
                href="/"
                className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" /> Back to Main Site
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Active Admin Session Status Banner */}
      <div className="bg-emerald-950 text-emerald-200 text-xs py-2 px-4 border-b border-emerald-800/60 flex items-center justify-between">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="font-semibold text-white">Super Admin Session Active</span>
            <span className="hidden sm:inline text-emerald-300/80 font-mono text-[11px]">(admin@khata.ai)</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white bg-emerald-900/60 hover:bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-700/60 transition-colors"
          >
            <LogOut className="h-3 w-3" /> Sign Out
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
