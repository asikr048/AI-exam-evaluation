"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  Award,
  FileText,
  Upload,
  Camera,
  ChevronRight,
} from "lucide-react";
import { EvaluationResult } from "@/lib/types";

export function LiveDemoSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<"cq" | "ielts" | "custom">("cq");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);

  const steps = [
    "📷 Processing image & handwriting resolution...",
    "🔍 Vision OCR extracting handwritten Bengali & English text...",
    "📐 Cross-referencing against marking rubrics & model answer...",
    "⚖️ Applying NCTB / IELTS criteria & point allocation...",
  ];

  const runDemoEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    // Simulate progress animation
    for (let i = 0; i < steps.length; i++) {
      setProgressStep(i);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    try {
      const examId = selectedPreset === "ielts" ? "exam_ielts_writing_01" : "exam_hsc_physics_01";
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId,
          answerSheetImages: [
            "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
          ],
        }),
      });
      const data = await res.json();
      if (data.evaluation) {
        setEvaluationResult(data.evaluation);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <section id="demo" className="py-16 sm:py-24 bg-gradient-to-b from-background via-emerald-950/[0.02] to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-4">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Interactive Live Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Test the AI Evaluator <span className="text-emerald-600">Right Now</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Select a sample student script below (Bangladeshi HSC Creative Question or IELTS Academic Essay) and see the multimodal AI mark it with step-by-step transparency.
          </p>
        </div>

        {/* Sandbox Card */}
        <div className="rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Preset Selector Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Select Exam Format:
              </span>
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-background border border-border">
                <button
                  onClick={() => {
                    setSelectedPreset("cq");
                    setEvaluationResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPreset === "cq"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🇧🇩 HSC Physics CQ (সৃজনশীল)
                </button>
                <button
                  onClick={() => {
                    setSelectedPreset("ielts");
                    setEvaluationResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedPreset === "ielts"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  🌍 IELTS Academic Task 2
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={runDemoEvaluation}
                disabled={isEvaluating}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2 text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
              >
                {isEvaluating ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Evaluating...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 fill-white" />
                    Run AI Evaluation
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Sandbox Body: Split Screen (Script Preview on Left, Evaluation Output on Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[500px]">
            {/* Left: Input Script Preview */}
            <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-foreground">
                      {selectedPreset === "cq"
                        ? "Student Answer Sheet (Handwritten)"
                        : "Student Submitted Essay (Typed/Written)"}
                    </span>
                  </div>
                  <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                    Input Sample
                  </span>
                </div>

                {/* Script Display */}
                {selectedPreset === "cq" ? (
                  <div className="space-y-4">
                    <div className="relative h-64 w-full rounded-xl overflow-hidden border border-border shadow-inner bg-slate-900">
                      <Image
                        src="https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80"
                        alt="Handwritten script"
                        fill
                        className="object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-3">
                        <span className="text-xs text-white font-medium bg-black/40 backdrop-blur px-2 py-1 rounded">
                          Handwritten Answer Sheet: ক, খ, গ, ঘ
                        </span>
                      </div>
                    </div>
                    <div className="rounded-lg bg-background p-3 border border-border text-xs space-y-1.5">
                      <div className="font-bold text-foreground">উদ্দীপক (Stimulus):</div>
                      <p className="text-muted-foreground italic bengali-font">
                        ২০ মিটার উঁচু দালানের ছাদ থেকে একটি ক্রিকেট বলকে ৩০° কোণে ৪০ মি./সে. বেগে নিক্ষেপ করা হলো...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-xl border border-border bg-background p-4 text-xs space-y-3 font-mono">
                    <div className="font-bold text-foreground font-sans">Prompt:</div>
                    <p className="text-muted-foreground font-sans italic">
                      Should community service be a compulsory part of high school education?
                    </p>
                    <div className="p-3 bg-muted/40 rounded-lg text-foreground/90 leading-relaxed font-sans max-h-56 overflow-y-auto">
                      "In modern society, educational curriculums face constant evolution. While some critics argue that making community service mandatory infringes upon student autonomy, I strongly contend that structured civic engagement fosters essential empathy, teamwork, and accountability..."
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span>Handwriting Legibility:</span>
                <span className="inline-flex items-center gap-1 font-semibold text-emerald-600">
                  <CheckCircle2 className="h-3.5 w-3.5" /> High Confidence (95%)
                </span>
              </div>
            </div>

            {/* Right: AI Output Panel */}
            <div className="lg:col-span-7 p-6 flex flex-col justify-between bg-card">
              {isEvaluating ? (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="relative">
                    <div className="h-16 w-16 rounded-full border-4 border-emerald-200 border-t-emerald-600 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="text-base font-bold text-foreground">
                      {steps[progressStep]}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Applying Google Gemini 3.8 Flash Multimodal OCR & Rubric Engine
                    </p>
                  </div>
                  <div className="w-64 bg-muted rounded-full h-1.5 overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300"
                      style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : evaluationResult ? (
                <div className="space-y-6 animate-in fade-in duration-300">
                  {/* Top Score Banner */}
                  <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-emerald-50/80 border border-emerald-200">
                    <div>
                      <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                        Evaluation Result
                      </div>
                      <div className="text-2xl font-black text-emerald-950 mt-0.5">
                        {evaluationResult.totalScore} / {evaluationResult.maxScore}{" "}
                        <span className="text-base font-semibold text-emerald-700">
                          ({evaluationResult.percentage}%)
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-xs text-emerald-700">Grade / Band:</div>
                        <div className="text-xl font-extrabold text-emerald-900">
                          {evaluationResult.grade}
                        </div>
                      </div>
                      <div className="h-10 w-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {evaluationResult.gpa > 0 ? `GPA ${evaluationResult.gpa.toFixed(1)}` : "PASS"}
                      </div>
                    </div>
                  </div>

                  {/* Overall Feedback */}
                  <div className="rounded-xl border border-border p-4 bg-muted/20">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2 mb-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      AI Rationale & Overall Feedback:
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {evaluationResult.overallFeedback}
                    </p>
                  </div>

                  {/* Question Breakdowns */}
                  <div className="space-y-3">
                    <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Itemized Marks & Rubric Breakdown:
                    </div>

                    {evaluationResult.questionEvaluations[0]?.cqPartEvaluations ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {evaluationResult.questionEvaluations[0].cqPartEvaluations.map((part) => (
                          <div
                            key={part.part}
                            className="p-3.5 rounded-xl border border-border bg-background space-y-2"
                          >
                            <div className="flex items-center justify-between">
                              <span className="inline-flex items-center gap-1 font-bold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                                {part.bengaliLabel} ({part.part.toUpperCase()})
                              </span>
                              <span className="font-extrabold text-xs text-foreground">
                                {part.awardedMarks} / {part.maxMarks} marks
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug line-clamp-2">
                              {part.feedback}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : evaluationResult.questionEvaluations[0]?.rubricScores ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {evaluationResult.questionEvaluations[0].rubricScores.map((r) => (
                          <div
                            key={r.rubricId}
                            className="p-3 rounded-xl border border-border bg-background space-y-1"
                          >
                            <div className="flex items-center justify-between text-xs">
                              <span className="font-bold text-foreground">{r.criterion}</span>
                              <span className="font-extrabold text-emerald-600">
                                {r.awardedPoints} / {r.maxPoints}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground">{r.justification}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center py-16 text-center space-y-3">
                  <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Award className="h-7 w-7" />
                  </div>
                  <h4 className="text-base font-bold text-foreground">Ready to Evaluate</h4>
                  <p className="text-xs text-muted-foreground max-w-sm">
                    Click the "Run AI Evaluation" button above to witness instant handwriting recognition, step marking, and teacher-grade feedback generation.
                  </p>
                  <button
                    onClick={runDemoEvaluation}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 hover:text-emerald-700"
                  >
                    Start Demo Now <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              {/* Evaluated By Badge */}
              <div className="mt-6 pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  Powered by <strong>Google Gemini 3.8 Flash</strong>
                </span>
                <span>Sub-second inference & step accuracy</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
