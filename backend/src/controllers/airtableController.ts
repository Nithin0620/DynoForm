import { Request, Response } from 'express';
import { User } from '../models';
import { AirtableService } from '../services/airtableService';
import { isSupportedFieldType, mapAirtableTypeToQuestionType } from '../utils/fieldTypeValidation';


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


export const getTableFields = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { baseId, tableId } = req.params;
    const airtableService = new AirtableService(req.user.accessToken);
    const fields = await airtableService.getTableFields(baseId, tableId);

    const supportedFields = fields.filter((field: any) => {
      return isSupportedFieldType(field.type);
    });

    const mappedFields = supportedFields.map((field: any) => ({
      id: field.id,
      name: field.name,
      type: field.type,
      mappedType: mapAirtableTypeToQuestionType(field.type),
      options: field.options?.choices?.map((c: any) => c.name) || undefined
    }));

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
