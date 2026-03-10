import { useEffect, useState, useCallback, useRef } from "react";
import Voice, {
    SpeechResultsEvent,
    SpeechErrorEvent,
} from "@react-native-voice/voice";

import { useAtom } from "jotai";
import { dissiStateAtom } from "../store/dissi";
import {
    dispatchDissiAction,
    DissiActionPayload,
} from "../actions/DissiActions";
import { useAuth } from "@clerk/clerk-expo";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { API_URL } from "../const";

// A strict prompt guiding the LLM to output pure JSON mapping user speech to app intents
const DISSI_SYSTEM_PROMPT = `
You are Dissi, a state-of-the-art AI Assistant integrated directly into a mobile application. Your user is navigating the RahaSend app in Port Harcourt, Nigeria.

Your ONLY allowed output is a pure JSON object structured exactly like this:
{
  "action": "ACTION_TYPE",
  "args": { "param_name": "param_value" },
  "message": "A conversational response to read to the user"
}

Allowed ACTION_TYPES:
1. "FIND_RIDER" - Use when the user wants to book or find a rider/dispatch.
   Args required: "pickupLocation" (string), "dropoffLocation" (string).
   If they don't provide BOTH locations, DO NOT USE "FIND_RIDER". Instead, use "ASK_CLARIFICATION".
2. "UPDATE_PROFILE" - Use when the user asks to change their name.
   Args required: "name" (string).
3. "ASK_CLARIFICATION" - Use when you are missing required arguments for a specific intent OR you do not understand the command.
   Args required: empty object. Provide the question in the "message" field.

CRITICAL: Return ONLY valid JSON block. NO markdown \`\`\`json wrappers. NO conversational text outside the JSON.
`;

export const useDissi = (onOpenRiderModal: () => void, navigation: any) => {
    const [state, setState] = useAtom(dissiStateAtom);
    const { getToken } = useAuth();

    // Add a local ref to track if we should be continuously listening
    const isContinuousListening = useRef(false);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const checkWakeWord = (text: string) => {
        const lowerText = text.toLowerCase();
        return (
            lowerText.includes("hi dissi") ||
            lowerText.includes("hi send") ||
            lowerText.includes("hello dissi")
        );
    };

    const startContinuousListening = async () => {
        isContinuousListening.current = true;
        await startListening();
    };

    const stopContinuousListening = async () => {
        isContinuousListening.current = false;
        await stopListening();
    };

    const startListening = async () => {
        try {
            await Voice.start("en-NG");

            // Reset timeout
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
                if (state.isListening && !isContinuousListening.current)
                    stopListening();
            }, 5000);
        } catch (e) {
            console.error("Voice start error:", e);
            setState((prev) => ({
                ...prev,
                error: "Microphone permission denied or unavailable.",
            }));
        }
    };

    const stopListening = async () => {
        try {
            await Voice.stop();
        } catch (e) {
            console.error("Voice stop error:", e);
        }
    };

    useEffect(() => {
        Voice.onSpeechStart = () => {
            // Only show listening state if we aren't heavily looping in background
            if (!isContinuousListening.current) {
                setState((prev) => ({
                    ...prev,
                    isListening: true,
                    transcript: "",
                    error: null,
                    aiResponse: null,
                }));
            }
        };

        Voice.onSpeechEnd = () => {
            if (!isContinuousListening.current) {
                setState((prev) => ({ ...prev, isListening: false }));
            }
        };

        Voice.onSpeechResults = (e: SpeechResultsEvent) => {
            const transcript = e.value?.[0] || "";

            if (isContinuousListening.current) {
                if (checkWakeWord(transcript)) {
                    // Stop the continuous loop
                    isContinuousListening.current = false;

                    // Announce we are listening now
                    setState((prev) => ({
                        ...prev,
                        transcript: "Hi there! How can I help?",
                        isListening: true,
                    }));

                    // Trigger a brief pause then start actual command listening
                    setTimeout(() => {
                        processVoiceCommand(transcript);
                    }, 500);
                } else {
                    // Didn't hear wake word. Restart listening for the next loop.
                    Voice.stop().then(() => {
                        if (isContinuousListening.current) {
                            setTimeout(() => {
                                Voice.start("en-NG").catch(console.error);
                            }, 100);
                        }
                    });
                }
            } else {
                // Normal explicit click behavior
                setState((prev) => ({ ...prev, transcript }));
                if (transcript) {
                    processVoiceCommand(transcript);
                }
            }
        };

        Voice.onSpeechError = (e: SpeechErrorEvent) => {
            if (isContinuousListening.current) {
                // Restart silently on error (like timeout) during continuous mode
                Voice.start("en-NG").catch(console.error);
            } else {
                setState((prev) => ({
                    ...prev,
                    isListening: false,
                    error: e.error?.message || "Voice recognition failed",
                }));
            }
        };

        return () => {
            isContinuousListening.current = false;
            Voice.destroy().then(Voice.removeAllListeners);
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    /**
     * Hit the LLM using the internal API to get a parsed JSON
     */
    const processVoiceCommand = async (command: string) => {
        setState((prev) => ({
            ...prev,
            isListening: false,
            isProcessing: true,
            aiResponse: null,
        }));
        try {
            const token = await getToken();

            const response = await axios.post(
                `${API_URL}/ai/process-intent`,
                {
                    systemPrompt: DISSI_SYSTEM_PROMPT,
                    userText: command,
                    locationContext: "Port Harcourt, Nigeria",
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            );

            const rawLLMOutput = response.data.jsonOutput;

            let jsonPayload: DissiActionPayload;
            try {
                jsonPayload = JSON.parse(rawLLMOutput);
            } catch (e) {
                const cleaned = rawLLMOutput
                    .replace(/\`\`\`json/g, "")
                    .replace(/\`\`\`/g, "")
                    .trim();
                jsonPayload = JSON.parse(cleaned);
            }

            const actionResult = await dispatchDissiAction(
                jsonPayload,
                navigation,
                onOpenRiderModal,
                getToken,
            );

            setState((prev) => ({
                ...prev,
                isProcessing: false,
                aiResponse: actionResult.message,
            }));
        } catch (error) {
            console.error("AI Error:", error);
            setState((prev) => ({
                ...prev,
                isProcessing: false,
                error: "Sorry, I couldn't reach the server right now.",
            }));
        }
    };

    return {
        ...state,
        startListening,
        stopListening,
        startContinuousListening,
        stopContinuousListening,
    };
};
