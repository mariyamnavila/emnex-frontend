"use client";

import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { toast } from "sonner";
import { useGoogleLogin } from "@/hooks/auth.hook";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// "Continue with Google": renders Google's own button, gets an ID token and
// posts it to /auth/google. Renders nothing when no client ID is configured.
export function GoogleSignInButton() {
	const google = useGoogleLogin();

	if (!CLIENT_ID) return null;

	return (
		<GoogleOAuthProvider clientId={CLIENT_ID}>
			{/* GIS renders a light-themed button; keep it light in both schemes */}
			<div className="flex justify-center scheme-light">
				<GoogleLogin
					text="continue_with"
					shape="rectangular"
					theme="outline"
					size="large"
					width={360}
					onSuccess={({ credential }) => {
						if (credential) google.mutate(credential);
					}}
					onError={() => toast.error("Google sign-in failed")}
				/>
			</div>
		</GoogleOAuthProvider>
	);
}
