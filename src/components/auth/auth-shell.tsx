import type { LucideIcon } from "lucide-react";
import { FileCheck, Lock, ShieldCheck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

interface Feature {
  icon: LucideIcon;
  title: string;
  desc: string;
}

interface AuthShellProps {
  eyebrow: string;
  headline: ReactNode;
  subtext: string;
  features: Feature[];
  /** The "other" action, e.g. { prompt: "Don't have an account?", label: "Sign up", href: "/register" } */
  alt: { prompt: string; label: string; href: string };
  children: ReactNode;
}

const TRUST = [
  { icon: ShieldCheck, label: "Role-based access" },
  { icon: Lock, label: "SSL encrypted" },
  { icon: FileCheck, label: "Audit logged" },
];

const Wordmark = ({ size = "text-2xl" }: { size?: string }) => (
  <span className={`${size} font-bold tracking-tight text-white`}>
    Em<span className="text-[#60A5FA]">Nex</span>
  </span>
);

export function AuthShell({ eyebrow, headline, subtext, features, alt, children }: AuthShellProps) {
  return (
    <div className="flex min-h-svh w-full bg-white dark:bg-[#0B1120]">
      {/* Brand panel */}
      <aside className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-[#0B1120] p-12 text-white lg:flex xl:p-16">
        {/* Animated aurora */}
        <div className="pointer-events-none absolute inset-0 -z-0">
          <div className="animate-aurora absolute -top-24 -left-16 size-[28rem] rounded-full bg-[#2563EB]/35 blur-[90px]" />
          <div className="animate-aurora absolute top-1/3 -right-20 size-[26rem] rounded-full bg-[#6366F1]/30 blur-[90px] [animation-delay:-7s]" />
          <div className="animate-aurora absolute -bottom-24 left-1/4 size-[24rem] rounded-full bg-[#06B6D4]/20 blur-[90px] [animation-delay:-14s]" />
        </div>
        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-0 opacity-[0.04]"
          style={{ backgroundImage: "radial-gradient(#fff 1px, transparent 1px)", backgroundSize: "26px 26px" }}
        />

        <div className="relative z-10 animate-in fade-in slide-in-from-top-2 duration-700">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15 backdrop-blur">
              <Image src="/logo.png" alt="EmNex" width={22} height={22} priority className="size-5.5 object-contain" />
            </span>
            <Wordmark />
          </Link>
          <p className="mt-2.5 text-xs font-medium tracking-wide text-slate-400">
            Workforce &amp; Field Operations SaaS
          </p>
        </div>

        <div className="relative z-10 max-w-lg animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <span className="text-[11px] font-semibold tracking-[0.2em] text-[#60A5FA] uppercase">{eyebrow}</span>
          <h2 className="mt-3 text-3xl leading-[1.15] font-bold tracking-tight text-white xl:text-[2.6rem]">
            {headline}
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-400">{subtext}</p>

          <div className="animate-float-slow mt-8 space-y-3 rounded-2xl border border-white/10 bg-white/[0.06] p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] backdrop-blur-sm">
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="flex items-start gap-3.5">
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#2563EB] to-[#4F46E5] text-white shadow-[0_6px_16px_-6px_rgba(37,99,235,0.8)]">
                    <Icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{f.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{f.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/10 pt-6 text-xs text-slate-400">
          {TRUST.map((t) => {
            const Icon = t.icon;
            return (
              <span key={t.label} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5 text-[#60A5FA]" />
                {t.label}
              </span>
            );
          })}
        </div>
      </aside>

      {/* Form panel */}
      <main className="flex w-full flex-col justify-between px-6 py-8 sm:px-12 lg:w-1/2 lg:px-16 dark:bg-[#0F172A]">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 lg:invisible">
            <Image src="/logo.png" alt="EmNex" width={26} height={26} className="size-6.5 object-contain" />
            <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">
              Em<span className="text-[#2563EB]">Nex</span>
            </span>
          </Link>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            {alt.prompt}{" "}
            <Link href={alt.href} className="font-semibold text-[#2563EB] hover:underline dark:text-[#60A5FA]">
              {alt.label}
            </Link>
          </p>
        </div>

        <div className="mx-auto w-full max-w-[26rem] py-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>

        <div className="flex flex-col items-center justify-between gap-2 border-t border-[#E2E8F0] pt-6 text-xs text-[#64748B] sm:flex-row dark:border-[#1E293B] dark:text-[#94A3B8]">
          <p>© {new Date().getFullYear()} EmNex Technologies Inc.</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-[#2563EB] hover:underline">About</Link>
            <Link href="/contact" className="hover:text-[#2563EB] hover:underline">Support</Link>
            <Link href="/pricing#faq" className="hover:text-[#2563EB] hover:underline">FAQ</Link>
          </div>
        </div>
      </main>
    </div>
  );
}
