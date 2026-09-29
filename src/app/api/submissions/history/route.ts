import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const studentIdParam = searchParams.get("studentId");

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("khata_user_session")?.value;
    const user = sessionUserId ? store.getUserById(sessionUserId) : store.getCurrentUser();
    const targetId = studentIdParam || user?.id || user?.email;

    if (!targetId) {
      return NextResponse.json({
        success: true,
        submissions: [],
      });
    }

    // Fetch submissions matching studentId, email, or user
    let submissions = store.getSubmissionsForStudent(targetId);

    if (submissions.length === 0 && user?.email) {
      submissions = store.getSubmissionsForStudent(user.email);
    }

    return NextResponse.json({
      success: true,
      submissions,
    });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
