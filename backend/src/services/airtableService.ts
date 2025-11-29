import axios, { AxiosInstance } from 'axios';

const AIRTABLE_API_BASE_URL = process.env.AIRTABLE_API_BASE_URL || 'https://api.airtable.com/v0';

export class AirtableService {
  private axiosInstance: AxiosInstance;

  constructor(accessToken: string) {
    this.axiosInstance = axios.create({
      baseURL: AIRTABLE_API_BASE_URL,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * List all bases accessible to the user
   */
  async listBases() {
    try {
      const response = await this.axiosInstance.get('/meta/bases');
      return response.data.bases;
    } catch (error: any) {
      throw new Error(`Failed to fetch bases: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get schema for a specific base
   */
  async getBaseSchema(baseId: string) {
    try {
      const response = await this.axiosInstance.get(`/meta/bases/${baseId}/tables`);
      return response.data.tables;
    } catch (error: any) {
      throw new Error(`Failed to fetch base schema: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get fields for a specific table
   */
  async getTableFields(baseId: string, tableIdOrName: string) {
    try {
      const tables = await this.getBaseSchema(baseId);
      const table = tables.find((t: any) => t.id === tableIdOrName || t.name === tableIdOrName);
      
      if (!table) {
        throw new Error(`Table ${tableIdOrName} not found in base ${baseId}`);
      }

      return table.fields;
    } catch (error: any) {
      throw new Error(`Failed to fetch table fields: ${error.message}`);
    }
  }

  /**
   * Create a record in Airtable
   */
  async createRecord(baseId: string, tableIdOrName: string, fields: Record<string, any>) {
    try {
      const response = await this.axiosInstance.post(`/${baseId}/${tableIdOrName}`, {
        fields
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to create record: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Update a record in Airtable
   */
  async updateRecord(baseId: string, tableIdOrName: string, recordId: string, fields: Record<string, any>) {
    try {
      const response = await this.axiosInstance.patch(`/${baseId}/${tableIdOrName}/${recordId}`, {
        fields
      });
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to update record: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Get a specific record from Airtable
   */
  async getRecord(baseId: string, tableIdOrName: string, recordId: string) {
    try {
      const response = await this.axiosInstance.get(`/${baseId}/${tableIdOrName}/${recordId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to fetch record: ${error.response?.data?.error?.message || error.message}`);
    }
  }

  /**
   * Delete a record from Airtable
   */
  async deleteRecord(baseId: string, tableIdOrName: string, recordId: string) {
    try {
      const response = await this.axiosInstance.delete(`/${baseId}/${tableIdOrName}/${recordId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(`Failed to delete record: ${error.response?.data?.error?.message || error.message}`);
    }
  }
}
