"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  Building2,
  GraduationCap,
  School,
  CheckCircle2,
  Share2,
  Copy,
  Clock,
  BookOpen,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Exam, InstitutionProfile } from "@/lib/types";

export default function InstitutionPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [institution, setInstitution] = useState<InstitutionProfile | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/institutions/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.institution) setInstitution(data.institution);
        if (data.exams) setExams(data.exams);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLink(id);
    setTimeout(() => setCopiedLink(null), 2000);
  };

  const getInstitutionIcon = (type: string) => {
    switch (type) {
      case "COACHING":
        return <Building2 className="h-6 w-6 text-emerald-600" />;
      case "COLLEGE":
      case "SCHOOL":
        return <School className="h-6 w-6 text-blue-600" />;
      case "VARSITY":
        return <GraduationCap className="h-6 w-6 text-purple-600" />;
      default:
        return <Sparkles className="h-6 w-6 text-amber-600" />;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
        Loading institution portal...
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="container mx-auto p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Institution Portal Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The requested coaching or school portal does not exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  const portalUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <div className="min-h-screen bg-muted/10 pb-16">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white py-12 px-4 sm:px-6">
        <div className="container mx-auto max-w-5xl space-y-4">
          <Link
            href="/portal"
            className="inline-flex items-center gap-1.5 text-xs text-emerald-300 hover:text-white transition-colors"
          >
            ← All Institution Portals
          </Link>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-2xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shadow-lg">
                {getInstitutionIcon(institution.type)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase tracking-wider">
                    {institution.type} PORTAL
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-300 font-semibold">
                    <CheckCircle2 className="h-3 w-3" /> Verified Partner
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black mt-1">{institution.name}</h1>
                {institution.nameBn && (
                  <p className="text-xs text-emerald-200/90 bengali-font font-medium">{institution.nameBn}</p>
                )}
              </div>
            </div>

            {/* Share Portal Button */}
            <button
              onClick={() => copyToClipboard(portalUrl, "portal")}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors"
            >
              {copiedLink === "portal" ? (
                <>
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Link Copied!
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  Share Portal Link
                </>
              )}
            </button>
          </div>

          <p className="text-xs sm:text-sm text-emerald-100/80 max-w-3xl leading-relaxed">
            {institution.description}
          </p>

          <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-emerald-200/80">
            {institution.address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" /> {institution.address}
              </span>
            )}
            {institution.contactPhone && (
              <span className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-emerald-400" /> {institution.contactPhone}
              </span>
            )}
            {institution.contactEmail && (
              <span className="flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5 text-emerald-400" /> {institution.contactEmail}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Area: Published Exams for Students */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-foreground flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-600" />
              Published Exams & Model Tests
            </h2>
            <p className="text-xs text-muted-foreground">
              Select any exam below to take it online or submit your handwritten answer sheet photos.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
            {exams.length} Active Exams
          </span>
        </div>

        {/* Exams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {exams.map((exam) => {
            const examDirectUrl =
              typeof window !== "undefined"
                ? `${window.location.origin}/exam/${exam.accessCode || exam.id}`
                : `/exam/${exam.accessCode || exam.id}`;

            return (
              <div
                key={exam.id}
                className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-400 transition-all space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {exam.curriculumCode}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {exam.durationMinutes} mins
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-foreground">{exam.title}</h3>
                  <p className="text-xs text-muted-foreground">{exam.subject}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-border">
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Total Marks: <strong className="text-foreground">{exam.totalMarks}</strong></span>
                    <span>Negative: <strong className="text-foreground">{exam.negativeMarkingRate || "None"}</strong></span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/exam/${exam.accessCode || exam.id}`}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-1.5 transition-colors"
                    >
                      Take Exam Now <ArrowRight className="h-3.5 w-3.5" />
                    </Link>

                    <button
                      onClick={() => copyToClipboard(examDirectUrl, exam.id)}
                      className="p-2.5 rounded-xl border border-border bg-background hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                      title="Copy Direct Student Exam Link"
                    >
                      {copiedLink === exam.id ? (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Student Join Banner */}
        <div className="p-6 rounded-3xl border border-emerald-200 bg-emerald-50/50 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="font-extrabold text-sm text-emerald-950">
              Are you a student of {institution.name}?
            </h4>
            <p className="text-xs text-emerald-800">
              Bookmark this page to access all weekly model tests, handwritten script evaluations, and report cards.
            </p>
          </div>

          <button
            onClick={() => copyToClipboard(portalUrl, "portal_bottom")}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm shrink-0"
          >
            {copiedLink === "portal_bottom" ? "Link Copied!" : "Bookmark & Copy Portal Link"}
          </button>
        </div>
      </div>
    </div>
  );
}
