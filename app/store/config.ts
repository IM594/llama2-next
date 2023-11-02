import {create} from "zustand";
import {persist} from "zustand/middleware";
import {StoreKey} from "../constant";

export enum SubmitKey {
    Enter = "Enter",
    CtrlEnter = "Ctrl + Enter",
    ShiftEnter = "Shift + Enter",
    AltEnter = "Alt + Enter",
    MetaEnter = "Meta + Enter",
}

export enum Theme {
    Auto = "auto",
    Dark = "dark",
    Light = "light",
}

export const DEFAULT_CONFIG = {
    submitKey: SubmitKey.Enter as SubmitKey,
    fontSize: 14,
    theme: Theme.Auto as Theme,
    tightBorder: true,
    sendPreviewBubble: true,
    sidebarWidth: 300,
    dontShowMaskSplashScreen: false,

    modelConfig: {
        model: "BaseGPT" as ModelType,
        temperature: 1,
        max_tokens: 2000,
        presence_penalty: 0,
        sendMemory: true,
        historyMessageCount: 10,
        compressMessageLengthThreshold: 1000,
    },
};

export type ChatConfig = typeof DEFAULT_CONFIG;

export type ChatConfigStore = ChatConfig & {
    reset: () => void;
    update: (updater: (config: ChatConfig) => void) => void;
};

export type ModelConfig = ChatConfig["modelConfig"];

export const ALL_MODELS = [
    {
        name: "BaseGPT",
        available: true,
    },
    {
        name: "FinanceGPT",
        available: true,
    },
    {
        name: "HealthcareGPT",
        available: true,
    },
] as const;

export type ModelType = (typeof ALL_MODELS)[number]["name"];

export function limitNumber(
    x: number,
    min: number,
    max: number,
    defaultValue: number,
) {
    if (typeof x !== "number" || isNaN(x)) {
        return defaultValue;
    }

    return Math.min(max, Math.max(min, x));
}

export function limitModel(name: string) {
    return ALL_MODELS.some((m) => m.name === name && m.available)
        ? name
        : ALL_MODELS[0].name;
}

export const ModalConfigValidator = {
    model(x: string) {
        return limitModel(x) as ModelType;
    },
    max_tokens(x: number) {
        return limitNumber(x, 0, 32000, 2000);
    },
    presence_penalty(x: number) {
        return limitNumber(x, -2, 2, 0);
    },
    temperature(x: number) {
        return limitNumber(x, 0, 1, 1);
    },
};

export const useAppConfig = create<ChatConfigStore>()(
    persist(
        (set, get) => ({
            ...DEFAULT_CONFIG,

            reset() {
                set(() => ({...DEFAULT_CONFIG}));
            },

            update(updater) {
                const config = {...get()};
                updater(config);
                set(() => config);
            },
        }),
        {
            name: StoreKey.Config,
            version: 2,
            migrate(persistedState, version) {
                if (version === 2) return persistedState as any;

                const state = persistedState as ChatConfig;
                state.modelConfig.sendMemory = true;
                state.modelConfig.historyMessageCount = 10;
                state.modelConfig.compressMessageLengthThreshold = 1000;
                state.dontShowMaskSplashScreen = false;

                return state;
            },
        },
    ),
);
