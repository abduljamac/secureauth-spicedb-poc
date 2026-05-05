"use client";

import { useEffect, useRef, useState } from "react";
import type { Collaborator, CollaboratorRole } from "../lib/types";

type ManageCollaboratorsDialogProps = {
	open: boolean;
	listName: string;
	collaborators: Collaborator[];
	onClose: () => void;
	onAdd: (identifier: string, role: CollaboratorRole) => void;
	onRemove: (collaborator: Collaborator) => void;
	onUpdateRole: (collaborator: Collaborator, role: CollaboratorRole) => void;
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

const ROLES: { value: CollaboratorRole; label: string; hint: string }[] = [
	{ value: "editor", label: "Editor", hint: "Can add and edit todos" },
	{ value: "viewer", label: "Viewer", hint: "Can only view" },
];

export function ManageCollaboratorsDialog({
	open,
	listName,
	collaborators,
	onClose,
	onAdd,
	onRemove,
	onUpdateRole,
}: ManageCollaboratorsDialogProps) {
	const [identifier, setIdentifier] = useState("");
	const [role, setRole] = useState<CollaboratorRole>("editor");
	const inputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open) {
			setIdentifier("");
			setRole("editor");
			inputRef.current?.focus();
		}
	}, [open]);

	useEffect(() => {
		if (!open) return;
		function onKey(e: KeyboardEvent) {
			if (e.key === "Escape") onClose();
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [open, onClose]);

	if (!open) return null;

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = identifier.trim();
		if (!trimmed) return;
		onAdd(trimmed, role);
		setIdentifier("");
		inputRef.current?.focus();
	}

	const activeRoleHint = ROLES.find((r) => r.value === role)?.hint ?? "";

	return (
		<div
			className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
			role="dialog"
			aria-modal="true"
			aria-label="Manage collaborators"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl w-full max-w-lg max-h-[calc(100vh-2rem)] flex flex-col shadow-2xl ring-1 ring-slate-200/60 overflow-hidden"
				onClick={(e) => e.stopPropagation()}
			>
				<header className="flex items-start justify-between gap-3 px-6 pt-6 pb-4 bg-gradient-to-b from-slate-50 to-white border-b border-slate-200">
					<div>
						<h2 className="text-base font-semibold text-slate-900">
							Manage collaborators
						</h2>
						<p className="text-xs text-slate-500 mt-0.5">
							List ·{" "}
							<span className="font-medium text-slate-700">{listName}</span>
						</p>
					</div>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="size-8 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md text-lg leading-none"
					>
						×
					</button>
				</header>

				<form
					onSubmit={handleSubmit}
					className="flex flex-col gap-3 px-6 py-4 border-b border-slate-200"
				>
					<div className="flex gap-2">
						<input
							ref={inputRef}
							type="text"
							placeholder="Add by user id or email"
							value={identifier}
							onChange={(e) => setIdentifier(e.target.value)}
							className="flex-1 px-3 py-2 text-sm bg-white border border-slate-300 rounded-lg placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
						/>
						<button
							type="submit"
							disabled={!identifier.trim()}
							className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-lg shadow-sm ring-1 ring-indigo-700/20 disabled:opacity-40 disabled:cursor-not-allowed"
						>
							Invite
						</button>
					</div>
					<div className="flex items-center gap-3">
						<span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
							Role
						</span>
						<div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg ring-1 ring-slate-200">
							{ROLES.map((r) => {
								const active = r.value === role;
								return (
									<button
										key={r.value}
										type="button"
										onClick={() => setRole(r.value)}
										className={
											"px-3 py-1 rounded-md text-xs font-medium " +
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
						<span className="text-xs text-slate-500">{activeRoleHint}</span>
					</div>
				</form>

				<div className="flex-1 overflow-auto px-3 pb-3 min-h-[120px]">
					{collaborators.length === 0 ? (
						<div className="text-center py-10">
							<div className="mx-auto size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
								·
							</div>
							<p className="text-sm text-slate-500 italic mt-2">
								No collaborators yet.
							</p>
						</div>
					) : (
						<ul className="flex flex-col">
							{collaborators.map((c) => (
								<li
									key={c.id}
									className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-slate-50"
								>
									<span
										className={
											"flex items-center justify-center size-9 rounded-full text-xs font-semibold " +
											avatarColor(c.id)
										}
									>
										{c.id.slice(0, 2).toUpperCase()}
									</span>
									<div className="flex-1 min-w-0 flex flex-col">
										<span className="text-sm font-medium text-slate-900">
											{c.id}
										</span>
										{c.email ? (
											<span className="text-xs text-slate-500">
												{c.email}
											</span>
										) : null}
									</div>
									<select
										value={c.role ?? "editor"}
										onChange={(e) =>
											onUpdateRole(c, e.target.value as CollaboratorRole)
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
										onClick={() => onRemove(c)}
										className="text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2 py-1 rounded-md"
									>
										Remove
									</button>
								</li>
							))}
						</ul>
					)}
				</div>

				<footer className="flex justify-end gap-2 px-6 py-4 bg-slate-50 border-t border-slate-200">
					<button
						type="button"
						onClick={onClose}
						className="px-3.5 py-1.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md shadow-sm"
					>
						Done
					</button>
				</footer>
			</div>
		</div>
	);
}
