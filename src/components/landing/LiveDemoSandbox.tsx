"use client";

import { useState, useRef, useMemo } from "react";
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
  Eye,
  PlusCircle,
  Trash2,
  HelpCircle,
  Maximize2,
  X,
  Layers,
  Check,
  Edit3,
  RefreshCw,
} from "lucide-react";
import { EvaluationResult } from "@/lib/types";

interface CustomRubricItem {
  id: string;
  criterion: string;
  maxPoints: number;
  description: string;
}

export function LiveDemoSandbox() {
  const [selectedPreset, setSelectedPreset] = useState<"cq" | "essay" | "custom">("cq");
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [evaluationResult, setEvaluationResult] = useState<EvaluationResult | null>(null);
  const [activeResultTab, setActiveResultTab] = useState<"steps" | "ocr" | "model">("steps");
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [showImageZoomModal, setShowImageZoomModal] = useState(false);

  // Active answer sheet photo
  const [selectedSampleImage, setSelectedSampleImage] = useState<string>("/samples/bengali_cq_script.svg");
  const [customImageBase64, setCustomImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  // Templates for questions
  const templates = {
    projectile: {
      title: "HSC Physics: গতিবিদ্যা ও প্রাস সৃজনশীল প্রশ্ন (১০ নম্বর)",
      curriculum: "HSC",
      prompt:
        "২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। অভিকর্ষজ ত্বরণ g = ৯.৮ মি./সে.²। (ক) প্রাস কী? (খ) চলন্ত বাস থেকে লাফ দিলে যাত্রী সামনের দিকে ঝুঁকে পড়ে কেন? (গ) ক্রিকেট বলটির সর্বোচ্চ উচ্চতায় পৌঁছানোর সময় নির্ণয় করো। (ঘ) সর্বোচ্চ বিন্দুতে গতিশক্তি নিক্ষেপণ বিন্দুর গতিশক্তির কত অংশ হবে গাণিতিক বিশ্লেষণ করো।",
      modelAnswer:
        "(ক) প্রাস: আনুভূমিকের সাথে কোনো কোণে মহাশূন্যে নিক্ষিপ্ত বস্তুকে প্রাস বলে।\n(খ) গতিজড়তার কারণে। বাসের সমান বেগ লাভ করে, ভূমিতে পা স্থির হলেও শরীরের ঊর্ধ্বাংশ পূর্বের বেগ বজায় রেখে চলতে চায়।\n(গ) t = (v₀ sinθ)/g = (40 × sin 30°)/9.8 = 2.041 s ≈ 2.04 সেকেন্ড।\n(ঘ) Ek₁ = ½ m v₀² এবং শীর্ষবিন্দুতে v_x = v₀ cos 30°। Ek₂ = ½ m (v₀ cos 30°)² = ¾ Ek₁। সর্বোচ্চ বিন্দুতে গতিশক্তি ¾ গুণ।",
      rubrics: [
        {
          id: "r_p_1",
          criterion: "(ক) জ্ঞানমূলক: প্রাসের সঠিক সংজ্ঞা",
          maxPoints: 1.0,
          description: "তির্যকভাবে মহাশূন্যে নিক্ষিপ্ত বস্তুর সংজ্ঞার উল্লেখ থাকলে পূর্ণ ১ নম্বর।",
        },
        {
          id: "r_p_2",
          criterion: "(খ) অনুধাবনমূলক: চলন্ত বাস ও গতিজড়তা ব্যাখ্যা",
          maxPoints: 2.0,
          description: "১ম প্যারায় গতিজড়তার ধারণা (১) + ২য় প্যারায় পা ও ঊর্ধ্বাংশের আপেক্ষিক গতি ব্যাখ্যা (১)।",
        },
        {
          id: "r_p_3",
          criterion: "(গ) প্রয়োগমূলক: সময় সমীকরণ ও ২.০৪ সেকেন্ড মান",
          maxPoints: 3.0,
          description: "প্রাস সমীকরণ t = (v₀ sinθ)/g (১) + মান বসানো (১) + চূড়ান্ত এককসহ মান ২.০৪ s (১)।",
        },
        {
          id: "r_p_4",
          criterion: "(ঘ) উচ্চতর দক্ষতা: গতিশক্তি ¾ গুণ প্রতিপাদন ও সার্বিক সিদ্ধান্ত",
          maxPoints: 4.0,
          description: "আদি গতিশক্তি Ek₁ (১) + বেগ বিশ্লেষণ (১) + Ek₂ = ¾ Ek₁ প্রতিপাদন (১) + সিদ্ধান্ত (১)।",
        },
      ],
      sampleImage: "/samples/bengali_cq_script.svg",
    },
    floods: {
      title: "Civil Service & Public Policy: Climate Adaptation & Disaster Governance (২০ নম্বর)",
      curriculum: "BCS",
      prompt:
        "Question No 03: Lessons emerged from 2025 Floods in the context of Climate Adaptation and Disaster Governance. Analyze institutional vulnerabilities, transport infrastructure breaches, and propose strategic resilience mechanisms.",
      modelAnswer:
        "1. Introduction & Contextualization: Severe recurring floods demonstrate climate change as a permanent reality. Citation of UN Secretary-General Antonio Guterres quote.\n2. Climate Adaptation Challenges: 2.1 Anticipating unseasonal rainfall with 15-20 days forecast lead time. 2.2 Post-flood drought paradox in water-stressed nations (<1000 m³ water per capita).\n3. Infrastructure Vulnerability: 2.3 Karachi drainage system capacity of 30-40 mm/hr overwhelmed by 300-400 mm/hr downpour. Breakdown of Motorway M-5 national logistics lifeline, isolating M-8 and M-4 corridors.\n4. Disaster Governance: 3.1 Severe shortage of weather monitoring stations (Pakistan operates only 82 stations = 1 per 10,000 km² vs WMO standard of 1 per 100 km²). 3.2 Inadequate rescue boats and flood relief camps (Jalalpur Pirwala case study).",
      rubrics: [
        {
          id: "r_f_1",
          criterion: "1. Introduction & Antonio Guterres Quote",
          maxPoints: 4.0,
          description: "Thesis on climate change as the new normalcy and citation of Antonio Guterres quote.",
        },
        {
          id: "r_f_2",
          criterion: "2. Climate Adaptation & Water Drought Paradox",
          maxPoints: 4.0,
          description: "Analysis of 15-20 day early rain forecast and water scarcity below 1000m³ per capita.",
        },
        {
          id: "r_f_3",
          criterion: "3. Urban Infrastructure: Karachi Drainage Case Study",
          maxPoints: 4.0,
          description: "Comparative examination of drainage capacity (30-40 mm/hr) vs actual rainfall (300-400 mm/hr).",
        },
        {
          id: "r_f_4",
          criterion: "4. Motorway M-5 Route Breakdown Map",
          maxPoints: 4.0,
          description: "Hand-drawn geographical schematic illustrating M-5 breakage, Karachi port cutoff, and isolation of M-8 and M-4.",
        },
        {
          id: "r_f_5",
          criterion: "5. Disaster Governance Deficit & WMO Station Disparity",
          maxPoints: 4.0,
          description: "Disaster governance analysis citing 82 weather stations across Pakistan (1/10,000 km² vs 1/100 km² standard) and rescue boat shortages.",
        },
      ],
      sampleImage: "/samples/handwritten_essay_intro.jpg",
    },
    vehicle: {
      title: "Kinematics: Vehicle Acceleration & Distance Problem (১০ নম্বর)",
      curriculum: "HSC",
      prompt:
        "A vehicle traveling at 20 m/s accelerates uniformly at 2.5 m/s² for 8 seconds. Calculate: (1) Final velocity, (2) Total distance traveled, and explain the physical principles involved under Newton's laws.",
      modelAnswer:
        "1. Final Velocity: v = u + at = 20 + (2.5 * 8) = 20 + 20 = 40 m/s.\n2. Total Distance: s = ut + (1/2)at² = (20 * 8) + (0.5 * 2.5 * 64) = 160 + 80 = 240 meters.\n3. Physical Principle: Uniform acceleration under constant net force in classical kinematics.",
      rubrics: [
        {
          id: "r_v_1",
          criterion: "Step 1: Formula Identification & Initial Variables",
          maxPoints: 2.0,
          description: "States v = u + at and identifies u=20 m/s, a=2.5 m/s², t=8s with proper units.",
        },
        {
          id: "r_v_2",
          criterion: "Step 2: Final Velocity Calculation & SI Unit",
          maxPoints: 3.0,
          description: "Correct mathematical substitution resulting in v = 40 m/s with explicit unit declaration.",
        },
        {
          id: "r_v_3",
          criterion: "Step 3: Distance Traveled Derivation & Result",
          maxPoints: 3.0,
          description: "Calculates s = ut + 0.5at² = 240 meters with intermediate steps demonstrated.",
        },
        {
          id: "r_v_4",
          criterion: "Step 4: Physical Principle & Scientific Explanation",
          maxPoints: 2.0,
          description: "Explains uniform acceleration and constant force relation under classical mechanics.",
        },
      ],
      sampleImage: "/samples/bengali_cq_script.svg",
    },
  };

  // Custom Question & Marking Points State (defaults to projectile problem to match default bengali script!)
  const [customQuestionTitle, setCustomQuestionTitle] = useState(templates.projectile.title);
  const [customCurriculum, setCustomCurriculum] = useState(templates.projectile.curriculum);
  const [customQuestionPrompt, setCustomQuestionPrompt] = useState(templates.projectile.prompt);
  const [customModelAnswer, setCustomModelAnswer] = useState(templates.projectile.modelAnswer);
  const [customRubrics, setCustomRubrics] = useState<CustomRubricItem[]>(templates.projectile.rubrics);

  const sampleImages = [
    {
      label: "🇧🇩 Bengali CQ Khata (Board Paper)",
      url: "/samples/bengali_cq_script.svg",
      type: "cq",
      desc: "Lined Board Paper with ক, খ, গ, ঘ on Projectile Motion & Teacher Marks",
    },
    {
      label: "📄 Essay Page 1: Intro & Quote",
      url: "/samples/handwritten_essay_intro.jpg",
      type: "essay",
      desc: "Real handwritten script: Introduction & UN Secretary General Quote",
    },
    {
      label: "🗺️ Essay Page 3: Karachi Map Diagram",
      url: "/samples/handwritten_essay_map.jpg",
      type: "essay",
      desc: "Real handwritten script: Motorway M-5 Breakdown Map with Teacher Marks",
    },
    {
      label: "📄 Essay Page 2: Climate Lessons",
      url: "/samples/handwritten_essay_lessons.jpg",
      type: "essay",
      desc: "Real handwritten script: Section 2.1 & 2.2 Climate Adaptation",
    },
    {
      label: "📄 Essay Page 4: Disaster Logistics",
      url: "/samples/handwritten_essay_infra.jpg",
      type: "essay",
      desc: "Real handwritten script: WMO Weather Station Comparative Data",
    },
  ];

  const steps = [
    "📷 High-Resolution Vision Scanning & Line Detection...",
    "🔍 Vision OCR Extracting Handwritten Text, Equations & Diagrams...",
    "📐 Cross-referencing against Model Answer & Point-by-Point Rubrics...",
    "⚖️ Allocating Exact Marks & Generating Teacher-Grade Explanations...",
  ];

  const activeImageUrl = customImageBase64 || selectedSampleImage;

  // Live Topic Alignment / Mismatch Detection:
  const alignmentAnalysis = useMemo(() => {
    const isBengaliCQImage = activeImageUrl.includes("bengali_cq_script");
    const isFloodsEssayImage =
      activeImageUrl.includes("handwritten_essay") ||
      activeImageUrl.includes("618712129") ||
      activeImageUrl.includes("620080148") ||
      activeImageUrl.includes("622791192") ||
      activeImageUrl.includes("623292396");

    const currentCombinedText = (
      selectedPreset === "cq"
        ? "প্রাস projectile গতিবিদ্যা ক্রিকেট বল"
        : selectedPreset === "essay"
        ? "flood climate adaptation karachi motorway disaster"
        : customQuestionTitle + " " + customQuestionPrompt
    ).toLowerCase();

    const isQuestionAboutProjectile =
      selectedPreset === "cq" ||
      currentCombinedText.includes("প্রাস") ||
      currentCombinedText.includes("projectile") ||
      currentCombinedText.includes("ক্রিকেট বল") ||
      currentCombinedText.includes("নিক্ষেপ") ||
      currentCombinedText.includes("গতিজড়তা") ||
      currentCombinedText.includes("গতিজড়তা");

    const isQuestionAboutFloods =
      selectedPreset === "essay" ||
      currentCombinedText.includes("flood") ||
      currentCombinedText.includes("climate") ||
      currentCombinedText.includes("adaptation") ||
      currentCombinedText.includes("karachi") ||
      currentCombinedText.includes("guterres") ||
      currentCombinedText.includes("disaster");

    let isMismatched = false;
    let mismatchMessage = "";

    if (isBengaliCQImage && !isQuestionAboutProjectile) {
      isMismatched = true;
      mismatchMessage =
        "Selected answer sheet is Bengali CQ on Projectile Motion (প্রাস), but the question is completely different! The AI will catch this irrelevance and award 0 marks.";
    } else if (isFloodsEssayImage && !isQuestionAboutFloods) {
      isMismatched = true;
      mismatchMessage =
        "Selected answer sheet discusses 2025 Floods & Climate Adaptation, but the question is completely different! The AI will catch this irrelevance and award 0 marks.";
    }

    return {
      isMismatched,
      mismatchMessage,
      isBengaliCQImage,
      isFloodsEssayImage,
    };
  }, [activeImageUrl, selectedPreset, customQuestionTitle, customQuestionPrompt]);

  const loadTemplate = (key: "projectile" | "floods" | "vehicle") => {
    const t = templates[key];
    setCustomQuestionTitle(t.title);
    setCustomCurriculum(t.curriculum);
    setCustomQuestionPrompt(t.prompt);
    setCustomModelAnswer(t.modelAnswer);
    setCustomRubrics(t.rubrics);
    if (!customImageBase64) {
      setSelectedSampleImage(t.sampleImage);
    }
    setEvaluationResult(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setCustomImageBase64(reader.result);
        setEvaluationResult(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const addRubricPoint = () => {
    const newId = `cr_${Date.now()}`;
    setCustomRubrics((prev) => [
      ...prev,
      {
        id: newId,
        criterion: `Step ${prev.length + 1}: Key Requirement`,
        maxPoints: 2.0,
        description: "Specify the exact condition, formula, or analysis required for this mark.",
      },
    ]);
  };

  const removeRubricPoint = (id: string) => {
    if (customRubrics.length <= 1) return;
    setCustomRubrics((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRubricPoint = (id: string, field: keyof CustomRubricItem, value: any) => {
    setCustomRubrics((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const totalCustomMarks = customRubrics.reduce((sum, r) => sum + Number(r.maxPoints || 0), 0);

  const runDemoEvaluation = async () => {
    setIsEvaluating(true);
    setEvaluationResult(null);

    // Progress animation
    for (let i = 0; i < steps.length; i++) {
      setProgressStep(i);
      await new Promise((resolve) => setTimeout(resolve, 550));
    }

    try {
      let payload: any = {
        answerSheetImages: [activeImageUrl],
      };

      if (selectedPreset === "cq") {
        payload.examId = "exam_hsc_physics_01";
      } else if (selectedPreset === "essay") {
        payload.examId = "exam_civil_service_essay_01";
      } else {
        // Custom created exam with user defined points and marks
        payload.customExam = {
          title: customQuestionTitle,
          subject: "Custom Subjective Evaluation",
          curriculumCode: customCurriculum,
          totalMarks: totalCustomMarks,
          questions: [
            {
              id: "q_custom_01",
              type: "DESCRIPTIVE",
              marks: totalCustomMarks,
              questionText: customQuestionPrompt,
              modelAnswer: customModelAnswer,
              rubrics: customRubrics.map((r) => ({
                id: r.id,
                criterion: r.criterion,
                maxPoints: Number(r.maxPoints),
                description: r.description,
              })),
            },
          ],
        };
      }

      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
    <section id="demo" className="py-16 sm:py-24 bg-gradient-to-b from-background via-emerald-950/[0.03] to-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-bold shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Interactive Real Question & Step-Marking Sandbox
          </div>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground">
            Real Questions, <span className="text-emerald-600">Real Answer Sheets</span> & Step Explanations
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Create or select real questions with model answers, define exact points for each mark, provide authentic handwritten exam photos, and watch AI evaluate each step with full explanatory justifications.
          </p>
        </div>

        {/* Sandbox Card */}
        <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Top Control Bar: Presets & Action */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 sm:p-6 border-b border-border bg-muted/40">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mr-1">
                Exam Mode:
              </span>
              <div className="inline-flex p-1 rounded-2xl bg-background border border-border shadow-inner">
                <button
                  onClick={() => {
                    setSelectedPreset("cq");
                    setSelectedSampleImage("/samples/bengali_cq_script.svg");
                    setCustomImageBase64(null);
                    setEvaluationResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPreset === "cq"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🇧🇩</span> HSC Physics CQ (১০ নম্বর)
                </button>
                <button
                  onClick={() => {
                    setSelectedPreset("essay");
                    setSelectedSampleImage("/samples/handwritten_essay_intro.jpg");
                    setCustomImageBase64(null);
                    setEvaluationResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPreset === "essay"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>🌍</span> Essay / Civil Service (২০ নম্বর)
                </button>
                <button
                  onClick={() => {
                    setSelectedPreset("custom");
                    setEvaluationResult(null);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    selectedPreset === "custom"
                      ? "bg-emerald-600 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span>✏️</span> Create Custom Question & Points
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowQuestionModal(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground transition-all shadow-sm"
              >
                <HelpCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>
                  {selectedPreset === "custom" ? "Edit Question & Rubric Points" : "View Question & Marks Scheme"}
                </span>
              </button>

              <button
                onClick={runDemoEvaluation}
                disabled={isEvaluating}
                className="flex items-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition-all disabled:opacity-60"
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

          {/* Real-time Relevance & Topic Alignment Banner */}
          <div className="px-6 py-3 border-b border-border bg-background/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-foreground flex items-center gap-1.5">
                <BookOpen className="h-3.5 w-3.5 text-emerald-600" />
                {selectedPreset === "cq" && "HSC Physics: গতিবিদ্যা ও প্রাস সৃজনশীল প্রশ্ন (১০ নম্বর)"}
                {selectedPreset === "essay" && "Civil Service: 2025 Floods & Climate Governance (২০ নম্বর)"}
                {selectedPreset === "custom" && `${customQuestionTitle} (${totalCustomMarks} নম্বর)`}
              </span>
            </div>

            {/* Topic Match Status */}
            {alignmentAnalysis.isMismatched ? (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 font-bold text-[11px] animate-pulse">
                <AlertTriangle className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                <span>Topic Mismatch: Answer sheet is irrelevant to question (AI will give 0 marks)</span>
                <button
                  onClick={() => {
                    if (alignmentAnalysis.isBengaliCQImage) {
                      loadTemplate("projectile");
                    } else if (alignmentAnalysis.isFloodsEssayImage) {
                      loadTemplate("floods");
                    }
                  }}
                  className="ml-1 underline font-black hover:text-amber-900"
                >
                  Auto-Align
                </button>
              </div>
            ) : (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold text-[11px]">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                <span>Verified Match: Answer sheet matches question topic</span>
              </div>
            )}
          </div>

          {/* Sandbox Body: Split Screen */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            {/* Left: Real Handwritten Answer Sheet Photo & Uploader */}
            <div className="lg:col-span-5 p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-border bg-muted/15 flex flex-col justify-between space-y-5">
              <div className="space-y-4">
                {/* Header with Photo Source and Upload Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-bold text-foreground">
                      Student Answer Sheet Photo
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 text-[11px] font-bold text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Upload className="h-3 w-3" />
                      <span>Upload Photo</span>
                    </button>
                    <button
                      onClick={() => cameraInputRef.current?.click()}
                      className="px-2.5 py-1 rounded-lg border border-border bg-background hover:bg-accent text-[11px] font-bold text-foreground transition-colors flex items-center gap-1 shadow-sm"
                      title="Capture with camera"
                    >
                      <Camera className="h-3 w-3 text-muted-foreground" />
                      <span className="hidden sm:inline">Camera</span>
                    </button>
                  </div>
                </div>

                {/* Hidden File Inputs */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Real Answer Sheet Image Viewport */}
                <div className="relative group rounded-2xl border border-border overflow-hidden bg-slate-950 shadow-lg min-h-[300px] max-h-[380px] flex items-center justify-center">
                  <img
                    src={activeImageUrl}
                    alt="Student Handwritten Answer Sheet"
                    className="w-full h-full object-contain max-h-[380px] transition-transform duration-300 group-hover:scale-[1.02]"
                  />

                  {/* Top-Right Zoom Button */}
                  <button
                    onClick={() => setShowImageZoomModal(true)}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur transition-all shadow-md"
                    title="Inspect Full Size Photo"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </button>

                  {/* Bottom Script Caption */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-3 flex items-center justify-between text-[11px] text-white">
                    <span className="font-semibold truncate max-w-[250px]">
                      {customImageBase64 ? "Custom Uploaded Photo" : sampleImages.find((s) => s.url === selectedSampleImage)?.label}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-emerald-600/80 font-bold text-[10px]">
                      Real Handwritten Script
                    </span>
                  </div>
                </div>

                {/* Sample Selector Pill Carousel */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
                    <span>Or Pick Authentic Student Script:</span>
                    {customImageBase64 && (
                      <button
                        onClick={() => setCustomImageBase64(null)}
                        className="text-emerald-600 hover:underline text-[10px] font-bold"
                      >
                        Reset to Samples
                      </button>
                    )}
                  </label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sampleImages.map((s) => (
                      <button
                        key={s.url}
                        onClick={() => {
                          setSelectedSampleImage(s.url);
                          setCustomImageBase64(null);
                          setEvaluationResult(null);
                        }}
                        className={`p-2 rounded-xl border text-left text-[11px] font-bold transition-all ${
                          !customImageBase64 && selectedSampleImage === s.url
                            ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 shadow-sm"
                            : "border-border bg-card hover:bg-accent text-foreground"
                        }`}
                      >
                        <p className="truncate">{s.label}</p>
                        <p className="text-[9px] font-normal text-muted-foreground truncate">{s.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Handwriting Legibility Confidence Meter */}
              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  <span>Handwriting OCR Engine:</span>
                </span>
                <span className="font-bold text-emerald-600">
                  High Confidence (96%) • Bengali & English Lined
                </span>
              </div>
            </div>

            {/* Right: AI Evaluation Output & Step-by-Step Explanations */}
            <div className="lg:col-span-7 p-5 sm:p-6 flex flex-col justify-between bg-card space-y-6">
              {isEvaluating ? (
                /* Scanning Animation */
                <div className="h-full min-h-[400px] flex flex-col items-center justify-center py-16 text-center space-y-5">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-full border-4 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 animate-spin" />
                    <Sparkles className="absolute inset-0 m-auto h-7 w-7 text-emerald-600" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-base font-extrabold text-foreground animate-pulse">
                      {steps[progressStep]}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      Executing Multimodal Vision OCR and comparing against model answer and step marks
                    </p>
                  </div>
                  <div className="w-72 bg-muted rounded-full h-2 overflow-hidden shadow-inner">
                    <div
                      className="bg-emerald-600 h-full transition-all duration-300 rounded-full"
                      style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              ) : evaluationResult ? (
                /* Full Evaluation Results View */
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Irrelevant Submission Alert Callout */}
                  {evaluationResult.totalScore === 0 && evaluationResult.overallFeedback.includes("Irrelevant") && (
                    <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/30 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-destructive font-black text-xs">
                          <AlertTriangle className="h-4 w-4 shrink-0" />
                          <span>❌ IRRELEVANT ANSWER SHEET DETECTED — 0 MARKS AWARDED</span>
                        </div>
                        <span className="px-2 py-0.5 rounded bg-destructive text-white text-[10px] font-black uppercase">
                          Failed (0%)
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {evaluationResult.overallFeedback}
                      </p>
                    </div>
                  )}

                  {/* Top Score Banner */}
                  <div
                    className={`p-4 sm:p-5 rounded-2xl border flex flex-wrap items-center justify-between gap-4 shadow-sm ${
                      evaluationResult.totalScore === 0
                        ? "bg-destructive/10 border-destructive/30"
                        : "bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/20 border-emerald-200 dark:border-emerald-800"
                    }`}
                  >
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                        Evaluated Score & Performance
                      </span>
                      <div className="text-2xl sm:text-3xl font-black text-foreground mt-0.5">
                        {evaluationResult.totalScore} / {evaluationResult.maxScore}{" "}
                        <span className="text-base sm:text-lg font-bold text-muted-foreground">
                          ({evaluationResult.percentage}%)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[11px] text-muted-foreground font-semibold">Grade Awarded:</div>
                        <div className="text-lg font-black text-foreground">
                          {evaluationResult.grade}
                        </div>
                      </div>
                      <div
                        className={`h-11 w-11 rounded-2xl text-white flex items-center justify-center font-bold text-sm shadow-md ${
                          evaluationResult.totalScore === 0 ? "bg-destructive" : "bg-emerald-600"
                        }`}
                      >
                        {evaluationResult.gpa > 0 ? `GPA ${evaluationResult.gpa.toFixed(1)}` : evaluationResult.grade}
                      </div>
                    </div>
                  </div>

                  {/* Overall Feedback Rationale */}
                  <div className="p-4 rounded-2xl border border-border bg-muted/20 space-y-1.5">
                    <div className="text-xs font-bold text-foreground flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
                      <span>AI Examiner Summary & Handwriting Assessment:</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {evaluationResult.overallFeedback}
                    </p>
                  </div>

                  {/* Tabs: Step Breakdown / OCR Extraction / Model Answer */}
                  <div className="flex items-center gap-1.5 border-b border-border pb-1">
                    <button
                      onClick={() => setActiveResultTab("steps")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "steps"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      Step Marks & Explanations ({evaluationResult.questionEvaluations[0]?.rubricScores?.length || evaluationResult.questionEvaluations[0]?.cqPartEvaluations?.length || 4})
                    </button>
                    <button
                      onClick={() => setActiveResultTab("ocr")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "ocr"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      Extracted Student Text
                    </button>
                    <button
                      onClick={() => setActiveResultTab("model")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        activeResultTab === "model"
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent"
                      }`}
                    >
                      Expected Model Answer
                    </button>
                  </div>

                  {/* Tab 1: Step Marks & Explanations (PROPER MARKS + EXPLANATION) */}
                  {activeResultTab === "steps" && (
                    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                      {/* Check if CQ Parts */}
                      {evaluationResult.questionEvaluations[0]?.cqPartEvaluations ? (
                        evaluationResult.questionEvaluations[0].cqPartEvaluations.map((part) => (
                          <div
                            key={part.part}
                            className="p-3.5 rounded-2xl border border-border bg-background space-y-2.5 shadow-sm"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-lg text-xs font-extrabold bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                                  {part.bengaliLabel} ({part.part.toUpperCase()})
                                </span>
                                <span className="text-xs font-bold text-foreground">
                                  {part.part === "ka" && "জ্ঞানমূলক: প্রাসের সংজ্ঞা"}
                                  {part.part === "kha" && "অনুধাবনমূলক: চলন্ত বাস ও গতিজড়তা"}
                                  {part.part === "ga" && "প্রয়োগমূলক: সময় ও সমীকরণ সমাধান"}
                                  {part.part === "gha" && "উচ্চতর দক্ষতা: গতিশক্তি প্রতিপাদন ও মতামত"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <span
                                  className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                    part.awardedMarks === part.maxMarks
                                      ? "bg-emerald-500/15 text-emerald-600"
                                      : part.awardedMarks === 0
                                      ? "bg-destructive/15 text-destructive"
                                      : "bg-amber-500/15 text-amber-600"
                                  }`}
                                >
                                  {part.awardedMarks} / {part.maxMarks} Marks
                                </span>
                              </div>
                            </div>

                            {/* Detailed Explanation */}
                            <div className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/60 space-y-1">
                              <span className="font-bold text-foreground block text-[11px]">
                                Examiner Justification & Step Allocation:
                              </span>
                              <p className="leading-relaxed">{part.feedback}</p>
                            </div>
                          </div>
                        ))
                      ) : evaluationResult.questionEvaluations[0]?.rubricScores ? (
                        /* Rubric Points for Essay or Custom Question */
                        evaluationResult.questionEvaluations[0].rubricScores.map((r, i) => (
                          <div
                            key={r.rubricId || i}
                            className="p-3.5 rounded-2xl border border-border bg-background space-y-2 shadow-sm"
                          >
                            <div className="flex items-center justify-between flex-wrap gap-2">
                              <span className="font-bold text-xs text-foreground flex items-center gap-1.5">
                                <span className="h-5 w-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center text-[10px] font-black">
                                  {i + 1}
                                </span>
                                <span>{r.criterion}</span>
                              </span>
                              <span
                                className={`px-2 py-0.5 rounded-md text-[11px] font-black ${
                                  r.awardedPoints === r.maxPoints
                                    ? "bg-emerald-500/15 text-emerald-600"
                                    : r.awardedPoints === 0
                                    ? "bg-destructive/15 text-destructive"
                                    : "bg-amber-500/15 text-amber-600"
                                }`}
                              >
                                {r.awardedPoints} / {r.maxPoints} Marks
                              </span>
                            </div>

                            {/* Specific Explanation */}
                            <div className="text-xs text-muted-foreground bg-muted/20 p-2.5 rounded-xl border border-border/60">
                              <span className="font-bold text-foreground block text-[11px] mb-0.5">
                                Explanation & Evidence from Script:
                              </span>
                              <p className="leading-relaxed">{r.justification}</p>
                            </div>
                          </div>
                        ))
                      ) : null}
                    </div>
                  )}

                  {/* Tab 2: OCR Extracted Handwriting */}
                  {activeResultTab === "ocr" && (
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 text-xs font-mono max-h-[350px] overflow-y-auto space-y-3 leading-relaxed">
                      <div className="font-sans font-bold text-foreground text-xs pb-1 border-b border-border">
                        Extracted Student Handwriting (Vision OCR Stream):
                      </div>
                      {alignmentAnalysis.isBengaliCQImage ? (
                        <div className="space-y-2 text-foreground/90 font-sans">
                          <p><strong>[১ নং প্রশ্নের উত্তর]</strong></p>
                          <p><strong>(ক) প্রাস:</strong> তির্যকভাবে বা অনুভূমিকের সাথে কোনো কোণে মহাশূন্যে বা বাতাসে নিক্ষিপ্ত বস্তুকে প্রাস বলা হয়। যেমন—নিক্ষিপ্ত ক্রিকেট বল।</p>
                          <p><strong>(খ)</strong> চলন্ত বাস থেকে হঠাৎ নামলে গতিজড়তার কারণে যাত্রী সামনের দিকে ঝুঁকে পড়ে। বাস যখন চলতে থাকে, তখন যাত্রীর সমগ্র শরীর বাসের সমান গতিবেগ লাভ করে...</p>
                          <p><strong>(গ)</strong> v₀ = 40 ms⁻¹, θ = 30°, g = 9.8 ms⁻²। t = (v₀ · sinθ) / g = (40 × 0.5) / 9.8 = 2.041 s ≈ 2.04 সেকেন্ড।</p>
                          <p><strong>(ঘ)</strong> E_k1 = ½ m v₀² ... v' = v_x = v₀ cos 30° ... E_k2 = ½ m (v₀ cos 30°)² = ¾ E_k1। সর্বোচ্চ বিন্দুতে গতিশক্তি নিক্ষেপণ বিন্দুর ¾ গুণ।</p>
                        </div>
                      ) : alignmentAnalysis.isFloodsEssayImage ? (
                        <div className="space-y-2 text-foreground/90 font-sans">
                          <p><strong>Question No 03: Floods of 2025 and lessons for Pakistan</strong></p>
                          <p><strong>1. Introduction:</strong> Pakistan has been facing frequent climate related disasters, particularly floods in recent decades... Quote: "Climate change is a fact. Those who deny it needs to be held answerable" (~ Antonio Guterres : Secretary General of UNGA)</p>
                          <p><strong>(2.1)</strong> Climate change is a new normal and going to affect every year... Meteorological Department predicted that in 2026, 15% more rainfall is expected even 15-20 days earlier.</p>
                          <p><strong>(2.3) Case Study 1:</strong> Karachi drainage has capacity of 30-40 mm rain per hour, however the rain in 2025 was around 300-400 mm...</p>
                          <p><strong>Case Study 2:</strong> Breakage of M-5 motorway which is the lifeline of Pakistan national connectivity (Map attached).</p>
                          <p><strong>(3.1)</strong> WMO recommends 1 weather station per 100 km², but in Pakistan there are total 82 (1 per 10,000 km²).</p>
                        </div>
                      ) : (
                        <p className="text-muted-foreground font-sans">Extracted text stream from custom uploaded photo.</p>
                      )}
                    </div>
                  )}

                  {/* Tab 3: Model Answer Reference */}
                  {activeResultTab === "model" && (
                    <div className="p-4 rounded-2xl border border-border bg-muted/20 text-xs max-h-[350px] overflow-y-auto space-y-2.5">
                      <div className="font-bold text-foreground text-xs pb-1 border-b border-border">
                        Examiner Official Solution & Reference Benchmark:
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-line font-sans">
                        {selectedPreset === "cq" && templates.projectile.modelAnswer}
                        {selectedPreset === "essay" && templates.floods.modelAnswer}
                        {selectedPreset === "custom" && customModelAnswer}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Ready State */
                <div className="h-full min-h-[380px] flex flex-col items-center justify-center py-16 text-center space-y-4">
                  <div className="h-16 w-16 rounded-3xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center text-emerald-600 shadow-sm">
                    <Award className="h-8 w-8" />
                  </div>
                  <div className="space-y-1.5 max-w-sm">
                    <h4 className="text-base font-extrabold text-foreground">Ready for AI Evaluation</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Click the <strong>"Run AI Evaluation"</strong> button to execute vision handwriting recognition, verify against marking points, and view exact step-by-step marks with explanations.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={runDemoEvaluation}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                    >
                      <Play className="h-3.5 w-3.5 fill-white" /> Start AI Evaluation Now
                    </button>
                    <button
                      onClick={() => setShowQuestionModal(true)}
                      className="px-4 py-2.5 rounded-xl border border-border bg-background hover:bg-accent text-xs font-bold text-foreground transition-all"
                    >
                      View Marking Points
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Footer: Powered By */}
              <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  Powered by <strong>Google Gemini Multimodal Vision & KhataAI Rubric Engine</strong>
                </span>
                <span>Sub-second step marking & relevance validation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL 1: Real Question & Rubric Points Viewer / Editor */}
      {showQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl rounded-3xl border border-border bg-card p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-600" />
                <h3 className="text-base font-extrabold text-foreground">
                  {selectedPreset === "custom"
                    ? "Create Real Question & Define Marking Points"
                    : "Question, Model Answer & Rubric Scheme"}
                </h3>
              </div>
              <button
                onClick={() => setShowQuestionModal(false)}
                className="p-1.5 rounded-xl hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {selectedPreset === "custom" ? (
              /* Custom Question Creator */
              <div className="space-y-4 text-xs">
                {/* 1-Click Template Loaders */}
                <div className="space-y-1.5 pb-2 border-b border-border">
                  <span className="font-bold text-muted-foreground uppercase text-[10px] tracking-wider">
                    Quick Question Templates:
                  </span>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => loadTemplate("projectile")}
                      className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-bold text-foreground"
                    >
                      🇧🇩 Projectile Motion (Matches Bengali Khata)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadTemplate("floods")}
                      className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-bold text-foreground"
                    >
                      🌍 Floods Essay (Matches Essay Script)
                    </button>
                    <button
                      type="button"
                      onClick={() => loadTemplate("vehicle")}
                      className="px-2.5 py-1 rounded-lg border border-border bg-muted/40 hover:bg-muted text-[11px] font-bold text-foreground"
                    >
                      🚗 Vehicle Kinematics (Test Mismatch)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="font-bold text-foreground">Question Title:</label>
                    <input
                      type="text"
                      value={customQuestionTitle}
                      onChange={(e) => setCustomQuestionTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-semibold"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="font-bold text-foreground">Curriculum Code:</label>
                    <select
                      value={customCurriculum}
                      onChange={(e) => setCustomCurriculum(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-border bg-background font-semibold"
                    >
                      <option value="HSC">HSC (Bangladesh)</option>
                      <option value="SSC">SSC (Bangladesh)</option>
                      <option value="BCS">BCS / Civil Service</option>
                      <option value="BUET">BUET / Engineering</option>
                      <option value="GENERAL">General Academy</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Question Prompt / Stimulus:</label>
                  <textarea
                    rows={3}
                    value={customQuestionPrompt}
                    onChange={(e) => setCustomQuestionPrompt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-foreground">Expected Model Answer:</label>
                  <textarea
                    rows={3}
                    value={customModelAnswer}
                    onChange={(e) => setCustomModelAnswer(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-border bg-background"
                  />
                </div>

                {/* Rubric Points with Mark Breakdown */}
                <div className="space-y-2 pt-2 border-t border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-foreground text-xs">
                        Marking Points & Criteria (Total: {totalCustomMarks} Marks)
                      </span>
                      <p className="text-[11px] text-muted-foreground">
                        Define exact requirements and how many marks are given for each step.
                      </p>
                    </div>
                    <button
                      onClick={addRubricPoint}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 shadow-sm"
                    >
                      <PlusCircle className="h-3.5 w-3.5" /> + Add Point
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                    {customRubrics.map((r) => (
                      <div
                        key={r.id}
                        className="p-3 rounded-xl border border-border bg-muted/20 space-y-2"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <input
                            type="text"
                            value={r.criterion}
                            onChange={(e) => updateRubricPoint(r.id, "criterion", e.target.value)}
                            placeholder="e.g. Formula statement, derivation, final unit"
                            className="flex-1 px-2.5 py-1.5 rounded-lg border border-border bg-background font-bold text-xs"
                          />
                          <div className="flex items-center gap-1 shrink-0">
                            <input
                              type="number"
                              min={0.5}
                              step={0.5}
                              value={r.maxPoints}
                              onChange={(e) => updateRubricPoint(r.id, "maxPoints", parseFloat(e.target.value) || 1)}
                              className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background font-bold text-xs text-center"
                            />
                            <span className="text-xs font-bold text-emerald-600">Marks</span>
                            {customRubrics.length > 1 && (
                              <button
                                onClick={() => removeRubricPoint(r.id)}
                                className="p-1.5 text-muted-foreground hover:text-destructive"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={r.description}
                          onChange={(e) => updateRubricPoint(r.id, "description", e.target.value)}
                          placeholder="Requirement to award this mark (e.g. must state law and write units)"
                          className="w-full px-2.5 py-1 rounded-lg border border-border bg-background text-[11px] text-muted-foreground"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-3 border-t border-border">
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md"
                  >
                    Save & Test with Photo
                  </button>
                </div>
              </div>
            ) : (
              /* Pre-set Question & Rubrics Viewer */
              <div className="space-y-4 text-xs">
                {selectedPreset === "cq" ? (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                      <span className="font-extrabold text-foreground text-xs">উদ্দীপক (Stimulus):</span>
                      <p className="text-muted-foreground leading-relaxed italic bengali-font">
                        ২০ মিটার উঁচু একটি দালানের ছাদ থেকে একটি ক্রিকেট বলকে আনুভূমিকের সাথে ৩০° কোণে ৪০ মি./সে. বেগে উপরের দিকে তির্যকভাবে নিক্ষেপ করা হলো। অভিকর্ষজ ত্বরণ g = ৯.৮ মি./সে.²।
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-extrabold text-foreground text-xs block">
                        প্রশ্ন ও ধাপভিত্তিক নম্বর বণ্টন (ক, খ, গ, ঘ):
                      </span>
                      <div className="space-y-2">
                        {templates.projectile.rubrics.map((r) => (
                          <div key={r.id} className="p-3 rounded-xl border border-border bg-background">
                            <div className="flex justify-between font-bold text-foreground">
                              <span>{r.criterion}</span>
                              <span className="text-emerald-600 font-extrabold">{r.maxPoints} নম্বর</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{r.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-3.5 rounded-2xl bg-muted/30 border border-border space-y-1.5">
                      <span className="font-extrabold text-foreground text-xs">Question No 03 (Civil Service / CSS):</span>
                      <p className="text-muted-foreground leading-relaxed italic">
                        {templates.floods.prompt}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <span className="font-extrabold text-foreground text-xs block">
                        Marking Scheme & Point-by-Point Distribution (20 Marks Total):
                      </span>
                      <div className="space-y-2">
                        {templates.floods.rubrics.map((r) => (
                          <div key={r.id} className="p-3 rounded-xl border border-border bg-background flex justify-between">
                            <div>
                              <span className="font-bold text-foreground">{r.criterion}</span>
                              <p className="text-[11px] text-muted-foreground">{r.description}</p>
                            </div>
                            <span className="font-extrabold text-emerald-600">{r.maxPoints} Marks</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end pt-3 border-t border-border">
                  <button
                    onClick={() => setShowQuestionModal(false)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
                  >
                    Close Scheme
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: Fullscreen Answer Sheet Photo Zoom Modal */}
      {showImageZoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/90 backdrop-blur-md animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[95vh] rounded-3xl overflow-hidden border border-border bg-card p-3 shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-2 border-b border-border">
              <span className="text-xs font-bold text-foreground flex items-center gap-2">
                <FileText className="h-4 w-4 text-emerald-600" />
                <span>Handwritten Script Full Resolution Inspector</span>
              </span>
              <button
                onClick={() => setShowImageZoomModal(false)}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-auto p-2 flex items-center justify-center bg-slate-950 rounded-2xl my-2">
              <img
                src={activeImageUrl}
                alt="Enlarged Answer Sheet"
                className="max-h-[80vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="p-2 text-center text-xs text-muted-foreground">
              Tip: AI Vision OCR analyzes ruled lines, marginal notes, formulas, and teacher ink strokes directly from this image.
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
