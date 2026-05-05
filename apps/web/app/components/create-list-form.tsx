"use client";

import { useState } from "react";

export function CreateListForm({ onCreate }: { onCreate: (name: string) => void }) {
	const [name, setName] = useState("");

	function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		const trimmed = name.trim();
		if (!trimmed) return;
		onCreate(trimmed);
		setName("");
	}

	return (
		<form className="flex gap-2" onSubmit={handleSubmit}>
			<input
				type="text"
				placeholder="New list"
				value={name}
				onChange={(e) => setName(e.target.value)}
				className="flex-1 min-w-0 px-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
			/>
			<button
				type="submit"
				disabled={!name.trim()}
				className="px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-b from-indigo-500 to-indigo-600 rounded-md shadow-sm ring-1 ring-indigo-700/20 disabled:opacity-40 disabled:cursor-not-allowed"
			>
				Add
			</button>
		</form>
	);
}
