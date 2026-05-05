"use client";

import {
	createContext,
	useCallback,
	useContext,
	useMemo,
	useState,
	type ReactNode,
} from "react";
import { DEFAULT_DEV_USER_ID } from "../lib/dev-users";

type ToastKind = "info" | "error" | "success";

export type ToastMessage = {
	id: number;
	text: string;
	kind: ToastKind;
};

type AppContextValue = {
	currentUserId: string;
	setCurrentUserId: (id: string) => void;
	toasts: ToastMessage[];
	pushToast: (text: string, kind?: ToastKind) => void;
	dismissToast: (id: number) => void;
};

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
	const [currentUserId, setCurrentUserId] = useState<string>(DEFAULT_DEV_USER_ID);
	const [toasts, setToasts] = useState<ToastMessage[]>([]);

	const dismissToast = useCallback((id: number) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const pushToast = useCallback(
		(text: string, kind: ToastKind = "info") => {
			const id = Date.now() + Math.random();
			setToasts((prev) => [...prev, { id, text, kind }]);
			setTimeout(() => dismissToast(id), 4000);
		},
		[dismissToast],
	);

	const value = useMemo<AppContextValue>(
		() => ({
			currentUserId,
			setCurrentUserId,
			toasts,
			pushToast,
			dismissToast,
		}),
		[currentUserId, toasts, pushToast, dismissToast],
	);

	return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
	const ctx = useContext(AppContext);
	if (!ctx) throw new Error("useApp must be used within AppProvider");
	return ctx;
}
