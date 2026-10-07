import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Lock } from "lucide-react";

const FOOTER_SECTIONS = [
  {
    title: "Platform Modules",
    links: [
      { href: "/features", label: "Capabilities Overview" },
      { href: "/features#workforce", label: "Workforce & Organization" },
      { href: "/features#projects", label: "Project & Task Dispatch" },
      { href: "/features#submissions", label: "Deliverable Approvals" },
      { href: "/features#payroll", label: "Automated Stripe Payroll" },
      { href: "/features#rbac", label: "44-Permission RBAC" },
    ],
  },
  {
    title: "Corporate Workspaces",
    links: [
      { href: "/login", label: "Executive Admin Console" },
      { href: "/login", label: "Operations Manager Suite" },
      { href: "/login", label: "Field Specialist Portal" },
      { href: "/pricing", label: "Tier Comparison Matrix" },
      { href: "/pricing#faq", label: "Pricing & Invoicing FAQ" },
    ],
  },
  {
    title: "Organization",
    links: [
      { href: "/about", label: "Mission & Philosophy" },
      { href: "/about#team", label: "Leadership & Advisory" },
      { href: "/about#security", label: "Security & Infrastructure" },
      { href: "/contact", label: "Solutions & Sales Desk" },
      { href: "/contact", label: "Operations Support SLAs" },
    ],
  },
  {
    title: "Trust & Governance",
    links: [
      { href: "/about#security", label: "SOC 2 Type II Architecture" },
      { href: "/about#security", label: "ISO/IEC 27001 Controls" },
      { href: "/features#audit", label: "Immutable Audit Trails" },
      { href: "/pricing", label: "99.99% Uptime SLA Terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-6 lg:gap-12">
          {/* Brand info column (2 cols) */}
          <div className="space-y-4 lg:col-span-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2.5 transition-opacity hover:opacity-90"
              aria-label="EmNex Homepage"
            >
              <Image
                src="/logo.png"
                alt="EmNex Logo"
                width={32}
                height={32}
                className="size-8 object-contain"
              />
              <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
                Em<span className="text-[#2563EB]">Nex</span>
              </span>
            </Link>

            <p className="max-w-sm text-xs leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              The authoritative enterprise operating system for workforce hierarchy, field project
              dispatch, deliverable verification, and automated Stripe payroll settlements.
            </p>

            {/* Operational Status Badges */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334155] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#CBD5E1]">
                <span className="size-2 rounded-full bg-[#16A34A]" />
                <span>All Systems Operational (99.99%)</span>
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[11px] font-medium text-[#334155] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#CBD5E1]">
                <ShieldCheck className="size-3 text-[#2563EB]" />
                <span>SOC 2 Type II &bull; ISO 27001</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Columns (4 cols) */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-4">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs font-semibold tracking-wider text-[#0F172A] uppercase dark:text-white">
                  {section.title}
                </p>
                <ul className="space-y-2">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-xs text-[#64748B] transition-colors hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#2563EB]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom copyright & compliance bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row dark:border-[#1E293B]">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            &copy; {new Date().getFullYear()} EmNex Technologies Inc. All rights reserved. Enterprise Workforce & Field Operations.
          </p>
          <div className="flex items-center gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
            <span className="inline-flex items-center gap-1">
              <Lock className="size-3 text-[#16A34A]" />
              TLS 1.3 &bull; AES-256 Encrypted
            </span>
            <span>&bull;</span>
            <span>Stripe Verified Integration</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
