export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  success: boolean;
  userId: string;
  user: User;
}

export interface AirtableBase {
  id: string;
  name: string;
  permissionLevel: string;
}

export interface AirtableField {
  id: string;
  name: string;
  type: string;
  mappedType?: string;
  options?: string[];
}

export interface AirtableTable {
  id: string;
  name: string;
  primaryFieldId: string;
  fields: AirtableField[];
}

export interface ConditionalLogic {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: any;
  action: 'show' | 'hide';
  targetFieldIds: string[];
}

export interface FormField {
  fieldId: string;
  label: string;
  type: string;
  required: boolean;
  options?: string[];
  conditionalLogic?: ConditionalLogic[];
}

export interface FormSchema {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  airtableBaseId: string;
  airtableTableId: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormResponse {
  _id: string;
  formId: string;
  data: Record<string, any>;
  airtableRecordId?: string;
  submittedAt: string;
}

export interface CreateFormRequest {
  title: string;
  description?: string;
  airtableBaseId: string;
  airtableTableId: string;
  fields: FormField[];
}
