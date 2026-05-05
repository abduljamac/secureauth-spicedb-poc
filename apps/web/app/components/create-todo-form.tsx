"use client";

import { useState } from "react";

type CreateTodoFormProps = {
	disabled?: boolean;
	onCreate: (text: string) => void;
};

export function CreateTodoForm({ disabled, onCreate }: CreateTodoFormProps) {
	const [text, setText] = useState("");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = text.trim();
		if (!trimmed) return;
		onCreate(trimmed);
		setText("");
	}

	return (
		<form
			className="flex gap-2 p-2 bg-white border border-slate-200 rounded-xl shadow-sm"
			onSubmit={handleSubmit}
		>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
				disabled={disabled}
				placeholder={
					disabled ? "You can't add todos to this list" : "What needs doing?"
				}
				className="flex-1 px-3 py-2 text-sm bg-transparent border-0 placeholder:text-slate-400 focus:outline-none disabled:text-slate-400 disabled:cursor-not-allowed"
			/>
			<button
				type="submit"
				disabled={disabled || !text.trim()}
				className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-lg shadow-sm ring-1 ring-indigo-700/20 disabled:opacity-40 disabled:cursor-not-allowed"
			>
				Add todo
			</button>
		</form>
	);
}
