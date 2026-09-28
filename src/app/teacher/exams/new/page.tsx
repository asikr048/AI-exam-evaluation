"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  PlusCircle,
  Trash2,
  Save,
  BookOpen,
  CheckCircle2,
  Sparkles,
  HelpCircle,
} from "lucide-react";
import { EXAM_TYPES } from "@/lib/constants";
import { CQPart, Question } from "@/lib/types";

export default function NewExamPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [curriculumCode, setCurriculumCode] = useState("HSC");
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [negativeMarkingRate, setNegativeMarkingRate] = useState(0.0);
  const [accessCode, setAccessCode] = useState("BATCH2026");

  // Questions array
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: `q_${Date.now()}_1`,
      examId: "",
      type: "CQ",
      orderIndex: 1,
      marks: 10,
      questionText: "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
      stimulusText: "একটি গতিশীল বস্তু সংক্রান্ত উদ্দীপক...",
      cqParts: [
        {
          part: "ka",
          bengaliLabel: "ক",
          cognitiveLevel: "জ্ঞানমূলক",
          marks: 1,
          questionText: "প্রাস কাকে বলে?",
          modelAnswer: "আনুভূমিকের সাথে কোনো কোণে শূন্যে নিক্ষিপ্ত বস্তুকে প্রাস বলে।",
          rubrics: [
            {
              id: "r1",
              criterion: "সঠিক সংজ্ঞা",
              maxPoints: 1,
              description: "সংজ্ঞা সঠিকভাবে লিখলে ১ নম্বর।",
            },
          ],
        },
        {
          part: "kha",
          bengaliLabel: "খ",
          cognitiveLevel: "অনুধাবনমূলক",
          marks: 2,
          questionText: "চলন্ত বাসের যাত্রী সামনে ঝুঁকে পড়ে কেন? ব্যাখ্যা করো।",
          modelAnswer: "গতিজড়তার কারণে...",
          rubrics: [
            {
              id: "r2_1",
              criterion: "জড়তা চিহ্নিতকরণ",
              maxPoints: 1,
              description: "গতিজড়তার প্রত্যক্ষ উল্লেখ।",
            },
            {
              id: "r2_2",
              criterion: "বৈজ্ঞানিক ব্যাখ্যা",
              maxPoints: 1,
              description: "পা ও শরীরের ঊর্ধ্বাংশের বেগের বৈসাদৃশ্য।",
            },
          ],
        },
        {
          part: "ga",
          bengaliLabel: "গ",
          cognitiveLevel: "প্রয়োগমূলক",
          marks: 3,
          questionText: "বস্তুটির সর্বোচ্চ উচ্চতায় পৌঁছানোর সময় নির্ণয় করো।",
          modelAnswer: "t = v₀ sinθ / g...",
          rubrics: [
            { id: "r3_1", criterion: "সূত্র প্রতিপাদন", maxPoints: 1, description: "সঠিক সূত্র" },
            { id: "r3_2", criterion: "মান প্রতিস্থাপন", maxPoints: 1, description: "মান বসানো" },
            { id: "r3_3", criterion: "এককসহ উত্তর", maxPoints: 1, description: "চূড়ান্ত ফলাফল" },
          ],
        },
        {
          part: "gha",
          bengaliLabel: "ঘ",
          cognitiveLevel: "উচ্চতর দক্ষতামূলক",
          marks: 4,
          questionText: "গাণিতিক বিশ্লেষণের মাধ্যমে শক্তির সংরক্ষণশীলতা নীতি যাচাই করো।",
          modelAnswer: "আদি বিন্দু, মধ্যবিন্দু ও সর্বোচ্চ বিন্দুতে মোট শক্তি ধ্রুবক...",
          rubrics: [
            { id: "r4_1", criterion: "সিদ্ধান্ত", maxPoints: 1, description: "মতামত" },
            { id: "r4_2", criterion: "তত্ত্বীয় ধারণা", maxPoints: 1, description: "তত্ত্ব" },
            { id: "r4_3", criterion: "গাণিতিক প্রতিপাদন", maxPoints: 1, description: "গণনা" },
            { id: "r4_4", criterion: "উপসংহার", maxPoints: 1, description: "সমন্বয়" },
          ],
        },
      ],
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Add MCQ Question
  const addMCQ = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      examId: "",
      type: "MCQ",
      orderIndex: questions.length + 1,
      marks: 1,
      questionText: "নতুন বহুনির্বাচনী প্রশ্ন লিখুন...",
      mcqOptions: [
        { id: "opt_1", text: "বিকল্প ক", isCorrect: true, explanation: "সঠিক উত্তর" },
        { id: "opt_2", text: "বিকল্প খ", isCorrect: false },
        { id: "opt_3", text: "বিকল্প গ", isCorrect: false },
        { id: "opt_4", text: "বিকল্প ঘ", isCorrect: false },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  // Add CQ Question
  const addCQ = () => {
    const newQ: Question = {
      id: `q_${Date.now()}_${questions.length + 1}`,
      examId: "",
      type: "CQ",
      orderIndex: questions.length + 1,
      marks: 10,
      questionText: "উদ্দীপকটি পড়ে নিচের প্রশ্নগুলোর উত্তর দাও:",
      stimulusText: "উদ্দীপকের দৃশ্যপট বা তথ্য এখানে লিখুন...",
      cqParts: [
        {
          part: "ka",
          bengaliLabel: "ক",
          cognitiveLevel: "জ্ঞানমূলক",
          marks: 1,
          questionText: "জ্ঞানমূলক প্রশ্ন লিখুন",
          modelAnswer: "আদর্শ উত্তর",
          rubrics: [{ id: "r_1", criterion: "সঠিক সংজ্ঞা", maxPoints: 1, description: "সংজ্ঞা" }],
        },
        {
          part: "kha",
          bengaliLabel: "খ",
          cognitiveLevel: "অনুধাবনমূলক",
          marks: 2,
          questionText: "অনুধাবনমূলক প্রশ্ন লিখুন",
          modelAnswer: "আদর্শ উত্তর (২ প্যারা)",
          rubrics: [
            { id: "r_2_1", criterion: "১ম প্যারা মূল কারণ", maxPoints: 1, description: "চিহ্নিতকরণ" },
            { id: "r_2_2", criterion: "২য় প্যারা ব্যাখ্যা", maxPoints: 1, description: "ব্যাখ্যা" },
          ],
        },
        {
          part: "ga",
          bengaliLabel: "গ",
          cognitiveLevel: "প্রয়োগমূলক",
          marks: 3,
          questionText: "প্রয়োগমূলক গাণিতিক/বিশ্লেষণ প্রশ্ন লিখুন",
          modelAnswer: "সূত্র ও গণনা...",
          rubrics: [
            { id: "r_3_1", criterion: "সূত্র নির্ধারণ", maxPoints: 1, description: "সূত্র" },
            { id: "r_3_2", criterion: "মান বসানো", maxPoints: 1, description: "মান" },
            { id: "r_3_3", criterion: "উত্তর ও একক", maxPoints: 1, description: "উত্তর" },
          ],
        },
        {
          part: "gha",
          bengaliLabel: "ঘ",
          cognitiveLevel: "উচ্চতর দক্ষতামূলক",
          marks: 4,
          questionText: "উচ্চতর দক্ষতামূলক তুলনামূলক প্রশ্ন লিখুন",
          modelAnswer: "৪ ধাপের সমন্বিত মূল্যায়ন...",
          rubrics: [
            { id: "r_4_1", criterion: "সিদ্ধান্ত", maxPoints: 1, description: "সিদ্ধান্ত" },
            { id: "r_4_2", criterion: "তত্ত্বীয় ব্যাখ্যা", maxPoints: 1, description: "তত্ত্ব" },
            { id: "r_4_3", criterion: "গাণিতিক প্রমাণ", maxPoints: 1, description: "প্রমাণ" },
            { id: "r_4_4", criterion: "চূড়ান্ত মূল্যায়ন", maxPoints: 1, description: "উপসংহার" },
          ],
        },
      ],
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleSaveExam = async () => {
    if (!title || !subject) {
      alert("Please fill in Exam Title and Subject");
      return;
    }

    setIsSubmitting(true);
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0);

    try {
      const res = await fetch("/api/exams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          subject,
          curriculumCode,
          durationMinutes: Number(durationMinutes),
          totalMarks,
          negativeMarkingRate: Number(negativeMarkingRate),
          passMarkPercentage: 33,
          isOnline: true,
          isPublished: true,
          accessCode,
          questions,
        }),
      });

      const data = await res.json();
      if (data.success) {
        router.push("/teacher");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-5xl px-4 sm:px-6 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <Link
            href="/teacher"
            className="p-2 rounded-xl border border-border hover:bg-accent transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-foreground">
              Create New Exam & Marking Rubrics
            </h1>
            <p className="text-xs text-muted-foreground">
              Configure Creative Questions (ক, খ, গ, ঘ), MCQs, or IELTS writing topics.
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveExam}
          disabled={isSubmitting}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700 transition-all disabled:opacity-60"
        >
          {isSubmitting ? (
            "Saving..."
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save & Publish Exam
            </>
          )}
        </button>
      </div>

      {/* Step 1: Exam Metadata Card */}
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
        <h3 className="font-extrabold text-sm text-foreground flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-emerald-600" />
          Step 1: Exam Basic Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Exam Title:</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. HSC Physics 1st Paper Final Model Test"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Subject / Course:</label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Physics / রসায়ন / IELTS Writing"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Curriculum / Exam Type:</label>
            <select
              value={curriculumCode}
              onChange={(e) => setCurriculumCode(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            >
              {EXAM_TYPES.map((type) => (
                <option key={type.id} value={type.code}>
                  {type.name} ({type.nameBn})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Time Limit (Minutes):</label>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(Number(e.target.value))}
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Negative Marking Rate:</label>
            <input
              type="number"
              step="0.05"
              value={negativeMarkingRate}
              onChange={(e) => setNegativeMarkingRate(Number(e.target.value))}
              placeholder="0.0 for Board, 0.25 for Varsity, 0.50 for BCS"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-foreground">Student Access Code:</label>
            <input
              type="text"
              value={accessCode}
              onChange={(e) => setAccessCode(e.target.value)}
              placeholder="e.g. BATCH2026"
              className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none font-mono"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Questions & Rubrics */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-extrabold text-base text-foreground">
              Step 2: Questions & Marking Rubrics
            </h3>
            <p className="text-xs text-muted-foreground">
              Define the questions, model answers, and step marks so the AI evaluates scripts fairly.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={addCQ}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-800 text-xs font-bold hover:bg-emerald-100 transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              + Add CQ (ক, খ, গ, ঘ)
            </button>
            <button
              onClick={addMCQ}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card text-foreground text-xs font-bold hover:bg-accent transition-colors"
            >
              <PlusCircle className="h-3.5 w-3.5 text-emerald-600" />
              + Add MCQ
            </button>
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div
              key={q.id}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-muted text-foreground">
                  Question #{idx + 1} • {q.type === "CQ" ? "Creative Question (১০ নম্বর)" : "MCQ (১ নম্বর)"}
                </span>
                <button
                  onClick={() => removeQuestion(q.id)}
                  className="p-1 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                  title="Remove question"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {q.type === "CQ" ? (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">উদ্দীপক (Stimulus):</label>
                    <textarea
                      rows={3}
                      value={q.stimulusText}
                      onChange={(e) => {
                        const updated = [...questions];
                        updated[idx].stimulusText = e.target.value;
                        setQuestions(updated);
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs bengali-font focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                  </div>

                  {/* 4 subparts: ক, খ, গ, ঘ */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {q.cqParts?.map((part, pIdx) => (
                      <div
                        key={part.part}
                        className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            {part.bengaliLabel} - {part.cognitiveLevel}
                          </span>
                          <span className="text-xs font-bold text-foreground">{part.marks} নম্বর</span>
                        </div>
                        <input
                          type="text"
                          value={part.questionText}
                          onChange={(e) => {
                            const updated = [...questions];
                            if (updated[idx].cqParts) {
                              updated[idx].cqParts[pIdx].questionText = e.target.value;
                              setQuestions(updated);
                            }
                          }}
                          className="w-full px-3 py-1.5 rounded-lg border border-border bg-background text-xs bengali-font"
                        />
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-muted-foreground uppercase">
                            Model Answer & Rubrics:
                          </span>
                          <textarea
                            rows={2}
                            value={part.modelAnswer}
                            onChange={(e) => {
                              const updated = [...questions];
                              if (updated[idx].cqParts) {
                                updated[idx].cqParts[pIdx].modelAnswer = e.target.value;
                                setQuestions(updated);
                              }
                            }}
                            className="w-full px-3 py-1 rounded-lg border border-border bg-background text-[11px] bengali-font"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={q.questionText}
                    onChange={(e) => {
                      const updated = [...questions];
                      updated[idx].questionText = e.target.value;
                      setQuestions(updated);
                    }}
                    className="w-full px-3.5 py-2 rounded-xl border border-border bg-background text-xs"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {q.mcqOptions?.map((opt, oIdx) => (
                      <div
                        key={opt.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background text-xs"
                      >
                        <input
                          type="radio"
                          name={`opt_${q.id}`}
                          checked={opt.isCorrect}
                          onChange={() => {
                            const updated = [...questions];
                            updated[idx].mcqOptions?.forEach((o, i) => {
                              o.isCorrect = i === oIdx;
                            });
                            setQuestions(updated);
                          }}
                        />
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const updated = [...questions];
                            if (updated[idx].mcqOptions) {
                              updated[idx].mcqOptions[oIdx].text = e.target.value;
                              setQuestions(updated);
                            }
                          }}
                          className="flex-1 bg-transparent border-none focus:outline-none text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
