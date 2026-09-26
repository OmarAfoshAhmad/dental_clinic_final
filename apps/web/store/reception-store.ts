import { create } from 'zustand';

type ReceptionState = {
  selectedPatientId: string | null;
  setSelectedPatientId: (id: string | null) => void;
};

export const useReceptionStore = create<ReceptionState>((set) => ({
  selectedPatientId: null,
  setSelectedPatientId: (selectedPatientId) => set({ selectedPatientId }),
}));
