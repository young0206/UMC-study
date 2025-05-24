import { create } from "zustand";

interface ModalState {
  isOpen: boolean;
  modalOpen: () => void;
  modalClose: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalOpen: () => set({ isOpen: true }),
  modalClose: () => set({ isOpen: false }),
})); 