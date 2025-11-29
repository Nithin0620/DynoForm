import { Request, Response } from 'express';
import { User } from '../models';
import { AirtableService } from '../services/airtableService';
import { isSupportedFieldType, mapAirtableTypeToQuestionType } from '../utils/fieldTypeValidation';

/**
 * GET /airtable/bases
 * List all bases accessible to the authenticated user
 */
export const listBases = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const airtableService = new AirtableService(req.user.accessToken);
    const bases = await airtableService.listBases();

    res.json({ bases });
  } catch (error: any) {
    console.error('Error listing bases:', error.message);
    res.status(500).json({ error: 'Failed to fetch bases', details: error.message });
  }
};

/**
 * GET /airtable/base/:baseId/tables
 * List all tables in a specific base
 */
export const listTables = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { baseId } = req.params;
    const airtableService = new AirtableService(req.user.accessToken);
    const tables = await airtableService.getBaseSchema(baseId);

    res.json({ tables });
  } catch (error: any) {
    console.error('Error listing tables:', error.message);
    res.status(500).json({ error: 'Failed to fetch tables', details: error.message });
  }
};

/**
 * GET /airtable/table/:baseId/:tableId/fields
 * Get fields for a specific table, filtering to only supported types
 */
export const getTableFields = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { baseId, tableId } = req.params;
    const airtableService = new AirtableService(req.user.accessToken);
    const fields = await airtableService.getTableFields(baseId, tableId);

    // Filter to only supported field types
    const supportedFields = fields.filter((field: any) => {
      return isSupportedFieldType(field.type);
    });

    // Map to our internal format
    const mappedFields = supportedFields.map((field: any) => ({
      id: field.id,
      name: field.name,
      type: field.type,
      mappedType: mapAirtableTypeToQuestionType(field.type),
      options: field.options?.choices?.map((c: any) => c.name) || undefined
    }));

    // Also return rejected fields for transparency
    const unsupportedFields = fields.filter((field: any) => {
      return !isSupportedFieldType(field.type);
    }).map((field: any) => ({
      id: field.id,
      name: field.name,
      type: field.type,
      reason: 'Unsupported field type'
    }));

    res.json({
      supportedFields: mappedFields,
      unsupportedFields,
      totalFields: fields.length,
      supportedCount: mappedFields.length,
      unsupportedCount: unsupportedFields.length
    });
  } catch (error: any) {
    console.error('Error fetching table fields:', error.message);
    res.status(500).json({ error: 'Failed to fetch table fields', details: error.message });
  }
};
