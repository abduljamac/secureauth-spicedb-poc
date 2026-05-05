"use client";

import { useState } from "react";
import type { Todo } from "../lib/types";

type TodoItemProps = {
	todo: Todo;
	onToggle: (todo: Todo, completed: boolean) => void;
	onUpdateText: (todo: Todo, text: string) => void;
	onDelete: (todo: Todo) => void;
};

export function TodoItem({ todo, onToggle, onUpdateText, onDelete }: TodoItemProps) {
	const [editing, setEditing] = useState(false);
	const [draft, setDraft] = useState(todo.text);

	const canEdit = todo.can?.edit !== false;
	const canDelete = todo.can?.delete !== false;

	function startEdit() {
		setDraft(todo.text);
		setEditing(true);
	}

	function saveEdit() {
		const trimmed = draft.trim();
		if (!trimmed || trimmed === todo.text) {
			setEditing(false);
			return;
		}
		onUpdateText(todo, trimmed);
		setEditing(false);
	}

	function cancelEdit() {
		setDraft(todo.text);
		setEditing(false);
	}

	return (
		<li
			className={
				"group flex items-center gap-3 px-4 py-3 rounded-xl border " +
				(todo.completed
					? "bg-slate-50 border-slate-200"
					: "bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm")
			}
		>
			<input
				type="checkbox"
				checked={todo.completed}
				onChange={(e) => onToggle(todo, e.target.checked)}
				disabled={!canEdit}
				className="size-4 rounded accent-indigo-600 disabled:cursor-not-allowed"
				aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
			/>
			{editing ? (
				<>
					<input
						type="text"
						value={draft}
						onChange={(e) => setDraft(e.target.value)}
						onKeyDown={(e) => {
							if (e.key === "Enter") saveEdit();
							if (e.key === "Escape") cancelEdit();
						}}
						// biome-ignore lint/a11y/noAutofocus: focus expected on inline edit
						autoFocus
						className="flex-1 px-2 py-1 text-sm border border-slate-300 rounded-md focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
					/>
					<button
						type="button"
						onClick={saveEdit}
						className="px-2.5 py-1 text-xs font-medium bg-gradient-to-b from-indigo-500 to-indigo-600 text-white rounded-md ring-1 ring-indigo-700/20"
					>
						Save
					</button>
					<button
						type="button"
						onClick={cancelEdit}
						className="px-2.5 py-1 text-xs text-slate-700 border border-slate-300 rounded-md bg-white"
					>
						Cancel
					</button>
				</>
			) : (
				<>
					<span
						className={
							"flex-1 text-sm " +
							(todo.completed
								? "line-through text-slate-400"
								: "text-slate-800")
						}
					>
						{todo.text}
					</span>
					<div className="flex items-center gap-1 opacity-0 group-hover:opacity-100">
						{canEdit ? (
							<button
								type="button"
								onClick={startEdit}
								className="px-2 py-1 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-md"
							>
								Edit
							</button>
						) : null}
						{canDelete ? (
							<button
								type="button"
								onClick={() => onDelete(todo)}
								className="px-2 py-1 text-xs font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-md"
							>
								Delete
							</button>
						) : null}
					</div>
				</>
			)}
		</li>
	);
}
