import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/providers/query.provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "EmNex — Workforce Management Software",
    template: "%s | EmNex",
  },
  description:
    "EmNex is a modern workforce management platform for teams — employees, projects, tasks, work submissions, payroll and payments in one place.",
  keywords: [
    "workforce management",
    "employee management",
    "payroll",
    "project management",
    "HR software",
  ],
  openGraph: {
    title: "EmNex — Workforce Management Software",
    description:
      "Manage employees, projects, tasks, submissions and payroll in one modern SaaS platform.",
    type: "website",
    siteName: "EmNex",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
