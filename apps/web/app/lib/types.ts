export type DevUser = {
	id: string;
	label: string;
};

export type CanFlags = {
	view?: boolean;
	edit?: boolean;
	delete?: boolean;
	manage?: boolean;
	addTodo?: boolean;
	[key: string]: boolean | undefined;
};

export type TodoList = {
	id: string;
	name: string;
	ownerId?: string;
	can?: CanFlags;
};

export type Todo = {
	id: string;
	listId: string;
	text: string;
	completed: boolean;
	can?: CanFlags;
};

export type CollaboratorRole = "editor" | "viewer";

export type Collaborator = {
	id: string;
	email?: string;
	role?: CollaboratorRole;
};
