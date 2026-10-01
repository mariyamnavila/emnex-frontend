"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white dark:border-[#1E293B] dark:bg-[#0F172A]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Lockup: Logo mark + EmNex wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
          aria-label="EmNex Homepage"
        >
          <Image
            src="/logo.png"
            alt="EmNex Logo"
            width={32}
            height={32}
            priority
            className="size-8 object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-[#0F172A] dark:text-white">
            Em<span className="text-[#2563EB]">Nex</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-7 md:flex" aria-label="Main Navigation">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "font-semibold text-[#2563EB]"
                    : "text-[#64748B] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:text-white"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTAs */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="hidden text-sm font-medium text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#CBD5E1] dark:hover:bg-[#1E293B] dark:hover:text-white md:inline-flex"
          >
            <Link href="/login">Log in</Link>
          </Button>

          <Button
            asChild
            size="sm"
            className="h-9 rounded-md bg-[#2563EB] px-4 text-sm font-medium text-white shadow-none transition-colors hover:bg-[#1D4ED8]"
          >
            <Link href="/register">Get started</Link>
          </Button>

          {/* Mobile Menu Trigger */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-9 rounded-md border border-[#E2E8F0] text-[#334155] hover:bg-[#F8FAFC] md:hidden dark:border-[#1E293B] dark:text-[#CBD5E1]"
                aria-label="Open navigation menu"
              >
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex w-72 flex-col justify-between bg-white p-6 dark:bg-[#0F172A]">
              <div className="space-y-6">
                <SheetHeader className="text-left">
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="EmNex Logo"
                      width={28}
                      height={28}
                      className="size-7 object-contain"
                    />
                    <span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">
                      Em<span className="text-[#2563EB]">Nex</span>
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex flex-col gap-1" aria-label="Mobile Navigation">
                  {NAV_LINKS.map((link) => {
                    const isActive = pathname === link.href;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-[#EFF6FF] font-semibold text-[#2563EB] dark:bg-[#1E293B]"
                            : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A] dark:text-[#94A3B8] dark:hover:bg-[#1E293B] dark:hover:text-white"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="space-y-3 pt-6">
                <Separator className="bg-[#E2E8F0] dark:bg-[#1E293B]" />
                <Button asChild variant="outline" className="w-full justify-center border-[#E2E8F0] text-[#334155]">
                  <Link href="/login" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                </Button>
                <Button asChild className="w-full justify-center bg-[#2563EB] text-white hover:bg-[#1D4ED8]">
                  <Link href="/register" onClick={() => setOpen(false)}>
                    Get started
                  </Link>
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
