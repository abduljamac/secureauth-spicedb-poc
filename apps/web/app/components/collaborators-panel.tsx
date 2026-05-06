"use client";

import { useState } from "react";
import type { Collaborator, CollaboratorRole, TodoList } from "../lib/types";

type CollaboratorsPanelProps = {
	list: TodoList;
	ownerId: string;
	collaborators: Collaborator[];
	knownUsers: { id: string; email: string }[];
	onAdd?: (identifier: string, role: CollaboratorRole) => void;
	onRemove?: (collaborator: Collaborator) => void;
	onUpdateRole?: (collaborator: Collaborator, role: CollaboratorRole) => void;
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

const ROLES: { value: CollaboratorRole; label: string }[] = [
	{ value: "editor", label: "Editor" },
	{ value: "viewer", label: "Viewer" },
];

export function CollaboratorsPanel({
	list,
	ownerId,
	collaborators,
	knownUsers,
	onAdd,
	onRemove,
	onUpdateRole,
}: CollaboratorsPanelProps) {
	const canManage = list.can?.manage !== false;
	const [addId, setAddId] = useState("");
	const [addRole, setAddRole] = useState<CollaboratorRole>("editor");

	const availableUsers = knownUsers.filter(
		(u) => u.id !== ownerId && !collaborators.find((c) => c.id === u.id),
	);

	function handleAdd(e: React.FormEvent) {
		e.preventDefault();
		if (!addId || !onAdd) return;
		onAdd(addId, addRole);
		setAddId("");
		setAddRole("editor");
	}

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
				{!canManage && (
					<span className="text-[11px] font-medium text-slate-500 px-2.5 py-1 bg-slate-100 ring-1 ring-slate-200 rounded-full">
						View only
					</span>
				)}
			</div>

			{collaborators.length > 0 &&
				(canManage ? (
					<ul className="flex flex-col divide-y divide-slate-100">
						{collaborators.map((c) => (
							<li
								key={c.id}
								className="flex items-center gap-3 py-2 first:pt-0 last:pb-0"
							>
								<span
									className={
										"flex items-center justify-center size-7 rounded-full text-[10px] font-semibold " +
										avatarColor(c.id)
									}
								>
									{c.id.slice(0, 2).toUpperCase()}
								</span>
								<div className="flex-1 min-w-0">
									<span className="text-sm font-medium text-slate-900">{c.id}</span>
									{c.email && (
										<span className="text-xs text-slate-500 ml-1.5">{c.email}</span>
									)}
								</div>
								<select
									value={c.role ?? "editor"}
									onChange={(e) =>
										onUpdateRole?.(c, e.target.value as CollaboratorRole)
									}
									aria-label={`Role for ${c.id}`}
									className="text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-md px-2 py-1 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
								>
									{ROLES.map((r) => (
										<option key={r.value} value={r.value}>
											{r.label}
										</option>
									))}
								</select>
								<button
									type="button"
									onClick={() => onRemove?.(c)}
									aria-label={`Remove ${c.id}`}
									className="size-7 flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md text-lg leading-none"
								>
									×
								</button>
							</li>
						))}
					</ul>
				) : (
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
				))}

			{canManage && (
				<form
					onSubmit={handleAdd}
					className="flex items-center gap-2 pt-3 border-t border-slate-100"
				>
					<select
						value={addId}
						onChange={(e) => setAddId(e.target.value)}
						disabled={availableUsers.length === 0}
						className="flex-1 px-3 py-1.5 text-sm bg-white border border-slate-300 rounded-lg text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
					>
						<option value="">
							{availableUsers.length === 0 ? "All users added" : "Add collaborator…"}
						</option>
						{availableUsers.map((u) => (
							<option key={u.id} value={u.id}>
								{u.id} · {u.email}
							</option>
						))}
					</select>
					<div className="flex items-center gap-0.5 p-0.5 bg-slate-100 rounded-lg ring-1 ring-slate-200">
						{ROLES.map((r) => {
							const active = r.value === addRole;
							return (
								<button
									key={r.value}
									type="button"
									onClick={() => setAddRole(r.value)}
									className={
										"px-2.5 py-1 rounded-md text-xs font-medium " +
										(active
											? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
											: "text-slate-500 hover:text-slate-800")
									}
								>
									{r.label}
								</button>
							);
						})}
					</div>
					<button
						type="submit"
						disabled={!addId}
						className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-lg shadow-sm ring-1 ring-indigo-700/20 disabled:opacity-40 disabled:cursor-not-allowed"
					>
						Add
					</button>
				</form>
			)}
		</section>
	);
}
