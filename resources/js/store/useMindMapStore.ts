import { create } from 'zustand';

interface MindMapState {
    isExpanded: boolean;
    toggleExpand: () => void;
}

export const useMindMapStore = create<MindMapState>((set) => ({
    isExpanded: false,
    toggleExpand: () => set((state) => ({ isExpanded: !state.isExpanded })),
}));
