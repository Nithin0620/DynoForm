import { create } from 'zustand';
import { forms } from '../lib/api';
import type { FormSchema, CreateFormRequest, FormResponse } from '../types/api';

interface FormsState {
  forms: FormSchema[];
  currentForm: FormSchema | null;
  currentResponses: FormResponse[];
  loading: boolean;
  error: string | null;
  
  fetchForms: () => Promise<void>;
  fetchForm: (formId: string) => Promise<void>;
  createForm: (formData: CreateFormRequest) => Promise<FormSchema>;
  fetchResponses: (formId: string) => Promise<void>;
  clearError: () => void;
}

export const useFormsStore = create<FormsState>((set) => ({
  forms: [],
  currentForm: null,
  currentResponses: [],
  loading: false,
  error: null,

  fetchForms: async () => {
    set({ loading: true, error: null });
    try {
      const data = await forms.list();
      set({ forms: data.forms, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch forms', loading: false });
    }
  },

  fetchForm: async (formId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await forms.get(formId);
      set({ currentForm: data.form, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch form', loading: false });
    }
  },

  createForm: async (formData: CreateFormRequest) => {
    set({ loading: true, error: null });
    try {
      const data = await forms.create(formData);
      set((state) => ({ 
        forms: [...state.forms, data.form], 
        loading: false 
      }));
      return data.form;
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to create form', loading: false });
      throw error;
    }
  },

  fetchResponses: async (formId: string) => {
    set({ loading: true, error: null });
    try {
      const data = await forms.getResponses(formId);
      set({ currentResponses: data.responses, loading: false });
    } catch (error: any) {
      set({ error: error.response?.data?.error || 'Failed to fetch responses', loading: false });
    }
  },

  clearError: () => set({ error: null }),
}));
