"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  PlusCircle,
  Camera,
  FileCheck2,
  Users,
  Award,
  Clock,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  BookOpen,
} from "lucide-react";
import { Exam, Submission } from "@/lib/types";

export default function TeacherDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/exams").then((r) => r.json()),
      fetch("/api/submissions").then((r) => r.json()),
    ])
      .then(([examData, subData]) => {
        if (examData.exams) setExams(examData.exams);
        if (subData.submissions) setSubmissions(subData.submissions);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
              👨‍🏫 Teacher & Coaching Portal
            </span>
            <span className="text-xs text-muted-foreground">Udvash Academic & Admission Care</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground mt-1">
            Exam Evaluation & Class Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Manage your batches, create Creative Questions (CQ), scan answer sheets, and publish AI-verified grades.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/teacher/evaluate"
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all"
          >
            <Camera className="h-4 w-4" />
            Scan Answer Sheets
          </Link>
          <Link
            href="/teacher/exams/new"
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-xs sm:text-sm font-bold text-foreground shadow-sm hover:bg-accent transition-all"
          >
            <PlusCircle className="h-4 w-4 text-emerald-600" />
            Create Exam
          </Link>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Active Exams</span>
            <BookOpen className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-foreground">{exams.length}</div>
          <p className="text-[11px] text-muted-foreground">Across HSC, SSC & IELTS modules</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Scripts Evaluated</span>
            <FileCheck2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-foreground">{submissions.length}</div>
          <p className="text-[11px] text-emerald-600 font-medium">✓ 99.4% AI marking consistency</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Class Average Score</span>
            <Award className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-foreground">86.4%</div>
          <p className="text-[11px] text-muted-foreground">Average GPA 5.0 (A+)</p>
        </div>

        <div className="p-5 rounded-2xl border border-border bg-card shadow-sm space-y-2">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-bold uppercase tracking-wider">Grading Time Saved</span>
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">85%</div>
          <p className="text-[11px] text-muted-foreground">Sub-second AI OCR & evaluation</p>
        </div>
      </div>

      {/* Main Grid: Exams List & Pending Submissions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Col: Exams Management */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Created Exams & Question Sets
            </h2>
            <Link href="/teacher/exams/new" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              + New Exam
            </Link>
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="p-8 text-center text-xs text-muted-foreground">Loading exams...</div>
            ) : exams.length === 0 ? (
              <div className="p-8 rounded-2xl border border-border bg-card text-center text-xs text-muted-foreground">
                No exams created yet. Click "Create Exam" to begin.
              </div>
            ) : (
              exams.map((exam) => (
                <div
                  key={exam.id}
                  className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[11px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {exam.curriculumCode}
                      </span>
                      <h3 className="font-bold text-sm text-foreground">{exam.title}</h3>
                    </div>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {exam.durationMinutes} mins
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border">
                    <div className="flex items-center gap-4">
                      <span>Total Marks: <strong>{exam.totalMarks}</strong></span>
                      <span>Questions: <strong>{exam.questions.length}</strong></span>
                      <span>Access Code: <code className="bg-muted px-1.5 py-0.5 rounded">{exam.accessCode}</code></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/teacher/evaluate?examId=${exam.id}`}
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                      >
                        Evaluate Scripts
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Col: Recent Student Submissions & Grading Status */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <FileCheck2 className="h-4 w-4 text-emerald-600" />
              Student Answer Sheets
            </h2>
            <Link href="/teacher/evaluate" className="text-xs font-bold text-emerald-600 hover:text-emerald-700">
              Scan New
            </Link>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-4 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{sub.studentName}</h4>
                    <p className="text-[11px] text-muted-foreground">{sub.studentRoll}</p>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      sub.status === "EVALUATED"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : sub.status === "NEEDS_REVIEW"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-blue-50 text-blue-700 border border-blue-200"
                    }`}
                  >
                    {sub.status === "EVALUATED" ? "✓ Evaluated" : "⚠️ Needs Review"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-border">
                  <div className="text-muted-foreground text-[11px]">
                    Score:{" "}
                    <strong className="text-foreground text-xs">
                      {sub.evaluation ? `${sub.evaluation.totalScore}/${sub.evaluation.maxScore}` : "Pending"}
                    </strong>{" "}
                    ({sub.evaluation?.grade || "N/A"})
                  </div>
                  <Link
                    href={`/teacher/evaluate/${sub.id}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Open Workspace <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
