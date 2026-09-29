"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  Sparkles,
  Play,
  KeyRound,
  Filter,
  GraduationCap,
  History,
  FileText,
} from "lucide-react";
import { Exam } from "@/lib/types";

export default function StudentArenaPage() {
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>("ALL");
  const [privateCode, setPrivateCode] = useState("");

  useEffect(() => {
    fetch("/api/exams")
      .then((r) => r.json())
      .then((data) => {
        if (data.exams) setExams(data.exams);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleEnterPrivateExam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!privateCode.trim()) return;
    router.push(`/exam/${privateCode.trim().toUpperCase()}`);
  };

  const curricula = [
    { id: "ALL", label: "All Public Exams" },
    { id: "HSC", label: "HSC (উচ্চ মাধ্যমিক)" },
    { id: "SSC", label: "SSC (মাধ্যমিক)" },
    { id: "DU_A", label: "DU 'Ka' Admission (ঢাবি)" },
    { id: "BUET", label: "BUET Written (বুয়েট)" },
    { id: "BCS", label: "BCS Exam (বিসিএস)" },
    { id: "IELTS", label: "IELTS Writing" },
  ];

  const filteredExams =
    selectedCurriculum === "ALL"
      ? exams
      : exams.filter((e) => e.curriculumCode === selectedCurriculum);

  return (
    <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            Official Public Examination Arena
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            Take Public Model Tests & Get AI Evaluated
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
            Practice with pre-loaded official HSC, SSC, University Admission (DU, BUET), BCS, and IELTS exams.
            Submit typed responses or snap photos of your handwritten answer scripts for instant, step-by-step AI grading.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              href="/profile"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold text-white transition-colors"
            >
              <History className="h-3.5 w-3.5 text-emerald-400" /> View My Past Exam History
            </Link>
          </div>
        </div>
      </div>

      {/* Quick-Access Private Exam Code Bar */}
      <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-card p-4 sm:p-5 shadow-sm">
        <form onSubmit={handleEnterPrivateExam} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-foreground">
                Have a Private Coaching or School Exam Code?
              </h3>
              <p className="text-[11px] text-muted-foreground">
                Enter the access code provided by your teacher (e.g. <code>BATCH2026</code>) to begin your test.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={privateCode}
              onChange={(e) => setPrivateCode(e.target.value.toUpperCase())}
              placeholder="e.g. HSC2026"
              className="px-3.5 py-2 rounded-xl border border-border bg-background text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 uppercase focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-44"
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Play className="h-3.5 w-3.5 fill-white" />
              Enter Arena
            </button>
          </div>
        </form>
      </div>

      {/* Curriculum Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {curricula.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCurriculum(c.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              selectedCurriculum === c.id
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-card border border-border text-muted-foreground hover:text-foreground hover:bg-accent"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Public Exams Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-extrabold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-emerald-600" />
            Official Platform Exams ({filteredExams.length})
          </h2>
          <span className="text-xs text-muted-foreground">Updated for 2026 Syllabi</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs text-muted-foreground">
            Loading public examination catalog...
          </div>
        ) : filteredExams.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card space-y-2">
            <p className="text-sm font-bold text-foreground">No exams found for this category.</p>
            <p className="text-xs text-muted-foreground">Try selecting "All Public Exams" above.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredExams.map((exam) => (
              <div
                key={exam.id}
                className="p-6 rounded-3xl border border-border bg-card shadow-sm hover:border-emerald-300 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                      {exam.curriculumCode}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 font-medium">
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" /> {exam.durationMinutes} mins
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {exam.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{exam.subject}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-border text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
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

                  <Link
                    href={`/exam/${exam.accessCode || exam.id}`}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
                  >
                    <Play className="h-3.5 w-3.5 fill-white" />
                    <span>Take Exam Now</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
