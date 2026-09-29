import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { store } from "@/lib/store";

export async function GET() {
  const cookieStore = await cookies();
  const session = cookieStore.get("khata_admin_session");
  const currentUser = store.getCurrentUser();

  const isAuthenticated = session?.value === "authenticated_admin" || currentUser?.role === "ADMIN";
  const adminUser = store.getAllUsers().find((u) => u.role === "ADMIN");

  return NextResponse.json({
    authenticated: isAuthenticated,
    user: isAuthenticated ? (currentUser || adminUser || null) : null,
  });
}
