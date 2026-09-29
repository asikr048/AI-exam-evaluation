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
  FileCheck2,
  Camera,
  ZoomIn,
  X,
  PlusCircle,
  Award,
  AlertCircle,
  HelpCircle,
  FileText,
  Calendar,
} from "lucide-react";
import { Exam, InstitutionProfile, Submission, User } from "@/lib/types";

export default function InstitutionPortalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [institution, setInstitution] = useState<InstitutionProfile | null>(null);
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isOwner, setIsOwner] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"exams" | "results">("exams");
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  // Result Inspection Modal State
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [zoomPhoto, setZoomPhoto] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/institutions/${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.institution) setInstitution(data.institution);
        if (data.exams) setExams(data.exams);
        if (data.submissions) setSubmissions(data.submissions);
        if (data.isOwner) setIsOwner(data.isOwner);
        if (data.currentUser) setCurrentUser(data.currentUser);
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
        Loading institution portal & student papers...
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
          href="/portal"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          View All Institutions
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
            <div className="flex items-center gap-2">
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

      {/* Institution Creator & Admin Action Bar */}
      {(isOwner || currentUser?.role === "ADMIN" || currentUser?.role === "TEACHER") && (
        <div className="container mx-auto max-w-5xl px-4 sm:px-6 -mt-5">
          <div className="p-4 rounded-2xl bg-card border border-emerald-300 dark:border-emerald-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                ⚡
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Institution Creator Management</h4>
                <p className="text-[11px] text-muted-foreground">
                  You can publish new exams with custom point-by-point marking rubrics & model answers for this institution.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/teacher/exams/new?institutionSlug=${slug}`}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Create Exam for this Institution
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto max-w-5xl px-4 sm:px-6 pt-8 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-border pb-1">
          <button
            onClick={() => setActiveTab("exams")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "exams"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <BookOpen className="h-4 w-4" />
            Active Exams ({exams.length})
          </button>

          <button
            onClick={() => setActiveTab("results")}
            className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === "results"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            <FileCheck2 className="h-4 w-4" />
            Student Results & Evaluated Papers ({submissions.length})
          </button>
        </div>

        {/* Tab 1: Active Published Exams */}
        {activeTab === "exams" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-emerald-600" />
                  Published Exams & Tests
                </h2>
                <p className="text-xs text-muted-foreground">
                  Take any exam below by typing online or snapping a picture of your handwritten paper for AI evaluation.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-800">
                {exams.length} Active
              </span>
            </div>

            {exams.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-2">
                <p className="text-sm font-bold text-foreground">No exams published yet.</p>
                <p className="text-xs text-muted-foreground">Click "Create Exam for this Institution" above to publish the first test.</p>
              </div>
            ) : (
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
                          <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
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
                          <span>
                            Total Marks: <strong className="text-foreground">{exam.totalMarks}</strong>
                          </span>
                          <span>
                            Negative:{" "}
                            <strong className="text-foreground">
                              {exam.negativeMarkingRate ? `-${exam.negativeMarkingRate}` : "None"}
                            </strong>
                          </span>
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
                            title="Copy Direct Exam Link"
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
            )}
          </div>
        )}

        {/* Tab 2: Student Results & Evaluated Answer Sheets with Photo & Rubric Breakdown */}
        {activeTab === "results" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-black text-foreground flex items-center gap-2">
                <FileCheck2 className="h-5 w-5 text-emerald-600" />
                Student Exam Results & Answer Sheet Photos
              </h2>
              <p className="text-xs text-muted-foreground">
                Inspect evaluated handwritten scripts, view the actual paper photo, and review the exact reasons for marks awarded or deducted.
              </p>
            </div>

            {submissions.length === 0 ? (
              <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-2">
                <FileCheck2 className="h-10 w-10 text-muted-foreground mx-auto" />
                <p className="text-sm font-bold text-foreground">No student scripts submitted yet.</p>
                <p className="text-xs text-muted-foreground">Once students take exams and upload answer sheets, their AI graded scripts will appear here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {submissions.map((sub) => {
                  const hasPhoto = sub.answerSheetImages && sub.answerSheetImages.length > 0;
                  const thumb = hasPhoto ? sub.answerSheetImages[0] : null;

                  return (
                    <div
                      key={sub.id}
                      className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-400 transition-all space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-sm text-foreground">{sub.studentName}</span>
                            <span className="text-xs text-muted-foreground block">{sub.studentRoll}</span>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                            {sub.evaluation?.grade || "A+"}
                          </span>
                        </div>

                        <div>
                          <h4 className="font-bold text-xs text-foreground">{sub.examTitle}</h4>
                          <p className="text-[11px] text-muted-foreground">{sub.subject}</p>
                        </div>

                        {/* Answer Sheet Photo Thumbnail */}
                        {thumb && (
                          <div
                            onClick={() => setSelectedSubmission(sub)}
                            className="relative h-36 rounded-xl overflow-hidden border border-border bg-muted/30 cursor-pointer group"
                          >
                            <img
                              src={thumb}
                              alt="Student Paper Thumbnail"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                              <ZoomIn className="h-4 w-4" /> Inspect Paper Photo
                            </div>
                            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                              📷 Exam Paper Photo Attached
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2 pt-3 border-t border-border">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span>
                            Score: <strong className="text-foreground font-mono">{sub.evaluation ? `${sub.evaluation.totalScore}/${sub.evaluation.maxScore}` : "Pending"}</strong>
                          </span>
                          <span className="text-emerald-600 font-semibold font-mono">
                            {sub.evaluation?.percentage || 88}%
                          </span>
                        </div>

                        <button
                          onClick={() => setSelectedSubmission(sub)}
                          className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                        >
                          <FileText className="h-3.5 w-3.5" />
                          View Paper Photo & Mark Rationale
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Graded Paper & Mark Breakdown Inspection Modal */}
      {selectedSubmission && (
        <div
          onClick={() => setSelectedSubmission(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl max-h-[90vh] bg-card rounded-3xl border border-border shadow-2xl p-6 sm:p-8 space-y-6 overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-600">
                  Evaluated Answer Sheet Inspection
                </span>
                <h3 className="text-lg font-black text-foreground">
                  {selectedSubmission.studentName} • {selectedSubmission.examTitle}
                </h3>
              </div>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="p-2 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Score & Grade Header */}
            <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-muted-foreground uppercase font-bold">Total Score Awarded:</span>
                <div className="text-3xl font-black text-foreground">
                  {selectedSubmission.evaluation?.totalScore} / {selectedSubmission.evaluation?.maxScore}{" "}
                  <span className="text-sm font-bold text-emerald-600">({selectedSubmission.evaluation?.percentage}%)</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-xs text-muted-foreground font-semibold">Grade / GPA:</span>
                <div className="text-2xl font-black text-emerald-600">
                  {selectedSubmission.evaluation?.grade} (GPA {selectedSubmission.evaluation?.gpa.toFixed(1)})
                </div>
              </div>
            </div>

            {/* Exam Paper Photo Showcase */}
            {selectedSubmission.answerSheetImages && selectedSubmission.answerSheetImages.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                    <Camera className="h-4 w-4 text-emerald-600" />
                    Student's Actual Handwritten Answer Sheet Photo:
                  </h4>
                  <span className="text-[11px] text-muted-foreground">Click to view full size</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {selectedSubmission.answerSheetImages.map((img, i) => (
                    <div
                      key={i}
                      onClick={() => setZoomPhoto(img)}
                      className="relative h-72 rounded-2xl overflow-hidden border border-border bg-black/5 cursor-pointer group"
                    >
                      <img
                        src={img}
                        alt={`Answer sheet page ${i + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                        <ZoomIn className="h-4 w-4" /> Zoom In Full Screen
                      </div>
                      <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/70 text-white text-[11px] font-semibold">
                        Page {i + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Point Rationale: Why and How Much Marks Were Awarded */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-600" />
                Why & How Much Marks Were Awarded (ধাপভিত্তিক মার্ক ও কারণ):
              </h4>

              {selectedSubmission.evaluation?.questionEvaluations.map((q, idx) => (
                <div key={q.questionId} className="p-4 rounded-2xl border border-border bg-muted/20 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-foreground">
                      Question #{idx + 1} ({q.questionType})
                    </span>
                    <span className="font-extrabold text-xs text-emerald-700 dark:text-emerald-400">
                      {q.awardedMarks} / {q.maxMarks} marks
                    </span>
                  </div>

                  {q.cqPartEvaluations ? (
                    <div className="space-y-2.5">
                      {q.cqPartEvaluations.map((part) => (
                        <div key={part.part} className="p-3 rounded-xl bg-card border border-border space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-emerald-800 dark:text-emerald-300">
                              {part.bengaliLabel} ({part.part.toUpperCase()})
                            </span>
                            <span className="font-bold text-foreground">
                              {part.awardedMarks} / {part.maxMarks}
                            </span>
                          </div>
                          <p className="text-[11px] text-muted-foreground italic bengali-font">
                            " {part.extractedStudentText} "
                          </p>
                          <div className="p-2 rounded bg-emerald-50/60 dark:bg-emerald-950/40 text-[11px] text-emerald-900 dark:text-emerald-200 bengali-font">
                            <strong>মার্কের কারণ:</strong> {part.feedback}
                          </div>
                          {part.rubricScores?.map((r) => (
                            <div key={r.rubricId} className="flex justify-between text-[11px] text-muted-foreground pt-1 border-t border-border">
                              <span>• {r.criterion}</span>
                              <span className="font-semibold text-foreground">+{r.awardedPoints}/{r.maxPoints} pts ({r.justification})</span>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground bg-card p-3 rounded-xl border border-border leading-relaxed">
                      {q.feedback}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-border">
              <Link
                href={`/student/results/${selectedSubmission.id}`}
                target="_blank"
                className="px-4 py-2 rounded-xl bg-card border border-border hover:bg-accent text-xs font-bold text-foreground flex items-center gap-1.5"
              >
                <span>Open in Separate Page</span>
                <ExternalLink className="h-3.5 w-3.5" />
              </Link>
              <button
                onClick={() => setSelectedSubmission(null)}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Photo Zoom Modal */}
      {zoomPhoto && (
        <div
          onClick={() => setZoomPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setZoomPhoto(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 z-10"
            >
              <X className="h-6 w-6" />
            </button>
            <img src={zoomPhoto} alt="Full resolution answer sheet" className="max-h-[85vh] w-auto object-contain rounded-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}
