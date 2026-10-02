import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

const SECURITY_STANDARDS = [
  {
    title: "SOC 2 Type II Architecture",
    desc: "Strict logical separation of tenant data, encryption at rest with AES-256, and verified data integrity.",
  },
  {
    title: "Granular 43-Permission RBAC",
    desc: "Every database query and API mutation is validated against user permission masks at middleware & controller boundaries.",
  },
  {
    title: "End-to-End TLS 1.3 Transport",
    desc: "All client-to-server communications and Stripe payment transactions enforce modern cryptographic transport ciphers.",
  },
  {
    title: "Immutable Operational Audits",
    desc: "Actor identification, timestamp, IP, entity type, and delta states logged for strict corporate compliance reviews.",
  },
];

export function SecuritySection() {
  return (
    <section className="border-t border-[#E2E8F0] bg-white px-4 py-20 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <span className="text-xs font-semibold tracking-wider text-[#2563EB] uppercase">
              Defense-Grade Trust
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-[#0F172A] sm:text-3xl dark:text-white">
              Enterprise security built directly into the schema
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              Every single query, state mutation, and API call executes through authenticated JWT
              verification, role permission masks, and immutable audit logs.
            </p>
            <div className="mt-6">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#CBD5E1] bg-white text-xs font-semibold text-[#0F172A] hover:bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-white"
              >
                <Link href="/about#security">Review security architecture</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-8">
            {SECURITY_STANDARDS.map((sec) => (
              <div
                key={sec.title}
                className="rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-5 dark:border-[#1E293B] dark:bg-[#0B1120]"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="size-4 text-[#16A34A]" />
                  <h3 className="text-sm font-bold text-[#0F172A] dark:text-white">
                    {sec.title}
                  </h3>
                </div>
                <p className="mt-2 text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
                  {sec.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
