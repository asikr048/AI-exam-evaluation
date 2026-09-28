"use client";

import { useEffect, useState, use } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  CheckCircle2,
  Award,
  Sparkles,
  HelpCircle,
  AlertCircle,
  FileText,
  Lightbulb,
  MessageSquare,
} from "lucide-react";
import { Submission } from "@/lib/types";

export default function TransparentScriptViewer({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  const { submissionId } = use(params);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/submissions/${submissionId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.submission) setSubmission(data.submission);
      })
      .finally(() => setLoading(false));
  }, [submissionId]);

  if (loading) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Loading evaluated script...
      </div>
    );
  }

  if (!submission || !submission.evaluation) {
    return (
      <div className="container mx-auto p-12 text-center text-xs text-muted-foreground">
        Graded script not available yet.
      </div>
    );
  }

  const { evaluation } = submission;

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-foreground">
                Graded Script & Score Breakdown
              </h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Transparent Evaluation
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              {submission.examTitle} • Student: {submission.studentName}
            </p>
          </div>
        </div>
      </div>

      {/* Hero Score Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-emerald-50/20 to-card border border-emerald-500/20 shadow-xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
              Total Score Obtained
            </span>
            <div className="text-4xl sm:text-5xl font-black text-foreground">
              {evaluation.totalScore}{" "}
              <span className="text-2xl font-bold text-muted-foreground">/ {evaluation.maxScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Percentage: <strong className="text-foreground">{evaluation.percentage}%</strong>
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-xs text-muted-foreground font-semibold">National Grade:</div>
              <div className="text-3xl font-black text-emerald-600">{evaluation.grade}</div>
            </div>
            <div className="h-14 w-14 rounded-2xl bg-emerald-600 text-white flex flex-col items-center justify-center font-extrabold shadow-lg shadow-emerald-600/25">
              <span className="text-[10px] uppercase font-bold opacity-80">GPA</span>
              <span className="text-lg leading-none">{evaluation.gpa.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* AI Confidence & Examiner Info */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Evaluated by: <strong>{evaluation.evaluatedBy}</strong>
          </span>
          <span className="font-semibold text-emerald-700 flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> High Precision Step-Matching
          </span>
        </div>
      </div>

      {/* Teacher Remarks Card (if available) */}
      {evaluation.teacherRemarks && (
        <div className="p-5 rounded-2xl border border-emerald-200 bg-emerald-50/60 shadow-sm space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
            <MessageSquare className="h-4 w-4 text-emerald-600" />
            Teacher's Feedback & Guidance:
          </div>
          <p className="text-xs sm:text-sm text-emerald-950 leading-relaxed bengali-font font-medium">
            "{evaluation.teacherRemarks}"
          </p>
        </div>
      )}

      {/* Evaluated Questions Breakdown */}
      <div className="space-y-6">
        <h2 className="text-lg font-black text-foreground flex items-center gap-2">
          <FileText className="h-5 w-5 text-emerald-600" />
          Transparent Question-by-Question Marking
        </h2>

        {evaluation.questionEvaluations.map((q, idx) => (
          <div
            key={q.questionId}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-extrabold text-xs text-foreground bg-muted px-2.5 py-1 rounded">
                Question #{idx + 1} ({q.questionType})
              </span>
              <div className="text-sm font-extrabold text-emerald-700">
                {q.awardedMarks} / {q.maxMarks} marks
              </div>
            </div>

            {/* CQ Subparts (ক, খ, গ, ঘ) */}
            {q.cqPartEvaluations ? (
              <div className="space-y-4">
                {q.cqPartEvaluations.map((part) => (
                  <div
                    key={part.part}
                    className="p-4 rounded-xl border border-border bg-muted/20 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                        {part.bengaliLabel} - {part.part.toUpperCase()}
                      </span>
                      <span className="font-bold text-xs text-foreground">
                        {part.awardedMarks} / {part.maxMarks} marks
                      </span>
                    </div>

                    {/* Student Extracted Answer */}
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-foreground">What you wrote (আপনার উত্তর):</div>
                      <p className="text-muted-foreground p-2.5 rounded-lg bg-background border border-border bengali-font italic">
                        "{part.extractedStudentText}"
                      </p>
                    </div>

                    {/* AI Explanation & Feedback */}
                    <div className="space-y-1 text-xs">
                      <div className="font-bold text-emerald-800 flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        Why you got this mark (মার্কের কারণ):
                      </div>
                      <p className="text-xs text-foreground leading-relaxed bengali-font">
                        {part.feedback}
                      </p>
                    </div>

                    {/* Rubric Points */}
                    {part.rubricScores && part.rubricScores.length > 0 && (
                      <div className="pt-2 border-t border-border/80">
                        <div className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                          Rubric Evaluation Points:
                        </div>
                        <div className="space-y-1">
                          {part.rubricScores.map((r) => (
                            <div
                              key={r.rubricId}
                              className="flex items-center justify-between text-xs p-1.5 rounded bg-background"
                            >
                              <span className="text-muted-foreground">{r.criterion}</span>
                              <span className="font-bold text-emerald-700">
                                {r.awardedPoints} / {r.maxPoints} ({r.justification})
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-foreground leading-relaxed">{q.feedback}</p>
                {q.improvementTips && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <Lightbulb className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Pro Tip for Next Exam:</strong> {q.improvementTips}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
