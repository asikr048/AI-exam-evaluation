import { NextResponse } from "next/server";
import { AIEvaluationGateway } from "@/lib/ai/gateway";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { submissionId, examId, answers, answerSheetImages } = body;

    let submission = submissionId ? store.getSubmissionById(submissionId) : null;
    let exam = examId ? store.getExamById(examId) : null;

    if (!exam && submission) {
      exam = store.getExamById(submission.examId);
    }

    if (!exam) {
      return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    }

    // If standalone evaluation (sandbox demo)
    if (!submission) {
      const currentUser = store.getCurrentUser();
      submission = store.createSubmission({
        examId: exam.id,
        examTitle: exam.title,
        subject: exam.subject,
        curriculumCode: exam.curriculumCode,
        studentId: currentUser?.id || "guest_evaluator",
        studentName: currentUser?.name || "Independent Examinee",
        status: "EVALUATING",
        answerSheetImages: answerSheetImages || [],
        answers: answers || {},
      });
    }

    const evaluation = await AIEvaluationGateway.evaluateSubmission({
      exam,
      submission,
      imageUrls: submission.answerSheetImages,
    });

    const updatedSubmission = store.updateSubmissionEvaluation(submission.id, evaluation);

    return NextResponse.json({
      success: true,
      evaluation,
      submission: updatedSubmission,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
