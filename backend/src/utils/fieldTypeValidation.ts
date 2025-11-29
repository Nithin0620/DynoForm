import { QuestionType } from '../models';

// Supported Airtable field types
export const SUPPORTED_FIELD_TYPES = [
  'singleLineText',
  'multilineText',
  'singleSelect',
  'multipleSelects',
  'multipleAttachments'
] as const;

/**
 * Maps Airtable field type to our internal question type
 */
export function mapAirtableTypeToQuestionType(airtableType: string): QuestionType | null {
  const typeMap: Record<string, QuestionType> = {
    'singleLineText': 'shortText',
    'multilineText': 'longText',
    'singleSelect': 'singleSelect',
    'multipleSelects': 'multiSelect',
    'multipleAttachments': 'attachment'
  };

  return typeMap[airtableType] || null;
}

/**
 * Checks if an Airtable field type is supported
 */
export function isSupportedFieldType(airtableType: string): boolean {
  return SUPPORTED_FIELD_TYPES.includes(airtableType as any);
}

/**
 * Validates that a field is supported
 */
export function validateFieldType(field: any): { valid: boolean; error?: string } {
  if (!field.type) {
    return { valid: false, error: 'Field type is required' };
  }

  if (!isSupportedFieldType(field.type)) {
    return {
      valid: false,
      error: `Unsupported field type: ${field.type}. Only ${SUPPORTED_FIELD_TYPES.join(', ')} are supported.`
    };
  }

  return { valid: true };
}
