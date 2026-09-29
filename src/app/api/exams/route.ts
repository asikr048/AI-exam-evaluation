import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET() {
  const exams = store.getExams();
  return NextResponse.json({ success: true, exams });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("khata_user_session")?.value;
    const currentUser = sessionUserId ? store.getUserById(sessionUserId) : store.getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { success: false, error: "Please sign in to create an exam." },
        { status: 401 }
      );
    }

    // Strict ownership verification: if creating an exam under an institution, user must own it or be admin
    if (body.institutionSlug) {
      const institution = store.getInstitutionBySlug(body.institutionSlug);
      if (institution) {
        const isOwner = currentUser.role === "ADMIN" || institution.userId === currentUser.id;
        if (!isOwner) {
          return NextResponse.json(
            {
              success: false,
              error: `Unauthorized: Only the creator of '${institution.name}' can create exams in this institution.`,
            },
            { status: 403 }
          );
        }
      }
    }

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
