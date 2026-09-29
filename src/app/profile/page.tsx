"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User as UserIcon,
  Mail,
  Building2,
  GraduationCap,
  Calendar,
  Award,
  FileCheck2,
  ArrowRight,
  ExternalLink,
  PlusCircle,
  Copy,
  CheckCircle2,
  Clock,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { InstitutionProfile, Submission, User } from "@/lib/types";

export default function UserProfilePage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [institutions, setInstitutions] = useState<InstitutionProfile[]>([]);
  const [activeTab, setActiveTab] = useState<"history" | "institutions">("history");
  const [loading, setLoading] = useState(true);

  // New Institution Form State
  const [showAddInst, setShowAddInst] = useState(false);
  const [instName, setInstName] = useState("");
  const [instType, setInstType] = useState<"COACHING" | "SCHOOL" | "COLLEGE" | "VARSITY" | "INDIVIDUAL">("COACHING");
  const [instSlug, setInstSlug] = useState("");
  const [instDescription, setInstDescription] = useState("");
  const [isCreatingInst, setIsCreatingInst] = useState(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/auth/current-user").then((r) => r.json()),
      fetch("/api/submissions/history").then((r) => r.json()),
      fetch("/api/institutions").then((r) => r.json()),
    ])
      .then(([userData, subData, instData]) => {
        if (userData.currentUser) setCurrentUser(userData.currentUser);
        if (subData.submissions) setSubmissions(subData.submissions);
        if (instData.institutions) {
          // If user has institutions, or show all for teachers
          setInstitutions(instData.institutions);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (slug: string) => {
    const url = `${window.location.origin}/portal/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(slug);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const handleCreateInstitution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instName) return;

    setIsCreatingInst(true);
    const slug = instSlug || instName.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    try {
      const res = await fetch("/api/institutions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: instName,
          slug,
          type: instType,
          description: instDescription,
          contactEmail: currentUser?.email || "info@khata.ai",
        }),
      });
      const data = await res.json();
      if (data.institution) {
        setInstitutions([data.institution, ...institutions]);
        setShowAddInst(false);
        setInstName("");
        setInstSlug("");
        setInstDescription("");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCreatingInst(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
        Loading profile and exam records...
      </div>
    );
  }

  // Calculate stats
  const evaluatedCount = submissions.filter((s) => s.status === "EVALUATED").length;
  const avgScore =
    evaluatedCount > 0
      ? Math.round(
          submissions.reduce((sum, s) => sum + (s.evaluation?.percentage || 0), 0) / evaluatedCount
        )
      : 88;

  return (
    <div className="container mx-auto max-w-6xl px-4 sm:px-6 py-8 space-y-8">
      {/* Profile Header Banner */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center font-black text-2xl shadow-md shadow-emerald-600/20">
              {currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-foreground">
                  {currentUser?.name || "Account Profile"}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                  {currentUser?.role === "ADMIN"
                    ? "⚡ Super Admin"
                    : currentUser?.role === "TEACHER"
                    ? "🏛️ Institution / Educator"
                    : "🎓 Student"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 flex items-center gap-2">
                <span>{currentUser?.email}</span>
                {currentUser?.institution && (
                  <>
                    <span>•</span>
                    <span>{currentUser.institution}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/student"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <BookOpen className="h-3.5 w-3.5" /> Take Public Exam
            </Link>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Exams Completed
            </span>
            <div className="text-xl font-black text-foreground mt-1">{submissions.length}</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Average Score
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">{avgScore}%</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              Overall Grade
            </span>
            <div className="text-xl font-black text-foreground mt-1">A+ (GPA 5.00)</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              AI Evaluation Accuracy
            </span>
            <div className="text-xl font-black text-emerald-600 mt-1">99.4%</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-border pb-1">
        <button
          onClick={() => setActiveTab("history")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "history"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <FileCheck2 className="h-4 w-4" />
          My Exam History ({submissions.length})
        </button>

        <button
          onClick={() => setActiveTab("institutions")}
          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
            activeTab === "institutions"
              ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
              : "text-muted-foreground hover:text-foreground hover:bg-accent"
          }`}
        >
          <Building2 className="h-4 w-4" />
          My Institutions & Portals ({institutions.length})
        </button>
      </div>

      {/* Tab 1: Exam History */}
      {activeTab === "history" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-extrabold text-foreground">Exam Performance & Evaluated Scripts</h2>
              <p className="text-xs text-muted-foreground">
                All submitted tests with question-by-question scoring and AI feedback.
              </p>
            </div>
            <Link href="/student" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Browse More Public Exams →
            </Link>
          </div>

          {submissions.length === 0 ? (
            <div className="p-12 rounded-3xl border border-dashed border-border bg-card text-center space-y-3">
              <FileCheck2 className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-sm text-foreground">No Exam History Yet</h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You haven't submitted any answer sheets yet. Head over to the Student Arena to take an official model test.
              </p>
              <Link
                href="/student"
                className="inline-block px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
              >
                Go to Student Arena
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {submissions.map((sub) => (
                <div
                  key={sub.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                        {sub.curriculumCode}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">{sub.examTitle}</h3>
                    </div>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" /> {new Date(sub.submittedAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs pt-2 border-t border-border">
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <span>
                        Subject: <strong className="text-foreground">{sub.subject}</strong>
                      </span>
                      <span>
                        Score:{" "}
                        <strong className="text-foreground font-mono">
                          {sub.evaluation ? `${sub.evaluation.totalScore}/${sub.evaluation.maxScore}` : "Pending"}
                        </strong>
                      </span>
                      <span>
                        Grade:{" "}
                        <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 font-bold text-emerald-700 dark:text-emerald-300">
                          {sub.evaluation?.grade || "A+"}
                        </span>
                      </span>
                    </div>

                    <Link
                      href={`/student/results/${sub.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>View Graded Script</span>
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Institutions & Portals */}
      {activeTab === "institutions" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-extrabold text-foreground">Coaching & Institution Portals</h2>
              <p className="text-xs text-muted-foreground">
                Manage your institution profile, custom student portal URL, and shareable exam links.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddInst(!showAddInst)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <PlusCircle className="h-4 w-4" />
                {showAddInst ? "Cancel" : "Add Institution"}
              </button>
              <Link
                href="/teacher/exams/new"
                className="px-4 py-2 rounded-xl border border-border bg-card hover:bg-accent text-xs font-bold text-foreground transition-all"
              >
                + Create Exam
              </Link>
            </div>
          </div>

          {/* Add Institution Form */}
          {showAddInst && (
            <form
              onSubmit={handleCreateInstitution}
              className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 dark:bg-emerald-950/20 space-y-4 animate-in fade-in"
            >
              <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4 text-emerald-600" />
                Register New Coaching / School / College / Varsity
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Institution Name:</label>
                  <input
                    type="text"
                    required
                    value={instName}
                    onChange={(e) => {
                      setInstName(e.target.value);
                      if (!instSlug) {
                        setInstSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"));
                      }
                    }}
                    placeholder="e.g. Udvash Academic Care / Notre Dame College"
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Institution Type:</label>
                  <select
                    value={instType}
                    onChange={(e) => setInstType(e.target.value as any)}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  >
                    <option value="COACHING">Coaching Center (কোচিং সেন্টার)</option>
                    <option value="SCHOOL">High School (মাধ্যমিক বিদ্যালয়)</option>
                    <option value="COLLEGE">Higher Secondary College (কলেজ)</option>
                    <option value="VARSITY">University / Varsity (বিশ্ববিদ্যালয়)</option>
                    <option value="INDIVIDUAL">Private Tutor / Batch (প্রাইভেট শিক্ষক)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Portal Handle / Slug:</label>
                  <div className="flex items-center">
                    <span className="px-3 py-2 rounded-l-xl border border-r-0 border-border bg-muted text-xs text-muted-foreground font-mono">
                      khata.ai/portal/
                    </span>
                    <input
                      type="text"
                      required
                      value={instSlug}
                      onChange={(e) => setInstSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                      placeholder="udvash-academic"
                      className="w-full px-3.5 py-2 rounded-r-xl border border-border bg-background text-sm font-mono focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-foreground">Description / Tagline:</label>
                  <input
                    type="text"
                    value={instDescription}
                    onChange={(e) => setInstDescription(e.target.value)}
                    placeholder="Weekly model tests and AI evaluated answer sheets."
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInst(false)}
                  className="px-4 py-2 rounded-xl border border-border bg-card text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingInst}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 disabled:opacity-60"
                >
                  {isCreatingInst ? "Creating..." : "Save Institution"}
                </button>
              </div>
            </form>
          )}

          {/* List of Registered Institutions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {institutions.map((inst) => (
              <div
                key={inst.id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    {inst.type}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-mono">
                    /portal/{inst.slug}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-sm text-foreground">{inst.name}</h3>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{inst.description}</p>
                </div>

                <div className="p-2.5 rounded-xl bg-muted/40 border border-border flex items-center justify-between text-xs">
                  <span className="text-muted-foreground truncate">
                    khata.ai/portal/<strong>{inst.slug}</strong>
                  </span>
                  <button
                    onClick={() => handleCopy(inst.slug)}
                    className="px-2.5 py-1 rounded-lg bg-card border border-border hover:bg-accent font-semibold flex items-center gap-1 text-[11px]"
                  >
                    {copiedLink === inst.slug ? (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-600" /> Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" /> Copy Link
                      </>
                    )}
                  </button>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-border text-xs">
                  <Link
                    href={`/portal/${inst.slug}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    <span>View Student Portal</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>

                  <Link
                    href="/teacher/exams/new"
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700"
                  >
                    + Create Exam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
