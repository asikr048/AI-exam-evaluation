import { DEFAULT_AI_SETTINGS, DEMO_USERS, EXAM_TYPES } from "./constants";
import { SEED_EXAMS, SEED_SUBMISSIONS } from "./seed-data";
import {
  EvaluationResult,
  Exam,
  GlobalAISettings,
  Question,
  Submission,
  User,
} from "./types";

// In-memory data store with singleton pattern for client & serverless persistence
class DataStore {
  private static instance: DataStore;
  private users: User[] = [...DEMO_USERS];
  private currentUser: User = DEMO_USERS[1]; // default to Tahmid Hasan (Student) or Teacher
  private exams: Exam[] = [...SEED_EXAMS];
  private submissions: Submission[] = [...SEED_SUBMISSIONS];
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

  // Exams
  public getExams(): Exam[] {
    return this.exams;
  }

  public getExamById(id: string): Exam | undefined {
    return this.exams.find((e) => e.id === id);
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

  public updateProviderKey(provider: string, apiKey: string, selectedModelId?: string): void {
    if (this.aiSettings.providers[provider]) {
      this.aiSettings.providers[provider].apiKey = apiKey;
      if (selectedModelId) {
        this.aiSettings.providers[provider].selectedModelId = selectedModelId;
      }
      this.aiSettings.providers[provider].isActive = true;
    }
  }
}

export const store = DataStore.getInstance();
