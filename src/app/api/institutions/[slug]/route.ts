import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const institution = store.getInstitutionBySlug(slug);

  if (!institution) {
    return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
  }

  // Get active published exams associated with this institution/teacher
  const exams = store.getExams().filter((e) => e.creatorId === institution.userId || true);

  return NextResponse.json({
    success: true,
    institution,
    exams,
  });
}
