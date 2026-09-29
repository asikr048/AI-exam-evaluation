import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const examId = searchParams.get("examId");
  const studentId = searchParams.get("studentId");

  let submissions = store.getSubmissions();
  if (examId) {
    submissions = submissions.filter((s) => s.examId === examId);
  }
  if (studentId) {
    submissions = submissions.filter((s) => s.studentId === studentId);
  }

  return NextResponse.json({ success: true, submissions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentUser = store.getCurrentUser();
    const exam = store.getExamById(body.examId);

    if (!exam) {
      return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    }

    const newSubmission = store.createSubmission({
      examId: exam.id,
      examTitle: exam.title,
      subject: exam.subject,
      curriculumCode: exam.curriculumCode,
      studentId: body.studentId || currentUser?.id || `student_${Date.now()}`,
      studentName: body.studentName || currentUser?.name || "Student Examinee",
      studentRoll: body.studentRoll || currentUser?.institution || "Roll 101",
      studentEmail: body.studentEmail || currentUser?.email || "student@khata.ai",
      batchId: body.batchId || exam.batchId,
      batchName: body.batchName || exam.batchName,
      institutionSlug: body.institutionSlug || exam.institutionSlug,
      status: "PENDING_EVALUATION",
      answerSheetImages: body.answerSheetImages || [],
      answers: body.answers || {},
    });

    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
