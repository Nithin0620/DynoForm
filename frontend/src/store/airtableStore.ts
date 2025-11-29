import { create } from 'zustand';
import { airtable } from '../lib/api';
import type { AirtableBase, AirtableTable, AirtableField } from '../types/api';

interface AirtableState {
  bases: AirtableBase[];
  tables: AirtableTable[];
  fields: AirtableField[];
  selectedBase: string | null;
  selectedTable: string | null;
  loading: boolean;
  error: string | null;
  
  fetchBases: () => Promise<void>;
  fetchTables: (baseId: string) => Promise<void>;
  fetchFields: (baseId: string, tableId: string) => Promise<void>;
  selectBase: (baseId: string) => void;
  selectTable: (tableId: string) => void;
  reset: () => void;
  clearError: () => void;
}

export const useAirtableStore = create<AirtableState>((set) => ({
  bases: [],
  tables: [],
  fields: [],
  selectedBase: null,
  selectedTable: null,
  loading: false,
  error: null,

  fetchBases: async () => {
    set({ loading: true, error: null });
    try {
      const data = await airtable.getBases();
      set({ bases: data.bases, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch bases', loading: false });
    }
  },

  fetchTables: async (baseId: string) => {
    set({ loading: true, error: null, selectedBase: baseId });
    try {
      const data = await airtable.getTables(baseId);
      set({ tables: data.tables, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch tables', loading: false });
    }
  },

  fetchFields: async (baseId: string, tableId: string) => {
    set({ loading: true, error: null, selectedTable: tableId });
    try {
      const data = await airtable.getFields(baseId, tableId);
      set({ fields: data.supportedFields, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch fields', loading: false });
    }
  },

  selectBase: (baseId: string) => set({ selectedBase: baseId, tables: [], fields: [] }),
  selectTable: (tableId: string) => set({ selectedTable: tableId, fields: [] }),
  
  reset: () => set({
    bases: [],
    tables: [],
    fields: [],
    selectedBase: null,
    selectedTable: null,
    error: null,
  }),

  clearError: () => set({ error: null }),
}));
