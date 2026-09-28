import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const exams = store.getExams();
  return NextResponse.json({ success: true, exams });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const currentUser = store.getCurrentUser();
    const newExam = store.createExam({
      ...body,
      creatorId: currentUser.id,
      creatorName: currentUser.name,
    });
    return NextResponse.json({ success: true, exam: newExam });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
