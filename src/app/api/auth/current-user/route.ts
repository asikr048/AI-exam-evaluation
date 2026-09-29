import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const sessionUserId = cookieStore.get("khata_user_session")?.value;
  let currentUser = null;

  if (sessionUserId) {
    const user = store.getUserById(sessionUserId) || store.getAllUsers().find((u) => u.id === sessionUserId);
    if (user) {
      currentUser = user;
      store.setCurrentUser(user);
    }
  }

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
