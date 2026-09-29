import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST() {
  // Revert persona to default student
  store.setCurrentUser("STUDENT");

  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Expire cookies
  response.cookies.set("khata_user_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  response.cookies.set("khata_admin_session", "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  return response;
}
