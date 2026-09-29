import { cookies } from "next/headers";
import { store } from "@/lib/store";
import { User, InstitutionProfile } from "@/lib/types";

export interface SessionUserData {
  id: string;
  name: string;
  email: string;
  role: "STUDENT" | "TEACHER" | "ADMIN";
  institution?: string;
}

export function encodeSessionUser(user: User): string {
  const sessionData: SessionUserData = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    institution: user.institution,
  };
  return Buffer.from(JSON.stringify(sessionData)).toString("base64");
}

export function decodeSessionUser(encoded: string): SessionUserData | null {
  try {
    const json = Buffer.from(encoded, "base64").toString("utf-8");
    const data = JSON.parse(json);
    if (data && data.id && data.name && data.email && data.role) {
      return data as SessionUserData;
    }
    return null;
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const sessionDataCookie = cookieStore.get("khata_user_data")?.value;
  const sessionUserId = cookieStore.get("khata_user_session")?.value;

  // 1. Try restoring from stateless self-contained session cookie
  if (sessionDataCookie) {
    const decoded = decodeSessionUser(sessionDataCookie);
    if (decoded) {
      let user = store.getUserById(decoded.id);
      if (!user) {
        user = {
          id: decoded.id,
          name: decoded.name,
          email: decoded.email,
          role: decoded.role,
          institution: decoded.institution,
          password: "password123",
        };
        store.registerUserFromSession(user);
      }
      store.setCurrentUser(user);
      return user;
    }
  }

  // 2. Fallback to userId lookup in store
  if (sessionUserId) {
    const user = store.getUserById(sessionUserId) || store.getAllUsers().find((u) => u.id === sessionUserId);
    if (user) {
      store.setCurrentUser(user);
      return user;
    }
  }

  return store.getCurrentUser();
}
