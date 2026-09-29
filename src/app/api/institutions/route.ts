import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getAuthenticatedUser } from "@/lib/server-auth";
import { store, SEED_INSTITUTIONS } from "@/lib/store";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const userId = searchParams.get("userId");

  const cookieStore = await cookies();
  const customInstCookie = cookieStore.get("khata_custom_institutions")?.value;
  if (customInstCookie) {
    try {
      const parsed = JSON.parse(Buffer.from(customInstCookie, "base64").toString("utf-8"));
      if (Array.isArray(parsed)) {
        store.syncCustomInstitutions(parsed);
      }
    } catch {}
  }

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

    const currentUser = await getAuthenticatedUser();
    const userId = body.userId || currentUser?.id || "usr_teacher_01";
    const contactEmail = body.contactEmail || currentUser?.email || "info@khata.ai";

    const institution = store.createOrUpdateInstitution({
      ...body,
      userId,
      contactEmail,
    });

    const response = NextResponse.json({ success: true, institution });

    // Store custom institutions in cookie for cross-lambda persistence
    const userInsts = store.getInstitutions().filter((i) => !SEED_INSTITUTIONS.some((s) => s.id === i.id));
    if (userInsts.length > 0) {
      response.cookies.set("khata_custom_institutions", Buffer.from(JSON.stringify(userInsts)).toString("base64"), {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });
    }

    return response;
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
