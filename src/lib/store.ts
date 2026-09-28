import { DEFAULT_AI_SETTINGS, DEMO_USERS, EXAM_TYPES } from "./constants";
import { SEED_EXAMS, SEED_SUBMISSIONS } from "./seed-data";
import {
  EvaluationResult,
  Exam,
  GlobalAISettings,
  InstitutionProfile,
  Question,
  Submission,
  User,
} from "./types";

export const SEED_INSTITUTIONS: InstitutionProfile[] = [
  {
    id: "inst_udvash",
    userId: "usr_teacher_01",
    name: "Udvash Academic & Admission Care",
    nameBn: "উদ্ভাস একাডেমিক অ্যান্ড এডমিশন কেয়ার",
    slug: "udvash-academic",
    type: "COACHING",
    description: "Bangladesh's premier engineering and medical admission coaching care. Weekly model tests and AI-evaluated CQ answer sheets.",
    contactEmail: "info@udvash.com",
    contactPhone: "+880 9666 775566",
    address: "Farmgate Branch, Dhaka",
    subscriptionPlan: "COACHING_ULTRA",
    scriptsQuota: 2500,
    scriptsUsed: 184,
  },
  {
    id: "inst_notredame",
    userId: "usr_teacher_01",
    name: "Notre Dame College, Dhaka",
    nameBn: "নটর ডেম কলেজ, ঢাকা",
    slug: "notredame-college",
    type: "COLLEGE",
    description: "Department of Physics & Higher Mathematics semester and pre-test examination portal.",
    contactEmail: "exam@notredamecollege-dhaka.com",
    contactPhone: "+880 2 7192325",
    address: "Motijheel, Dhaka",
    subscriptionPlan: "VARSITY_ENTERPRISE",
    scriptsQuota: 10000,
    scriptsUsed: 1420,
  },
  {
    id: "inst_saifurs",
    userId: "usr_teacher_01",
    name: "Saifur's Education & IELTS Care",
    nameBn: "সাইফুর'স এডুকেশন অ্যান্ড আইইএলটিএস কেয়ার",
    slug: "saifurs-ielts",
    type: "COACHING",
    description: "International test preparation center. IELTS Writing Task 1 & Task 2 live mock testing with 4-criterion band evaluations.",
    contactEmail: "ielts@saifurs.com",
    contactPhone: "+880 1713 432011",
    address: "Panthapath, Dhaka",
    subscriptionPlan: "COACHING_ULTRA",
    scriptsQuota: 2500,
    scriptsUsed: 312,
  },
  {
    id: "inst_rafiq_batch",
    userId: "usr_teacher_01",
    name: "Prof. Rafiq's Private Physics Batch",
    nameBn: "প্রফেসর রফিকের প্রাইভেট ফিজিক্স ব্যাচ",
    slug: "prof-rafiq",
    type: "INDIVIDUAL",
    description: "HSC 2026 Batch Physics special CQ & MCQ weekly evaluation program.",
    contactEmail: "rafiq.physics@gmail.com",
    contactPhone: "+880 1711 000001",
    address: "Dhanmondi, Dhaka",
    subscriptionPlan: "TEACHER_PRO",
    scriptsQuota: 250,
    scriptsUsed: 42,
  },
];

// In-memory data store with singleton pattern for client & serverless persistence
class DataStore {
  private static instance: DataStore;
  private users: User[] = [...DEMO_USERS];
  private currentUser: User = DEMO_USERS[1]; // default to Tahmid Hasan (Student) or Teacher
  private exams: Exam[] = [...SEED_EXAMS];
  private submissions: Submission[] = [...SEED_SUBMISSIONS];
  private institutions: InstitutionProfile[] = [...SEED_INSTITUTIONS];
  private aiSettings: GlobalAISettings = { ...DEFAULT_AI_SETTINGS };

  private constructor() {}

  public static getInstance(): DataStore {
    if (!DataStore.instance) {
      DataStore.instance = new DataStore();
    }
    return DataStore.instance;
  }

  // User management
  public getCurrentUser(): User {
    return this.currentUser;
  }

  public setCurrentUser(userOrRole: User | "STUDENT" | "TEACHER" | "ADMIN"): void {
    if (typeof userOrRole === "string") {
      const found = this.users.find((u) => u.role === userOrRole);
      if (found) this.currentUser = found;
    } else {
      this.currentUser = userOrRole;
    }
  }

  public getAllUsers(): User[] {
    return this.users;
  }

  // Institutions & Business Profiles
  public getInstitutions(): InstitutionProfile[] {
    return this.institutions;
  }

  public getInstitutionBySlug(slug: string): InstitutionProfile | undefined {
    return this.institutions.find(
      (i) => i.slug.toLowerCase() === slug.toLowerCase()
    );
  }

  public getInstitutionByUserId(userId: string): InstitutionProfile | undefined {
    return this.institutions.find((i) => i.userId === userId) || this.institutions[0];
  }

  public createOrUpdateInstitution(
    profileData: Partial<InstitutionProfile> & { name: string; slug: string }
  ): InstitutionProfile {
    const existingIndex = this.institutions.findIndex(
      (i) => i.slug.toLowerCase() === profileData.slug.toLowerCase()
    );

    if (existingIndex >= 0) {
      this.institutions[existingIndex] = {
        ...this.institutions[existingIndex],
        ...profileData,
      };
      return this.institutions[existingIndex];
    }

    const newInst: InstitutionProfile = {
      id: `inst_${Date.now()}`,
      userId: this.currentUser.id,
      name: profileData.name,
      nameBn: profileData.nameBn,
      slug: profileData.slug,
      type: profileData.type || "COACHING",
      description: profileData.description || "",
      contactEmail: profileData.contactEmail || this.currentUser.email,
      contactPhone: profileData.contactPhone || "+880 1700 000000",
      address: profileData.address || "Bangladesh",
      subscriptionPlan: profileData.subscriptionPlan || "FREE",
      scriptsQuota: profileData.scriptsQuota || 50,
      scriptsUsed: 0,
    };

    this.institutions.unshift(newInst);
    return newInst;
  }

  // Exams
  public getExams(): Exam[] {
    return this.exams;
  }

  public getExamById(id: string): Exam | undefined {
    return this.exams.find((e) => e.id === id);
  }

  public getExamByAccessCode(code: string): Exam | undefined {
    return this.exams.find(
      (e) =>
        e.accessCode?.toLowerCase() === code.toLowerCase() ||
        e.id.toLowerCase() === code.toLowerCase()
    );
  }

  public createExam(examData: Omit<Exam, "id" | "createdAt" | "updatedAt">): Exam {
    const newExam: Exam = {
      ...examData,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.exams.unshift(newExam);
    return newExam;
  }

  public updateExam(id: string, updates: Partial<Exam>): Exam | undefined {
    const index = this.exams.findIndex((e) => e.id === id);
    if (index === -1) return undefined;
    this.exams[index] = {
      ...this.exams[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    return this.exams[index];
  }

  public deleteExam(id: string): boolean {
    const initialLength = this.exams.length;
    this.exams = this.exams.filter((e) => e.id !== id);
    return this.exams.length < initialLength;
  }

  // Submissions
  public getSubmissions(): Submission[] {
    return this.submissions;
  }

  public getSubmissionById(id: string): Submission | undefined {
    return this.submissions.find((s) => s.id === id);
  }

  public getSubmissionsByExamId(examId: string): Submission[] {
    return this.submissions.filter((s) => s.examId === examId);
  }

  public getSubmissionsByStudentId(studentId: string): Submission[] {
    return this.submissions.filter((s) => s.studentId === studentId);
  }

  public createSubmission(submissionData: Omit<Submission, "id" | "submittedAt">): Submission {
    const newSubmission: Submission = {
      ...submissionData,
      id: `sub_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.submissions.unshift(newSubmission);
    return newSubmission;
  }

  public updateSubmissionEvaluation(
    submissionId: string,
    evaluation: EvaluationResult
  ): Submission | undefined {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub) return undefined;

    sub.evaluation = evaluation;
    sub.status = evaluation.hasLegibilityIssues ? "NEEDS_REVIEW" : "EVALUATED";
    return sub;
  }

  public updateTeacherMarks(
    submissionId: string,
    questionId: string,
    newMarks: number,
    remarks?: string
  ): Submission | undefined {
    const sub = this.submissions.find((s) => s.id === submissionId);
    if (!sub || !sub.evaluation) return undefined;

    const qEval = sub.evaluation.questionEvaluations.find((q) => q.questionId === questionId);
    if (qEval) {
      const diff = newMarks - qEval.awardedMarks;
      qEval.awardedMarks = newMarks;
      sub.evaluation.totalScore = Math.max(0, sub.evaluation.totalScore + diff);
      sub.evaluation.percentage = (sub.evaluation.totalScore / sub.evaluation.maxScore) * 100;
      if (remarks) {
        sub.evaluation.teacherRemarks = remarks;
      }
      sub.evaluation.isApprovedByTeacher = true;
    }
    return sub;
  }

  // AI Settings
  public getAISettings(): GlobalAISettings {
    return this.aiSettings;
  }

  public updateAISettings(updates: Partial<GlobalAISettings>): GlobalAISettings {
    this.aiSettings = {
      ...this.aiSettings,
      ...updates,
      providers: {
        ...this.aiSettings.providers,
        ...(updates.providers || {}),
      },
    };
    return this.aiSettings;
  }

  // Admin Authentication
  public validateAdmin(id: string, pass: string): boolean {
    const validId = process.env.ADMIN_ID || "admin";
    const validEmail = "admin@khata.ai";
    const validPass = process.env.ADMIN_PASSWORD || "admin123";

    return (
      (id.trim().toLowerCase() === validId.toLowerCase() ||
        id.trim().toLowerCase() === validEmail.toLowerCase()) &&
      pass === validPass
    );
  }
}

export const store = DataStore.getInstance();
