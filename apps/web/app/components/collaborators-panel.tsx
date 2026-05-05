"use client";

import type { Collaborator, TodoList } from "../lib/types";

type CollaboratorsPanelProps = {
	list: TodoList;
	collaborators: Collaborator[];
	onOpenManage: () => void;
};

const AVATAR_PALETTE = [
	"bg-rose-100 text-rose-700",
	"bg-sky-100 text-sky-700",
	"bg-amber-100 text-amber-700",
	"bg-emerald-100 text-emerald-700",
	"bg-violet-100 text-violet-700",
	"bg-pink-100 text-pink-700",
];

function avatarColor(id: string) {
	let hash = 0;
	for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
	return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export function CollaboratorsPanel({
	list,
	collaborators,
	onOpenManage,
}: CollaboratorsPanelProps) {
	const canManage = list.can?.manage !== false;

	return (
		<section className="border border-slate-200 rounded-xl bg-white p-5 flex flex-col gap-4 shadow-sm">
			<div className="flex items-start justify-between gap-3">
				<div>
					<h3 className="text-sm font-semibold text-slate-900">Collaborators</h3>
					<p className="text-xs text-slate-500 mt-0.5">
						{collaborators.length === 0
							? "Just you so far."
							: `${collaborators.length} ${
									collaborators.length === 1 ? "person has" : "people have"
								} access.`}
					</p>
				</div>
				{canManage ? (
					<button
						type="button"
						onClick={onOpenManage}
						className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-md shadow-sm ring-1 ring-indigo-700/20"
					>
						Manage
					</button>
				) : (
					<span className="text-[11px] font-medium text-slate-500 px-2.5 py-1 bg-slate-100 ring-1 ring-slate-200 rounded-full">
						View only
					</span>
				)}
			</div>

			{collaborators.length > 0 ? (
				<ul className="flex flex-wrap gap-2">
					{collaborators.map((c) => (
						<li
							key={c.id}
							className="inline-flex items-center gap-2 pl-1 pr-3 py-1 bg-slate-50 ring-1 ring-slate-200 rounded-full text-xs"
						>
							<span
								className={
									"flex items-center justify-center size-6 rounded-full text-[10px] font-semibold " +
									avatarColor(c.id)
								}
							>
								{c.id.slice(0, 2).toUpperCase()}
							</span>
							<span className="font-medium text-slate-800">{c.id}</span>
							{c.role ? (
								<span className="text-slate-500 capitalize">· {c.role}</span>
							) : null}
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}
