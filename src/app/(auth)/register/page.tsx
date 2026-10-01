import type { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create a new EmNex organization and admin account",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
