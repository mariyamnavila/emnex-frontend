export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#F8FAFC] dark:bg-[#0B1120]">
      {children}
    </div>
  );
}
