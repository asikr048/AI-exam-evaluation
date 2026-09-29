import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const userId = searchParams.get("userId");

  if (slug) {
    const inst = store.getInstitutionBySlug(slug);
    if (!inst) {
      return NextResponse.json({ success: false, error: "Institution not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, institution: inst });
  }

  if (userId) {
    const userInstitutions = store.getInstitutions().filter((i) => i.userId === userId);
    return NextResponse.json({
      success: true,
      institutions: userInstitutions,
      institution: userInstitutions[0] || null,
    });
  }

  const institutions = store.getInstitutions();
  return NextResponse.json({ success: true, institutions });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ success: false, error: "Name and Slug are required" }, { status: 400 });
    }

    const cookieStore = await cookies();
    const sessionUserId = cookieStore.get("khata_user_session")?.value;
    const currentUser = sessionUserId ? store.getUserById(sessionUserId) : store.getCurrentUser();

    const userId = body.userId || currentUser?.id || "usr_teacher_01";
    const contactEmail = body.contactEmail || currentUser?.email || "info@khata.ai";

    const institution = store.createOrUpdateInstitution({
      ...body,
      userId,
      contactEmail,
    });
    return NextResponse.json({ success: true, institution });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
