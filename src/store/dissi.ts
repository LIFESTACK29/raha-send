import { atom } from "jotai";

export interface DissiState {
    isListening: boolean;
    isProcessing: boolean;
    transcript: string;
    aiResponse: string | null;
    error: string | null;
}

export const dissiStateAtom = atom<DissiState>({
    isListening: false,
    isProcessing: false,
    transcript: "",
    aiResponse: null,
    error: null,
});
