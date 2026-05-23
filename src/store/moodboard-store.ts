import { create } from 'zustand';
import type { Material } from '@/types';

interface MoodboardState {
  selectedMaterial: Material | null;
  isSaving: boolean;
  lastSaved: Date | null;
  setSelectedMaterial: (material: Material | null) => void;
  setIsSaving: (saving: boolean) => void;
  setLastSaved: (date: Date | null) => void;
}

export const useMoodboardStore = create<MoodboardState>((set) => ({
  selectedMaterial: null,
  isSaving: false,
  lastSaved: null,
  setSelectedMaterial: (material) => {
    set({ selectedMaterial: material });
    // Reset after tick so same material can be re-added
    if (material) {
      setTimeout(() => set({ selectedMaterial: null }), 100);
    }
  },
  setIsSaving: (isSaving) => set({ isSaving }),
  setLastSaved: (lastSaved) => set({ lastSaved }),
}));
