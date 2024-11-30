import { create } from 'zustand';
import { OutreachSite } from '../types';

interface OutreachSiteState {
  sites: OutreachSite[];
  addSite: (site: Omit<OutreachSite, 'id' | 'addedAt'>) => void;
  updateSite: (id: string, site: Partial<OutreachSite>) => void;
  deleteSite: (id: string) => void;
}

export const useOutreachSiteStore = create<OutreachSiteState>((set) => ({
  sites: [],
  addSite: (site) =>
    set((state) => ({
      sites: [
        ...state.sites,
        { ...site, id: crypto.randomUUID(), addedAt: new Date() },
      ],
    })),
  updateSite: (id, site) =>
    set((state) => ({
      sites: state.sites.map((s) => (s.id === id ? { ...s, ...site } : s)),
    })),
  deleteSite: (id) =>
    set((state) => ({
      sites: state.sites.filter((s) => s.id !== id),
    })),
}));