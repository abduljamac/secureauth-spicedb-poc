"use client";

import type { Collaborator, Todo, TodoList } from "../lib/types";
import { CollaboratorsPanel } from "./collaborators-panel";
import { CreateTodoForm } from "./create-todo-form";
import { TodoItem } from "./todo-item";

type ListDetailProps = {
	list: TodoList;
	todos: Todo[];
	collaborators: Collaborator[];
	onCreateTodo: (text: string) => void;
	onToggleTodo: (todo: Todo, completed: boolean) => void;
	onUpdateTodoText: (todo: Todo, text: string) => void;
	onDeleteTodo: (todo: Todo) => void;
	onOpenManageCollaborators: () => void;
};

export function ListDetail({
	list,
	todos,
	collaborators,
	onCreateTodo,
	onToggleTodo,
	onUpdateTodoText,
	onDeleteTodo,
	onOpenManageCollaborators,
}: ListDetailProps) {
	const canAddTodo = list.can?.addTodo !== false && list.can?.edit !== false;
	const remaining = todos.filter((t) => !t.completed).length;
	const total = todos.length;
	const pct = total === 0 ? 0 : Math.round(((total - remaining) / total) * 100);

	return (
		<section className="flex flex-col gap-6 max-w-2xl mx-auto">
			<header className="flex flex-col gap-3">
				<div className="flex items-end justify-between gap-4">
					<div>
						<h2 className="text-3xl font-semibold tracking-tight text-slate-900">
							{list.name}
						</h2>
						<p className="text-sm text-slate-500 mt-1">
							{list.ownerId ? <>owner · {list.ownerId} · </> : null}
							{remaining} of {total} remaining
						</p>
					</div>
					<span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full ring-1 ring-slate-200">
						{pct}% done
					</span>
				</div>
				<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden ring-1 ring-slate-200">
					<div
						className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full"
						style={{ width: `${pct}%` }}
					/>
				</div>
			</header>

			<CreateTodoForm disabled={!canAddTodo} onCreate={onCreateTodo} />

			{todos.length === 0 ? (
				<div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl bg-white">
					<div className="mx-auto size-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-lg">
						✓
					</div>
					<p className="text-sm text-slate-500 italic mt-2">
						No todos yet — add one above.
					</p>
				</div>
			) : (
				<ul className="flex flex-col gap-2">
					{todos.map((t) => (
						<TodoItem
							key={t.id}
							todo={t}
							onToggle={onToggleTodo}
							onUpdateText={onUpdateTodoText}
							onDelete={onDeleteTodo}
						/>
					))}
				</ul>
			)}

			<CollaboratorsPanel
				list={list}
				collaborators={collaborators}
				onOpenManage={onOpenManageCollaborators}
			/>
		</section>
	);
}
