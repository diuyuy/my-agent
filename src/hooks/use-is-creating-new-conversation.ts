import { create } from "zustand";

type State = {
  isCreating: boolean;
  message: string | null;
  isRag: boolean;
  modelProvider: string;
};

type Action = {
  setIsCreating: (data: Omit<State, "isCreating">) => void;
  setIsCreated: () => void;
  setModelProvider: (model: string) => void;
  setIsRag: (value: boolean) => void;
  consumeMessage: () => string | null;
  getRequestData: () => Pick<State, "modelProvider" | "isRag">;
};

export const useIsCreatingNewConversation = create<State & Action>(
  (set, get) => ({
    isCreating: false,
    message: null,
    isRag: false,
    modelProvider: "gemini-2.0-flash",
    setIsCreating: (data: Omit<State, "isCreating">) =>
      set({ isCreating: true, ...data }),
    setIsCreated: () =>
      set({
        isCreating: false,
        message: null,
      }),
    setModelProvider: (model: string) => set({ modelProvider: model }),
    setIsRag: (value: boolean) => set({ isRag: value }),
    consumeMessage: () => {
      const msg = get().message;
      if (msg) {
        set({ message: null });
      }
      return msg;
    },
    getRequestData: () => {
      return {
        modelProvider: get().modelProvider,
        isRag: get().isRag,
      };
    },
  })
);
