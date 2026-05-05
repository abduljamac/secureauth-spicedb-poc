"use client";

import { useEffect, useMemo, useState } from "react";
import { DevUserSwitcher } from "./components/dev-user-switcher";
import { ListDetail } from "./components/list-detail";
import { ListSidebar } from "./components/list-sidebar";
import { ManageCollaboratorsDialog } from "./components/manage-collaborators-dialog";
import { Toasts } from "./components/toasts";
import {
	initialLists,
	listCanFlags,
	type MockListRecord,
	todosFor,
	visibleListsFor,
} from "./lib/mock-store";
import type { Collaborator, CollaboratorRole, Todo } from "./lib/types";
import { useApp } from "./providers/app-provider";

let nextListId = 100;
let nextTodoId = 100;

export default function Page() {
	const { currentUserId, pushToast } = useApp();
	const [lists, setLists] = useState<MockListRecord[]>(initialLists);
	const [selectedListId, setSelectedListId] = useState<string | null>(
		initialLists[0]?.id ?? null,
	);
	const [manageOpen, setManageOpen] = useState(false);

	const visibleLists = useMemo(
		() => visibleListsFor(lists, currentUserId),
		[lists, currentUserId],
	);

	useEffect(() => {
		if (selectedListId && !visibleLists.find((l) => l.id === selectedListId)) {
			setSelectedListId(visibleLists[0]?.id ?? null);
		} else if (!selectedListId && visibleLists.length > 0) {
			setSelectedListId(visibleLists[0].id);
		}
	}, [visibleLists, selectedListId]);

	const selectedRecord = useMemo(
		() => lists.find((l) => l.id === selectedListId) ?? null,
		[lists, selectedListId],
	);

	const selectedListView = useMemo(() => {
		if (!selectedRecord) return null;
		return {
			id: selectedRecord.id,
			name: selectedRecord.name,
			ownerId: selectedRecord.ownerId,
			can: listCanFlags(selectedRecord, currentUserId),
		};
	}, [selectedRecord, currentUserId]);

	const visibleTodos = useMemo(() => {
		if (!selectedRecord) return [];
		const can = listCanFlags(selectedRecord, currentUserId);
		if (!can.view) return [];
		return todosFor(selectedRecord, currentUserId);
	}, [selectedRecord, currentUserId]);

	function handleCreateList(name: string) {
		const id = `list-${nextListId++}`;
		setLists((prev) => [
			...prev,
			{
				id,
				name,
				ownerId: currentUserId,
				collaborators: [],
				todos: [],
			},
		]);
		setSelectedListId(id);
		pushToast(`Created list "${name}"`, "success");
	}

	function denyIfFalse(flag: boolean | undefined, message: string): boolean {
		if (flag === false) {
			pushToast(message, "error");
			return true;
		}
		return false;
	}

	function handleCreateTodo(text: string) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(
				flags.addTodo,
				"Not allowed: you can't add todos to this list",
			)
		)
			return;
		const id = `todo-${nextTodoId++}`;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							todos: [...l.todos, { id, listId: l.id, text, completed: false }],
						}
					: l,
			),
		);
	}

	function handleToggleTodo(todo: Todo, completed: boolean) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(flags.edit, "Not allowed: you can't edit todos in this list")
		)
			return;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							todos: l.todos.map((t) =>
								t.id === todo.id ? { ...t, completed } : t,
							),
						}
					: l,
			),
		);
	}

	function handleUpdateTodoText(todo: Todo, text: string) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(flags.edit, "Not allowed: you can't edit todos in this list")
		)
			return;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							todos: l.todos.map((t) =>
								t.id === todo.id ? { ...t, text } : t,
							),
						}
					: l,
			),
		);
	}

	function handleDeleteTodo(todo: Todo) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(
				flags.edit,
				"Not allowed: you can't delete todos in this list",
			)
		)
			return;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? { ...l, todos: l.todos.filter((t) => t.id !== todo.id) }
					: l,
			),
		);
	}

	function handleAddCollaborator(identifier: string, role: CollaboratorRole) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(flags.manage, "Not allowed: you can't manage collaborators")
		)
			return;
		const id = identifier.includes("@") ? identifier.split("@")[0] : identifier;
		const email = identifier.includes("@") ? identifier : undefined;
		const next: Collaborator = { id, email, role };
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							collaborators: l.collaborators.find((c) => c.id === id)
								? l.collaborators
								: [...l.collaborators, next],
						}
					: l,
			),
		);
		pushToast(`Added ${identifier} as ${role}`, "success");
	}

	function handleUpdateCollaboratorRole(
		collaborator: Collaborator,
		role: CollaboratorRole,
	) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(flags.manage, "Not allowed: you can't manage collaborators")
		)
			return;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							collaborators: l.collaborators.map((c) =>
								c.id === collaborator.id ? { ...c, role } : c,
							),
						}
					: l,
			),
		);
	}

	function handleRemoveCollaborator(collaborator: Collaborator) {
		if (!selectedRecord) return;
		const flags = listCanFlags(selectedRecord, currentUserId);
		if (
			denyIfFalse(flags.manage, "Not allowed: you can't manage collaborators")
		)
			return;
		setLists((prev) =>
			prev.map((l) =>
				l.id === selectedRecord.id
					? {
							...l,
							collaborators: l.collaborators.filter(
								(c) => c.id !== collaborator.id,
							),
						}
					: l,
			),
		);
	}

	return (
		<div className="flex flex-col h-screen bg-linear-to-br from-slate-50 via-white to-indigo-50/40 text-slate-900">
			<header className="flex items-center justify-between gap-4 flex-wrap px-6 py-3 bg-white/80 backdrop-blur border-b border-slate-200">
				<div className="flex items-center gap-2.5">
					<span className="size-7 rounded-lg bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white text-sm font-bold shadow-sm ring-1 ring-indigo-700/20">
						✓
					</span>
					<h1 className="text-base font-semibold tracking-tight">Todos</h1>
				</div>
				<DevUserSwitcher />
			</header>
			<main className="flex flex-1 min-h-0">
				<ListSidebar
					lists={visibleLists}
					selectedListId={selectedListId}
					onSelect={setSelectedListId}
					onCreate={handleCreateList}
				/>
				<div className="flex-1 p-10 overflow-auto">
					{selectedListView && selectedRecord ? (
						<ListDetail
							list={selectedListView}
							todos={visibleTodos}
							collaborators={selectedRecord.collaborators}
							onCreateTodo={handleCreateTodo}
							onToggleTodo={handleToggleTodo}
							onUpdateTodoText={handleUpdateTodoText}
							onDeleteTodo={handleDeleteTodo}
							onOpenManageCollaborators={() => setManageOpen(true)}
						/>
					) : (
						<p className="text-slate-500 italic">
							Select a list, or create one to get started.
						</p>
					)}
				</div>
			</main>
			{selectedListView && selectedRecord ? (
				<ManageCollaboratorsDialog
					open={manageOpen}
					listName={selectedListView.name}
					collaborators={selectedRecord.collaborators}
					onClose={() => setManageOpen(false)}
					onAdd={handleAddCollaborator}
					onRemove={handleRemoveCollaborator}
					onUpdateRole={handleUpdateCollaboratorRole}
				/>
			) : null}
			<Toasts />
		</div>
	);
}
