import { create } from "zustand";

type State = {
  isCreating: boolean;
  newMessage: string | null;
};

type Action = {
  setIsCreating: (message: string) => void;
  setIsCreated: () => void;
  consumeMessage: () => string | null;
};

export const useIsCreatingNewConversation = create<State & Action>(
  (set, get) => ({
    isCreating: false,
    newMessage: null,
    setIsCreating: (message: string) =>
      set({ isCreating: true, newMessage: message }),
    setIsCreated: () => set({ isCreating: false, newMessage: null }),
    consumeMessage: () => {
      const msg = get().newMessage;
      if (msg) {
        set({ newMessage: null });
      }
      return msg;
    },
  })
);
