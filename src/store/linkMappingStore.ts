import { create } from 'zustand';
import { LinkMapping } from '../types';

interface LinkMappingState {
  mappings: LinkMapping[];
  addMapping: (mapping: Omit<LinkMapping, 'id'>) => void;
  updateMapping: (id: string, mapping: Partial<LinkMapping>) => void;
  deleteMapping: (id: string) => void;
}

export const useLinkMappingStore = create<LinkMappingState>((set) => ({
  mappings: [],
  addMapping: (mapping) =>
    set((state) => ({
      mappings: [...state.mappings, { ...mapping, id: crypto.randomUUID() }],
    })),
  updateMapping: (id, mapping) =>
    set((state) => ({
      mappings: state.mappings.map((m) =>
        m.id === id ? { ...m, ...mapping } : m
      ),
    })),
  deleteMapping: (id) =>
    set((state) => ({
      mappings: state.mappings.filter((m) => m.id !== id),
    })),
}));