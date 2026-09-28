"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  FileText,
  Sparkles,
  Camera,
  Play,
} from "lucide-react";
import { Exam, Submission } from "@/lib/types";

export default function StudentDashboard() {
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
      {/* Student Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-2">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold inline-flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            Student Examination Arena
          </span>
          <h1 className="text-2xl sm:text-3xl font-black">Welcome, Tahmid Hasan</h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
            Take online exams, submit typed answers or handwritten paper photos, and review fair, step-by-step graded answer sheets with AI rationale.
          </p>
        </div>
      </div>

      {/* Grid: Available Exams to Take & Past Evaluated Scripts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Available Online Exams */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-emerald-600" />
              Available Online Exams
            </h2>
            <span className="text-xs text-muted-foreground">{exams.length} active</span>
          </div>

          <div className="space-y-3">
            {exams.map((exam) => (
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
                    <span>Negative: <strong>{exam.negativeMarkingRate || "None"}</strong></span>
                  </div>
                  <Link
                    href={`/student/exam/${exam.id}`}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-bold text-xs hover:bg-emerald-700 shadow-sm"
                  >
                    <Play className="h-3 w-3 fill-white" />
                    Start Exam
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Evaluated Scripts (Transparent Graded Viewer) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
              <Award className="h-4 w-4 text-emerald-600" />
              My Evaluated Answer Sheets
            </h2>
          </div>

          <div className="space-y-3">
            {submissions.map((sub) => (
              <div
                key={sub.id}
                className="p-5 rounded-2xl border border-border bg-card shadow-sm hover:border-emerald-300 transition-all space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-xs text-foreground">{sub.examTitle}</h4>
                    <p className="text-[11px] text-muted-foreground">
                      Submitted: {new Date(sub.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  {sub.evaluation && (
                    <div className="text-right">
                      <div className="text-sm font-black text-emerald-600">
                        {sub.evaluation.totalScore} / {sub.evaluation.maxScore}
                      </div>
                      <div className="text-[10px] font-bold text-muted-foreground">
                        {sub.evaluation.grade} (GPA {sub.evaluation.gpa.toFixed(1)})
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-2 border-t border-border flex items-center justify-between">
                  <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Step Breakdown Available
                  </span>
                  <Link
                    href={`/student/results/${sub.id}`}
                    className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    View Graded Script <ArrowRight className="h-3 w-3" />
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
