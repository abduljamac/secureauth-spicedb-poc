import type { CanFlags, Collaborator, Todo, TodoList } from "./types";

export type MockListRecord = {
	id: string;
	name: string;
	ownerId: string;
	collaborators: Collaborator[];
	todos: Todo[];
};

export const initialLists: MockListRecord[] = [
	{
		id: "list-groceries",
		name: "Groceries",
		ownerId: "alice",
		collaborators: [
			{ id: "bob", email: "bob@example.com", role: "editor" },
		],
		todos: [
			{ id: "todo-1", listId: "list-groceries", text: "Buy milk", completed: false },
			{ id: "todo-2", listId: "list-groceries", text: "Buy eggs", completed: true },
			{ id: "todo-3", listId: "list-groceries", text: "Buy bread", completed: false },
		],
	},
	{
		id: "list-work",
		name: "Work",
		ownerId: "alice",
		collaborators: [],
		todos: [
			{ id: "todo-4", listId: "list-work", text: "Write design doc", completed: false },
			{ id: "todo-5", listId: "list-work", text: "Review PRs", completed: false },
		],
	},
	{
		id: "list-bob-personal",
		name: "Bob's personal",
		ownerId: "bob",
		collaborators: [
			{ id: "charlie", email: "charlie@example.com", role: "viewer" },
		],
		todos: [
			{ id: "todo-6", listId: "list-bob-personal", text: "Plan weekend trip", completed: false },
		],
	},
];

export function listCanFlags(list: MockListRecord, viewerId: string): CanFlags {
	const isOwner = list.ownerId === viewerId;
	const collaborator = list.collaborators.find((c) => c.id === viewerId);
	const isEditor = collaborator?.role === "editor";
	const isViewer = collaborator?.role === "viewer";
	return {
		view: isOwner || !!collaborator,
		edit: isOwner || isEditor,
		delete: isOwner,
		manage: isOwner,
		addTodo: isOwner || isEditor,
	};
}

export function todoCanFlags(list: MockListRecord, viewerId: string): CanFlags {
	const flags = listCanFlags(list, viewerId);
	return {
		view: flags.view,
		edit: flags.edit,
		delete: flags.edit,
	};
}

export function visibleListsFor(
	all: MockListRecord[],
	viewerId: string,
): TodoList[] {
	return all
		.filter((l) => listCanFlags(l, viewerId).view)
		.map((l) => ({
			id: l.id,
			name: l.name,
			ownerId: l.ownerId,
			can: listCanFlags(l, viewerId),
		}));
}

export function todosFor(
	list: MockListRecord,
	viewerId: string,
): Todo[] {
	const can = todoCanFlags(list, viewerId);
	return list.todos.map((t) => ({ ...t, can }));
}
