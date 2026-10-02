const LOGO_COMPANIES = [
  { name: "AeroCorp Logistics", label: "AEROCORP" },
  { name: "Vertex Energy Systems", label: "VERTEX ENERGY" },
  { name: "Apex Global Facilities", label: "APEX GLOBAL" },
  { name: "Meridian Field Health", label: "MERIDIAN" },
  { name: "OmniFleet Networks", label: "OMNIFLEET" },
  { name: "TerraCore Infrastructure", label: "TERRACORE" },
];

export function LogoCloud() {
  return (
    <section className="border-b border-[#E2E8F0] bg-white px-4 py-10 sm:px-6 lg:px-8 dark:border-[#1E293B] dark:bg-[#0F172A]">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-xs font-semibold tracking-wider text-[#64748B] uppercase dark:text-[#94A3B8]">
          Trusted by mission-critical enterprise operations & field networks
        </p>
        <div className="mt-6 grid grid-cols-2 items-center justify-center gap-4 sm:grid-cols-3 md:grid-cols-6">
          {LOGO_COMPANIES.map((company) => (
            <div
              key={company.name}
              className="flex items-center justify-center rounded-md border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-2 text-center text-xs font-bold tracking-wider text-[#475569] dark:border-[#1E293B] dark:bg-[#0B1120] dark:text-[#94A3B8]"
            >
              {company.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
