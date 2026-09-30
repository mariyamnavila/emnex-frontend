import Link from "next/link";
import Image from "next/image";

const FOOTER_LINKS = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/login", label: "Log in" },
      { href: "/register", label: "Get started" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:flex-row md:justify-between">
        <div className="max-w-xs space-y-3">
          <Link href="/" className="flex items-center">
            <Image
              src="/logoImage.png"
              alt="EmNex"
              width={82}
              height={28}
              className="h-7 w-auto"
            />
          </Link>
          <p className="text-sm text-muted-foreground">
            Workforce management software for modern teams — employees, projects, tasks
            and payroll in one place.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {FOOTER_LINKS.map((column) => (
            <div key={column.title} className="space-y-3">
              <p className="text-sm font-medium text-foreground">{column.title}</p>
              <ul className="space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
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
      <div className="border-t border-border py-4">
        <p className="mx-auto max-w-6xl px-4 text-sm text-muted-foreground">
          © {new Date().getFullYear()} EmNex. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
