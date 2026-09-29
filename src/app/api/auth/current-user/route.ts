import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("khata_user_session")?.value;

  if (sessionUserId) {
    const user = store.getAllUsers().find((u) => u.id === sessionUserId);
    if (user) {
      store.setCurrentUser(user);
    }
  }

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
