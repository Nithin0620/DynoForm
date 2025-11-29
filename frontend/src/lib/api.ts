import axios from 'axios';
import type {
  AuthResponse,
  AirtableBase,
  AirtableTable,
  AirtableField,
  FormSchema,
  FormResponse,
  CreateFormRequest,
} from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

export const auth = {
  initiateOAuth: () => {
    window.location.href = `${API_BASE_URL}/auth/airtable`;
  },
  
  handleCallback: async (code: string, state: string): Promise<AuthResponse> => {
    const response = await apiClient.get(`/auth/airtable/callback`, {
      params: { code, state },
    });
    return response.data;
  },
};

export const airtable = {
  getBases: async (): Promise<{ bases: AirtableBase[] }> => {
    const response = await apiClient.get('/airtable/bases');
    return response.data;
  },

  getTables: async (baseId: string): Promise<{ tables: AirtableTable[] }> => {
    const response = await apiClient.get(`/airtable/base/${baseId}/tables`);
    return response.data;
  },

  getFields: async (baseId: string, tableId: string): Promise<{ supportedFields: AirtableField[]; unsupportedFields: any[] }> => {
    const response = await apiClient.get(`/airtable/table/${baseId}/${tableId}/fields`);
    return response.data;
  },
};

export const forms = {
  create: async (formData: CreateFormRequest): Promise<{ form: FormSchema }> => {
    const response = await apiClient.post('/forms', formData);
    return response.data;
  },

  list: async (): Promise<{ forms: FormSchema[] }> => {
    const response = await apiClient.get('/forms');
    return response.data;
  },

  get: async (formId: string): Promise<{ form: FormSchema }> => {
    const response = await apiClient.get(`/form/${formId}`);
    return response.data;
  },

  submit: async (formId: string, data: Record<string, any>): Promise<{ response: FormResponse }> => {
    const response = await apiClient.post(`/forms/${formId}/submit`, { data });
    return response.data;
  },

  getResponses: async (formId: string): Promise<{ responses: FormResponse[] }> => {
    const response = await apiClient.get(`/forms/${formId}/responses`);
    return response.data;
  },
};

export default apiClient;
