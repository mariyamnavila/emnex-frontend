import Link from "next/link";
import Image from "next/image";

const FOOTER_SECTIONS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/features#workforce", label: "Workforce Management" },
      { href: "/features#projects", label: "Projects & Tasks" },
      { href: "/features#payroll", label: "Automated Payroll" },
      { href: "/pricing", label: "Pricing & Plans" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { href: "/features", label: "Field Operations" },
      { href: "/features", label: "Enterprise Teams" },
      { href: "/features", label: "Remote Workforce" },
      { href: "/features", label: "Role-Based Access" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About Us" },
      { href: "/about#team", label: "Leadership & Team" },
      { href: "/contact", label: "Contact Support" },
      { href: "/pricing#faq", label: "Help & FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { href: "#", label: "Privacy Policy" },
      { href: "#", label: "Terms of Service" },
      { href: "#", label: "Security Overview" },
      { href: "#", label: "Compliance & GDPR" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-[#F8FAFC] dark:border-[#1E293B] dark:bg-[#0B1120]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Brand info column */}
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

            <p className="max-w-sm text-sm leading-relaxed text-[#64748B] dark:text-[#94A3B8]">
              Workforce and field service management software. Streamlining project tracking,
              employee assignments, and automated payroll in a single unified platform.
            </p>

            <div className="pt-2">
              <div className="inline-flex items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-3 py-1 text-xs font-medium text-[#64748B] dark:border-[#1E293B] dark:bg-[#0F172A] dark:text-[#94A3B8]">
                <span className="size-2 rounded-full bg-[#16A34A]" />
                <span>All systems operational</span>
              </div>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-3">
            {FOOTER_SECTIONS.map((section) => (
              <div key={section.title} className="space-y-3">
                <p className="text-xs font-semibold tracking-wider text-[#0F172A] uppercase dark:text-white">
                  {section.title}
                </p>
                <ul className="space-y-2.5">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-[#64748B] transition-colors hover:text-[#2563EB] dark:text-[#94A3B8] dark:hover:text-[#2563EB]"
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

        {/* Bottom copyright & details bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row dark:border-[#1E293B]">
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            © {new Date().getFullYear()} EmNex Technologies Inc. All rights reserved.
          </p>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Enterprise Workforce & Field Service Management
          </p>
        </div>
      </div>
    </footer>
  );
}
