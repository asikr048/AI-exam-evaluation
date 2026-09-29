import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get("studentId");

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("khata_user_session")?.value;
    const currentUser = store.getCurrentUser();

    const targetId = studentIdParam || sessionUserId || currentUser.id;

    // Fetch submissions matching studentId, email, or user
    const submissions = store.getSubmissionsForStudent(targetId);

    // If empty and current user is default demo student, also check studentEmail
    if (submissions.length === 0 && currentUser.email) {
      const emailMatches = store.getSubmissionsForStudent(currentUser.email);
      return NextResponse.json({
        success: true,
        submissions: emailMatches.length > 0 ? emailMatches : store.getSubmissions(),
      });
    }

    return NextResponse.json({
      success: true,
      submissions: submissions.length > 0 ? submissions : store.getSubmissions(),
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
