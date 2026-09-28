import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const submission = store.getSubmissionById(id);
  if (!submission) {
    return NextResponse.json({ success: false, error: "Submission not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, submission });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    // Support teacher manual adjustment of marks
    if (body.questionId && body.newMarks !== undefined) {
      const updated = store.updateTeacherMarks(id, body.questionId, body.newMarks, body.remarks);
      return NextResponse.json({ success: true, submission: updated });
    }

    return NextResponse.json({ success: false, error: "Invalid update request" }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
