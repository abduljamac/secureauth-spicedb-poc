"use client";

import { DEV_USERS } from "../lib/dev-users";
import { useApp } from "../providers/app-provider";

const AVATAR_COLORS: Record<string, string> = {
	alice: "bg-rose-100 text-rose-700",
	bob: "bg-sky-100 text-sky-700",
	charlie: "bg-amber-100 text-amber-700",
};

export function DevUserSwitcher() {
	const { currentUserId, setCurrentUserId } = useApp();
	return (
		<div className="flex items-center gap-3">
			<span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
				Acting as
			</span>
			<div className="flex items-center gap-1 p-1 bg-slate-100 rounded-full ring-1 ring-slate-200">
				{DEV_USERS.map((u) => {
					const active = u.id === currentUserId;
					const avatarColor =
						AVATAR_COLORS[u.id] ?? "bg-slate-200 text-slate-700";
					return (
						<button
							key={u.id}
							type="button"
							onClick={() => setCurrentUserId(u.id)}
							className={
								"flex items-center gap-2 pl-1 pr-3 py-1 rounded-full text-sm font-medium " +
								(active
									? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
									: "text-slate-500 hover:text-slate-800")
							}
						>
							<span
								className={
									"flex items-center justify-center size-6 rounded-full text-[11px] font-semibold " +
									avatarColor
								}
							>
								{u.label.slice(0, 1)}
							</span>
							{u.label}
						</button>
					);
				})}
			</div>
			<code
				className="hidden md:inline-flex text-[11px] text-slate-500 bg-slate-50 px-2.5 py-1 rounded-md font-mono ring-1 ring-slate-200"
				title="Sent on every API request"
			>
				X-Dev-User-Id: {currentUserId}
			</code>
		</div>
	);
}
