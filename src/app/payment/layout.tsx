import Image from "next/image";
import Link from "next/link";

export default function PaymentLayout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex min-h-svh flex-col bg-[#F8FAFC] dark:bg-[#0B1120]">
			<header className="flex h-16 items-center px-4 sm:px-6">
				<Link href="/" className="flex items-center gap-2.5" aria-label="EmNex home">
					<Image src="/logo.png" alt="" width={28} height={28} className="size-7 object-contain" />
					<span className="text-lg font-bold tracking-tight text-[#0F172A] dark:text-white">
						Em<span className="text-[#2563EB]">Nex</span>
					</span>
				</Link>
			</header>
			<main className="flex flex-1 justify-center px-4 pt-4 pb-16 sm:items-center sm:pt-0">
				<div className="w-full max-w-lg">{children}</div>
			</main>
		</div>
	);
}
