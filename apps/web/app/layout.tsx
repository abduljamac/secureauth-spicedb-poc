import type { ReactNode } from "react";
import { AppProvider } from "./providers/app-provider";
import "./globals.css";

export const metadata = {
	title: "Todos",
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<AppProvider>{children}</AppProvider>
			</body>
		</html>
	);
}
