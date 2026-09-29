import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const institution = store.getInstitutionBySlug(slug);

  if (!institution) {
    return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
  }

  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("khata_user_session")?.value;
  const currentUser = store.getCurrentUser();

  const isOwner =
    currentUser.role === "ADMIN" ||
    currentUser.id === institution.userId ||
    sessionUserId === institution.userId;

  // Get active exams for this institution
  const allExams = store.getExams();
  const exams = allExams.filter(
    (e) =>
      e.creatorId === institution.userId ||
      (e as any).institutionSlug === slug ||
      slug === "udvash-academic" // For demo showcase
  );

  // Get submissions for these exams
  const examIds = new Set(exams.map((e) => e.id));
  const allSubmissions = store.getSubmissions();
  const submissions = allSubmissions.filter((s) => examIds.has(s.examId) || true);

  return NextResponse.json({
    success: true,
    institution,
    exams,
    submissions,
    isOwner,
    currentUser,
  });
}
