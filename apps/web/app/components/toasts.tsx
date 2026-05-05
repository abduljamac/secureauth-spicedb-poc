"use client";

import { useApp } from "../providers/app-provider";

export function Toasts() {
	const { toasts, dismissToast } = useApp();
	if (toasts.length === 0) return null;
	return (
		<div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
			{toasts.map((t) => {
				const styles =
					t.kind === "error"
						? "bg-gradient-to-b from-rose-500 to-rose-600 ring-rose-700/30"
						: t.kind === "success"
							? "bg-gradient-to-b from-emerald-500 to-emerald-600 ring-emerald-700/30"
							: "bg-gradient-to-b from-slate-800 to-slate-900 ring-slate-950/40";
				return (
					<div
						key={t.id}
						className={`flex items-center gap-3 ${styles} text-white px-4 py-2.5 rounded-xl text-sm min-w-[260px] max-w-[380px] shadow-lg ring-1`}
					>
						<span>{t.text}</span>
						<button
							type="button"
							onClick={() => dismissToast(t.id)}
							aria-label="Dismiss"
							className="ml-auto text-white/70 hover:text-white text-base leading-none"
						>
							×
						</button>
					</div>
				);
			})}
		</div>
	);
}
