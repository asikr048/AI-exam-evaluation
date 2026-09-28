import { NextResponse } from "next/server";
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
    const inst = store.getInstitutionByUserId(userId);
    return NextResponse.json({ success: true, institution: inst });
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

    const institution = store.createOrUpdateInstitution(body);
    return NextResponse.json({ success: true, institution });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
