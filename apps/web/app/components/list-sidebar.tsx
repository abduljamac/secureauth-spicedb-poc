"use client";

import type { TodoList } from "../lib/types";
import { CreateListForm } from "./create-list-form";

type ListSidebarProps = {
	lists: TodoList[];
	selectedListId: string | null;
	onSelect: (id: string) => void;
	onCreate: (name: string) => void;
};

export function ListSidebar({
	lists,
	selectedListId,
	onSelect,
	onCreate,
}: ListSidebarProps) {
	return (
		<aside className="w-72 border-r border-slate-200 bg-gradient-to-b from-white to-slate-50 p-5 flex flex-col gap-4 overflow-auto">
			<div className="flex items-center justify-between px-1">
				<h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
					Your lists
				</h2>
				<span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full ring-1 ring-slate-200">
					{lists.length}
				</span>
			</div>
			<CreateListForm onCreate={onCreate} />
			{lists.length === 0 ? (
				<p className="text-sm text-slate-500 italic px-1">
					No lists visible to you.
				</p>
			) : (
				<ul className="flex flex-col gap-1">
					{lists.map((l) => {
						const active = l.id === selectedListId;
						return (
							<li key={l.id}>
								<button
									type="button"
									onClick={() => onSelect(l.id)}
									className={
										"w-full text-left px-3 py-2.5 rounded-lg flex flex-col gap-0.5 " +
										(active
											? "bg-white shadow-sm ring-1 ring-slate-200 border-l-2 border-indigo-500"
											: "text-slate-700 hover:bg-white/70")
									}
								>
									<span
										className={
											"text-sm font-medium " +
											(active ? "text-slate-900" : "text-slate-800")
										}
									>
										{l.name}
									</span>
									{l.ownerId ? (
										<span className="text-[11px] text-slate-500">
											owner · {l.ownerId}
										</span>
									) : null}
								</button>
							</li>
						);
					})}
				</ul>
			)}
		</aside>
	);
}
