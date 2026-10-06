import type { Metadata } from "next";
import {
  HeroSection,
  LogoCloud,
  StatsRibbon,
  CoreEngines,
  RoleShowcase,
  TestimonialsSection,
  SecuritySection,
  FaqSection,
  CtaBanner,
} from "@/components/landing";
import { Reveal } from "@/components/landing/reveal";

export const metadata: Metadata = {
  title: "EmNex | Enterprise Workforce & Field Operations Platform",
  description:
    "The unified corporate operating system for enterprise workforce management, field project dispatch, deliverable approvals, and automated Stripe payroll.",
  openGraph: {
    title: "EmNex Enterprise Workforce & Field Operations",
    description:
      "Precision workforce hierarchy, project dispatch, deliverable verification, and automated payroll with granular RBAC governance.",
    type: "website",
    url: "https://emnex.vercel.app",
  },
};

export default function Home() {
  return (
    <div className="flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
      <HeroSection />
      <Reveal><LogoCloud /></Reveal>
      <Reveal><StatsRibbon /></Reveal>
      <Reveal><CoreEngines /></Reveal>
      <Reveal><RoleShowcase /></Reveal>
      <Reveal><TestimonialsSection /></Reveal>
      <Reveal><SecuritySection /></Reveal>
      <Reveal><FaqSection /></Reveal>
      <Reveal><CtaBanner /></Reveal>
    </div>
  );
}
