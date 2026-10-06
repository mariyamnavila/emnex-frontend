import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Tone = "blue" | "red" | "amber";

const TONES: Record<Tone, { text: string; glow: string; ring: string; chip: string }> = {
  blue: {
    text: "text-[#2563EB] dark:text-[#60A5FA]",
    glow: "bg-[#2563EB]/30",
    ring: "ring-[#2563EB]/20",
    chip: "bg-[#EFF6FF] text-[#2563EB] dark:bg-[#1E293B] dark:text-[#60A5FA]",
  },
  red: {
    text: "text-[#DC2626] dark:text-[#F87171]",
    glow: "bg-[#DC2626]/25",
    ring: "ring-[#DC2626]/20",
    chip: "bg-[#FEF2F2] text-[#DC2626] dark:bg-[#450A0A] dark:text-[#F87171]",
  },
  amber: {
    text: "text-[#D97706] dark:text-[#FBBF24]",
    glow: "bg-[#D97706]/25",
    ring: "ring-[#D97706]/20",
    chip: "bg-[#FEF3C7] text-[#B45309] dark:bg-[#422006] dark:text-[#FBBF24]",
  },
};

interface StatusScreenProps {
  code: string;
  icon: LucideIcon;
  tone?: Tone;
  title: string;
  message: string;
  detail?: ReactNode;
  actions: ReactNode;
  /** Rendered inside the dashboard shell (drops the logo, shorter height) */
  embedded?: boolean;
}

export function StatusScreen({ code, icon: Icon, tone = "blue", title, message, detail, actions, embedded = false }: StatusScreenProps) {
  const t = TONES[tone];
  return (
    <div
      className={cn(
        "relative flex w-full flex-col items-center justify-center overflow-hidden px-6 py-16 text-center",
        embedded ? "min-h-[72vh]" : "min-h-svh bg-[#F8FAFC] dark:bg-[#0B1120]",
      )}
    >
      {/* Ambient background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,#E2E8F0_1px,transparent_1px),linear-gradient(to_bottom,#E2E8F0_1px,transparent_1px)] bg-size-[3.5rem_3.5rem] opacity-40 mask-[radial-gradient(ellipse_55%_45%_at_50%_45%,#000_60%,transparent_100%)] dark:bg-[linear-gradient(to_right,#1E293B_1px,transparent_1px),linear-gradient(to_bottom,#1E293B_1px,transparent_1px)] dark:opacity-25"
      />
      <div className={cn("animate-aurora pointer-events-none absolute left-1/2 top-1/3 -z-10 size-120 -translate-x-1/2 rounded-full blur-[110px]", t.glow)} />

      {embedded ? null : (
        <Link href="/" className="absolute top-6 left-6 flex items-center gap-2">
          <Image src="/logo.png" alt="EmNex" width={22} height={22} className="size-5.5 object-contain" />
          <span className="text-base font-bold tracking-tight text-[#0F172A] dark:text-white">
            Em<span className="text-[#2563EB]">Nex</span>
          </span>
        </Link>
      )}

      <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col items-center duration-700">
        <div className={cn("animate-float-slow relative flex size-20 items-center justify-center rounded-2xl bg-white shadow-[0_20px_60px_-20px_rgba(15,23,42,0.35)] ring-1 dark:bg-[#0F172A]", t.ring)}>
          <Icon className={cn("size-9", t.text)} />
          <span className={cn("absolute -inset-2 -z-10 rounded-3xl opacity-40 blur-xl", t.glow)} />
        </div>

        <p className={cn("mt-7 text-6xl font-black tracking-tight tabular-nums sm:text-7xl", t.text)}>{code}</p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] dark:text-white">{title}</h1>
        <p className="mt-2.5 max-w-md text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">{message}</p>

        {detail ? <div className="mt-4">{detail}</div> : null}

        <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row">{actions}</div>
      </div>
    </div>
  );
}
