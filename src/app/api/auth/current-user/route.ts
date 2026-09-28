import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  const currentUser = store.getCurrentUser();
  const allUsers = store.getAllUsers();
  return NextResponse.json({ success: true, currentUser, allUsers });
}

export async function POST(req: Request) {
  try {
    const { role } = await req.json();
    store.setCurrentUser(role);
    const updatedUser = store.getCurrentUser();
    return NextResponse.json({ success: true, currentUser: updatedUser });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
