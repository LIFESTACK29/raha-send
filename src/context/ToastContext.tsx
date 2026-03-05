// src/context/ToastContext.tsx
import React, { createContext, useContext, useState } from "react";

type ToastType = "success" | "error" | "warning" | "info" | "message";

export type ToastPropsType = {
    theme?: "dark" | "light";
};

export type MessagePropsType = {
    groupId: string;
    screen: string;
    image: string;
    identifierTitle: string;
};

export interface Toast {
    id: string;
    title: string;
    message?: string;
    type: ToastType;
    duration?: number;
    props?: ToastPropsType;
    messageProps?: MessagePropsType;
}

interface ToastContextType {
    toasts: Toast[];
    addToast: (options: {
        title: string;
        message?: string;
        type?: ToastType;
        duration?: number;
        props?: ToastPropsType;
        messageProps?: MessagePropsType;
    }) => void;
    removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = ({
        messageProps,
        title,
        message,
        type = "info",
        duration = 2000,
        props = { theme: "light" },
    }: {
        title: string;
        message?: string;
        type?: ToastType;
        duration?: number;
        props?: ToastPropsType;
        messageProps?: MessagePropsType;
    }) => {
        const id = Math.random().toString(36).substring(2, 9);

        const newToast: Toast = {
            id,
            title,
            message,
            type,
            duration,
            props,
            messageProps, // ✅ added here
        };

        setToasts((prev) => [...prev, newToast]);

        if (duration > 0) {
            setTimeout(() => removeToast(id), duration);
        }
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    return (
        <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
            {children}
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }
    return context;
};
