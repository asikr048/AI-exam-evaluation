import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = store.getExamById(id);
  if (!exam) {
    return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true, exam });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const updated = store.updateExam(id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Exam not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, exam: updated });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = store.deleteExam(id);
  return NextResponse.json({ success: deleted });
}
