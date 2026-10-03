"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SessionUser } from "@/lib/session";

// The user decoded from the JWT on the server — available on first paint,
// before /auth/me answers. /auth/me stays the source of truth.
const SessionContext = createContext<SessionUser | null>(null);

export function SessionProvider({
	session,
	children,
}: {
	session: SessionUser | null;
	children: ReactNode;
}) {
	return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}

export function useSession() {
	return useContext(SessionContext);
}
