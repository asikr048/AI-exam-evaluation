"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import { Check, Sparkles, X, Smartphone, ShieldCheck, ArrowRight } from "lucide-react";

export function PricingSection() {
  const [currency, setCurrency] = useState<"bdt" | "usd">("bdt");
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentStep, setPaymentStep] = useState<"method" | "number" | "success">("method");
  const [paymentProvider, setPaymentProvider] = useState<"bkash" | "nagad" | "card">("bkash");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const plans = [
    {
      id: "free",
      name: "Free Starter (পরীক্ষামূলক)",
      priceBDT: "৳০",
      priceUSD: "$0",
      period: "forever",
      description: "For individual teachers and tutors getting started with AI evaluation.",
      features: [
        "15 Exam scripts evaluated / month",
        "Bangladeshi SSC & HSC CQ support",
        "IELTS Writing Task 2 sample testing",
        "Single-page camera & upload",
        "Instant point-by-point breakdown",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      id: "teacher_pro",
      name: "Teacher Pro (শিক্ষক প্রো)",
      priceBDT: "৳৯৯৯",
      priceUSD: "$9.99",
      period: "per month",
      description: "For school teachers, college professors, and private batch tutors.",
      features: [
        "250 Exam scripts evaluated / month",
        "All exam types (CQ, MCQ, IELTS, Varsity)",
        "Mobile camera batch photo scanner",
        "Handwriting legibility alert & human review",
        "Full student portal access with marks breakdown",
        "CSV & PDF Result Export",
      ],
      popular: true,
      cta: "Upgrade to Teacher Pro",
    },
    {
      id: "coaching_ultra",
      name: "Coaching Ultra (কোচিং সেন্টার)",
      priceBDT: "৳৪,৯৯৯",
      priceUSD: "$49.99",
      period: "per month",
      description: "For coaching centers (Udvash, UCC, Retina, Mentors') & institutions.",
      features: [
        "2,500 Exam scripts evaluated / month",
        "Multi-teacher accounts & batch assignment",
        "High-speed batch processing",
        "Custom institution branding on student sheets",
        "Sub-question step deduction analytics",
        "Priority AI gateway & zero downtime SLA",
      ],
      popular: false,
      cta: "Activate Coaching Plan",
    },
    {
      id: "varsity_enterprise",
      name: "Varsity / School Enterprise",
      priceBDT: "Custom",
      priceUSD: "Custom",
      period: "annual",
      description: "For universities, large school chains, and examination boards.",
      features: [
        "Unlimited script evaluations",
        "On-premise or private cloud AI deployment",
        "Moodle, Canvas & Custom LMS integration",
        "Custom fine-tuned OCR model for Bengali cursive",
        "24/7 dedicated engineering support",
      ],
      popular: false,
      cta: "Contact Enterprise Sales",
    },
  ];

  const handleOpenCheckout = (planId: string) => {
    setSelectedPlan(planId);
    setPaymentStep("method");
    setMobileNumber("");
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentStep("success");
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }, 1200);
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Transparent Commercial Pricing
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
            Affordable Plans for <span className="text-emerald-600">Every Educator</span>
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Save up to 85% of time spent manually grading scripts. Cut turnaround time from weeks to minutes.
          </p>

          {/* Currency Toggle */}
          <div className="flex items-center justify-center gap-3 mt-6">
            <span className={`text-xs font-bold ${currency === "bdt" ? "text-emerald-700" : "text-muted-foreground"}`}>
              🇧🇩 Bangladeshi Taka (৳ BDT)
            </span>
            <button
              onClick={() => setCurrency(currency === "bdt" ? "usd" : "bdt")}
              className="relative inline-flex h-6 w-11 items-center rounded-full bg-muted border border-border p-0.5 transition-colors"
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-emerald-600 transition-transform ${
                  currency === "usd" ? "translate-x-5" : "translate-x-0"
                }`}
              />
            </button>
            <span className={`text-xs font-bold ${currency === "usd" ? "text-emerald-700" : "text-muted-foreground"}`}>
              🌍 Global (USD $)
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`relative rounded-2xl border p-6 flex flex-col justify-between transition-all hover:shadow-xl ${
                p.popular
                  ? "border-emerald-500 bg-card shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-500/20"
                  : "border-border bg-card shadow-sm"
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-3 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  Most Popular for Teachers
                </div>
              )}

              <div>
                <h3 className="font-extrabold text-base text-foreground">{p.name}</h3>
                <p className="text-xs text-muted-foreground mt-1 min-h-[32px]">{p.description}</p>

                <div className="mt-4 mb-6">
                  <span className="text-3xl font-black text-foreground">
                    {currency === "bdt" ? p.priceBDT : p.priceUSD}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1.5 font-medium">/{p.period}</span>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-border">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Included Features:
                  </p>
                  {p.features.map((f, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                      <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={() => handleOpenCheckout(p.id)}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                    p.popular
                      ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20"
                      : "bg-muted text-foreground hover:bg-accent border border-border"
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Localized Bangladeshi Payment Badges */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground font-medium mb-3">
            Instant automatic checkout supported via:
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <span className="px-3 py-1.5 rounded-xl border border-pink-200 bg-pink-50 text-pink-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-pink-500" />
              বিকাশ (bKash) Merchant
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-orange-200 bg-orange-50 text-orange-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-orange-500" />
              নগদ (Nagad) Payment
            </span>
            <span className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50 text-blue-700 text-xs font-bold flex items-center gap-1.5 shadow-sm">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              Visa / Mastercard / Amex
            </span>
          </div>
        </div>

        {/* Interactive Payment Checkout Modal Simulation */}
        {selectedPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
            <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                    ৳
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-foreground">Subscribe to KhataAI</h4>
                    <p className="text-[11px] text-muted-foreground">Direct bKash / Nagad Instant Checkout</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedPlan(null)}
                  className="rounded-lg p-1 text-muted-foreground hover:bg-accent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {paymentStep === "method" && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">Select your preferred payment gateway:</p>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => {
                        setPaymentProvider("bkash");
                        setPaymentStep("number");
                      }}
                      className="p-4 rounded-xl border-2 border-pink-400 bg-pink-50/50 hover:bg-pink-50 flex flex-col items-center justify-center gap-2 transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-pink-500 text-white flex items-center justify-center font-extrabold text-sm">
                        bK
                      </div>
                      <span className="text-xs font-bold text-pink-900">Pay with bKash</span>
                    </button>

                    <button
                      onClick={() => {
                        setPaymentProvider("nagad");
                        setPaymentStep("number");
                      }}
                      className="p-4 rounded-xl border-2 border-orange-400 bg-orange-50/50 hover:bg-orange-50 flex flex-col items-center justify-center gap-2 transition-all"
                    >
                      <div className="h-10 w-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-extrabold text-sm">
                        ন
                      </div>
                      <span className="text-xs font-bold text-orange-900">Pay with Nagad</span>
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "number" && (
                <div className="space-y-4">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border text-xs flex items-center justify-between">
                    <span>Selected Gateway:</span>
                    <span className="font-bold uppercase text-foreground">
                      {paymentProvider === "bkash" ? "bKash Merchant" : "Nagad Payment"}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-foreground">Enter Your Mobile Account Number:</label>
                    <div className="relative">
                      <Smartphone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <input
                        type="tel"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className="w-full pl-9 pr-3 py-2 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Demo mode: enter any 11-digit Bangladeshi number to test.
                    </p>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setPaymentStep("method")}
                      className="w-1/3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-accent"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmPayment}
                      disabled={isProcessing}
                      className="w-2/3 py-2 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 shadow-sm flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <div className="h-3 w-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        <>
                          Confirm & Pay <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {paymentStep === "success" && (
                <div className="text-center py-6 space-y-3">
                  <div className="h-12 w-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                    <ShieldCheck className="h-6 w-6" />
                  </div>
                  <h4 className="font-bold text-base text-foreground">Plan Activated Successfully!</h4>
                  <p className="text-xs text-muted-foreground">
                    Your quota has been upgraded. You can now evaluate answer sheets at full speed with AI.
                  </p>
                  <button
                    onClick={() => setSelectedPlan(null)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 text-xs font-bold text-white hover:bg-emerald-700 mt-2"
                  >
                    Go to Teacher Evaluation Suite
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
