import type { Metadata } from "next";
import { CancelView } from "./cancel-view";

export const metadata: Metadata = {
	title: "Payment cancelled",
	robots: { index: false },
};

export default function PaymentCancelPage() {
	return <CancelView />;
}
