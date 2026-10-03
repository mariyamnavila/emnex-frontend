import { cookies } from "next/headers";
import { jwtVerify } from "jose";

// Server only: reads the backend's accessToken cookie (same check as proxy.ts)
export interface SessionUser {
	userId: string;
	name: string;
	email: string;
	role: string;
	organizationId: string;
}

const secret = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

// The shadcn sidebar stores its collapsed state in this cookie
export async function getSidebarOpen(): Promise<boolean> {
	return (await cookies()).get("sidebar_state")?.value !== "false";
}

export async function getSessionUser(): Promise<SessionUser | null> {
	const token = (await cookies()).get("accessToken")?.value;
	if (!token) return null;

	try {
		const { payload } = await jwtVerify(token, secret);
		if (typeof payload.userId !== "string" || typeof payload.role !== "string") return null;
		return {
			userId: payload.userId,
			name: String(payload.name ?? ""),
			email: String(payload.email ?? ""),
			role: payload.role,
			organizationId: String(payload.organizationId ?? ""),
		};
	} catch {
		return null;
	}
}
