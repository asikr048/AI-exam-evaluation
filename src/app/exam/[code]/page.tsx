"use client";

import { useEffect, useState, use, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Clock,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Send,
  User,
  Phone,
  FileCheck2,
  BookOpen,
  Lock,
} from "lucide-react";
import { Exam, SubmissionAnswer } from "@/lib/types";

export default function DirectExamArenaPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = use(params);
  const router = useRouter();

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [studentName, setStudentName] = useState("");
  const [studentRoll, setStudentRoll] = useState("");
  const [hasPrivateAccess, setHasPrivateAccess] = useState(true);
  const [enteredKey, setEnteredKey] = useState("");
  const [keyError, setKeyError] = useState("");
  const [isStarted, setIsStarted] = useState(false);
  const [timeLeftSeconds, setTimeLeftSeconds] = useState(5400);
  const [answers, setAnswers] = useState<Record<string, SubmissionAnswer>>({});
  const [uploadedPhotos, setUploadedPhotos] = useState<string[]>([
    "https://images.unsplash.com/photo-1544717305-2782549b5136?w=1000&auto=format&fit=crop&q=80",
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/exams/by-code/${code}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.exam) {
          setExam(data.exam);
          setTimeLeftSeconds(data.exam.durationMinutes * 60);

          if (data.exam.isPrivate) {
            if (typeof window !== "undefined") {
              const urlParams = new URLSearchParams(window.location.search);
              const key = urlParams.get("privateKey") || urlParams.get("key");
              if (
                key &&
                key.trim().toLowerCase() === data.exam.privateAccessToken?.toLowerCase()
              ) {
                setHasPrivateAccess(true);
              } else {
                setHasPrivateAccess(false);
              }
            }
          }
        }
      })
      .finally(() => setLoading(false));
  }, [code]);

  // Timer countdown
  useEffect(() => {
    if (!isStarted) return;
    const timer = setInterval(() => {
      setTimeLeftSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [isStarted]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setUploadedPhotos([event.target.result as string, ...uploadedPhotos]);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSelectMCQ = (questionId: string, optionId: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        selectedOptionId: optionId,
      },
    });
  };

  const handleTypeAnswer = (questionId: string, text: string) => {
    setAnswers({
      ...answers,
      [questionId]: {
        questionId,
        typedAnswer: text,
      },
    });
  };

  const handleSubmitExam = async () => {
    if (!exam) return;
    if (!studentName.trim()) {
      alert("Please enter your name before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const subRes = await fetch("/api/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          examId: exam.id,
          answers,
          answerSheetImages: uploadedPhotos,
          studentName,
          studentRoll,
          batchId: exam.batchId,
          batchName: exam.batchName,
          institutionSlug: exam.institutionSlug,
        }),
      });
      const subData = await subRes.json();

      if (subData.submission) {
        // Trigger AI evaluation
        await fetch("/api/evaluate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            submissionId: subData.submission.id,
          }),
        });

        router.push(`/student/results/${subData.submission.id}`);
      }
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-16 text-center text-xs text-muted-foreground">
        Loading exam session...
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="container mx-auto p-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-foreground">Exam Link Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The exam link or code "{code}" is invalid or expired.
        </p>
        <Link href="/" className="px-4 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold inline-block">
          Go to KhataAI Home
        </Link>
      </div>
    );
  }

  // Private Exam Security Key Gate
  if (exam.isPrivate && !hasPrivateAccess) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6 text-center">
          <div className="h-16 w-16 rounded-2xl bg-amber-500/10 text-amber-600 border border-amber-500/20 mx-auto flex items-center justify-center">
            <Lock className="h-8 w-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-black text-foreground">Private Batch Exam</h2>
            <p className="text-xs text-muted-foreground">
              "{exam.title}" is private. Please enter the private access key provided by your institution or batch teacher.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (enteredKey.trim().toLowerCase() === exam.privateAccessToken?.toLowerCase()) {
                setHasPrivateAccess(true);
                setKeyError("");
              } else {
                setKeyError("Invalid access key. Please verify with your institution.");
              }
            }}
            className="space-y-4 text-left"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">Private Access Key:</label>
              <input
                type="text"
                value={enteredKey}
                onChange={(e) => setEnteredKey(e.target.value)}
                placeholder="e.g. PVT_A1B2C3"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm font-mono text-center font-bold tracking-wider focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              {keyError && <p className="text-xs text-destructive font-semibold">{keyError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all"
            >
              Unlock Private Exam →
            </button>
          </form>

          <Link href="/" className="text-xs text-muted-foreground hover:underline inline-block">
            ← Back to KhataAI Home
          </Link>
        </div>
      </div>
    );
  }

  // Pre-Exam Student Details Modal / Screen
  if (!isStarted) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold inline-flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              {exam.curriculumCode} Official Model Test
            </span>
            <h1 className="text-2xl font-black text-foreground mt-2">{exam.title}</h1>
            <p className="text-xs text-muted-foreground">{exam.subject} • {exam.durationMinutes} Minutes</p>
          </div>

          <div className="p-4 rounded-2xl bg-muted/30 border border-border text-xs space-y-1.5 text-muted-foreground">
            <div className="flex justify-between">
              <span>Total Marks:</span>
              <strong className="text-foreground">{exam.totalMarks}</strong>
            </div>
            <div className="flex justify-between">
              <span>Negative Marking:</span>
              <strong className="text-foreground">{exam.negativeMarkingRate ? `-${exam.negativeMarkingRate}` : "None"}</strong>
            </div>
            <div className="flex justify-between">
              <span>Submission Format:</span>
              <strong className="text-foreground">Online Typed + Camera Photo</strong>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                Your Full Name (শিক্ষার্থীর নাম):
              </label>
              <input
                type="text"
                required
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="e.g. Tahmid Hasan / সাদিয়া ইসলাম"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                Roll / Student ID / Phone:
              </label>
              <input
                type="text"
                value={studentRoll}
                onChange={(e) => setStudentRoll(e.target.value)}
                placeholder="e.g. Roll: 1042 / 017XXXXXXXX"
                className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => {
                if (!studentName.trim()) {
                  alert("Please enter your name to start the exam.");
                  return;
                }
                setIsStarted(true);
              }}
              className="w-full py-3 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              Start Exam Now (পরীক্ষা শুরু করুন)
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-16">
      {/* Sticky Header with Timer */}
      <div className="sticky top-16 z-40 w-full border-b border-border bg-card/95 backdrop-blur px-6 py-3 shadow-sm">
        <div className="container mx-auto max-w-5xl flex items-center justify-between">
          <div>
            <h2 className="text-sm font-extrabold text-foreground">{exam.title}</h2>
            <span className="text-[11px] text-muted-foreground">
              Candidate: <strong>{studentName}</strong> ({studentRoll || "Direct Candidate"})
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-inner">
              <Clock className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>Time Left: {formatTimer(timeLeftSeconds)}</span>
            </div>

            <button
              onClick={handleSubmitExam}
              disabled={isSubmitting}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-colors disabled:opacity-60"
            >
              {isSubmitting ? (
                <>
                  <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Evaluating with AI...
                </>
              ) : (
                <>
                  <Send className="h-3.5 w-3.5" />
                  Submit Exam
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Hidden file inputs */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleImageUpload}
        className="hidden"
      />
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {/* Exam Content */}
      <div className="container mx-auto max-w-4xl px-4 sm:px-6 pt-8 space-y-6">
        {/* Photo Upload Notice */}
        <div className="p-4 rounded-2xl border border-emerald-200 bg-emerald-50 text-xs text-emerald-900 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Camera className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>
              Writing on paper? Snap photos of your paper answer sheet using your phone camera.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => cameraInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white font-bold text-xs flex items-center gap-1 shadow-sm hover:bg-emerald-700"
            >
              <Camera className="h-3.5 w-3.5" /> Snap Photo
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 rounded-lg border border-emerald-300 bg-white text-emerald-900 font-bold text-xs flex items-center gap-1 hover:bg-emerald-50"
            >
              <Upload className="h-3.5 w-3.5" /> Upload File
            </button>
          </div>
        </div>

        {/* Questions Loop */}
        {exam.questions.map((q, idx) => (
          <div
            key={q.id}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <span className="font-extrabold text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                Question #{idx + 1} • {q.marks} Marks
              </span>
              <span className="text-xs text-muted-foreground font-semibold">
                Format: {q.type}
              </span>
            </div>

            {q.stimulusText && (
              <div className="p-4 rounded-xl bg-muted/40 border border-border text-xs bengali-font space-y-1">
                <div className="font-bold text-foreground">উদ্দীপক (Stimulus):</div>
                <p className="text-foreground/90 leading-relaxed">{q.stimulusText}</p>
              </div>
            )}

            <p className="text-xs sm:text-sm font-semibold text-foreground leading-relaxed bengali-font">
              {q.questionText}
            </p>

            {/* MCQ Options */}
            {q.type === "MCQ" && q.mcqOptions && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                {q.mcqOptions.map((opt) => {
                  const isSelected = answers[q.id]?.selectedOptionId === opt.id;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMCQ(q.id, opt.id)}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border text-left text-xs transition-all ${
                        isSelected
                          ? "border-emerald-500 bg-emerald-50/60 text-emerald-950 font-bold shadow-sm"
                          : "border-border bg-background hover:bg-accent text-foreground"
                      }`}
                    >
                      <div
                        className={`h-4 w-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? "border-emerald-600 bg-emerald-600 text-white" : "border-muted-foreground"
                        }`}
                      >
                        {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-white" />}
                      </div>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* CQ Subparts */}
            {(q.type === "CQ" || q.type === "DESCRIPTIVE" || q.type === "IELTS_TASK") && (
              <div className="space-y-3 pt-2">
                {q.cqParts ? (
                  <div className="space-y-4">
                    {q.cqParts.map((part) => (
                      <div key={part.part} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-foreground bengali-font">
                            {part.bengaliLabel}) {part.questionText} ({part.marks} নম্বর)
                          </span>
                        </div>
                        <textarea
                          rows={2}
                          placeholder={`Type answer for (${part.bengaliLabel}) or write on paper and upload photos above...`}
                          value={answers[`${q.id}_${part.part}`]?.typedAnswer || ""}
                          onChange={(e) => handleTypeAnswer(`${q.id}_${part.part}`, e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <textarea
                    rows={6}
                    placeholder="Type your essay or solution here..."
                    value={answers[q.id]?.typedAnswer || ""}
                    onChange={(e) => handleTypeAnswer(q.id, e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-background text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                  />
                )}
              </div>
            )}
          </div>
        ))}

        {/* Bottom Submit Action */}
        <div className="pt-4 text-center">
          <button
            onClick={handleSubmitExam}
            disabled={isSubmitting}
            className="w-full sm:w-auto px-10 py-3.5 rounded-xl bg-emerald-600 font-bold text-sm text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 transition-all disabled:opacity-60"
          >
            {isSubmitting ? "Evaluating with AI..." : "Submit All Answers for AI Evaluation"}
          </button>
        </div>
      </div>
    </div>
  );
}
