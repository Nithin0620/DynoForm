import mongoose, { Schema, Document } from 'mongoose';

export interface IFormResponse extends Document {
  formId: mongoose.Types.ObjectId;
  airtableRecordId: string;
  answers: Record<string, any>;
  status: 'submitted';
  deletedInAirtable: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FormResponseSchema = new Schema<IFormResponse>({
  formId: {
    type: Schema.Types.ObjectId,
    ref: 'FormSchema',
    required: true,
    index: true
  },
  airtableRecordId: {
    type: String,
    required: true,
    index: true
  },
  answers: {
    type: Schema.Types.Mixed,
    required: true
  },
  status: {
    type: String,
    enum: ['submitted'],
    default: 'submitted'
  },
  deletedInAirtable: {
    type: Boolean,
    default: false,
    index: true
  }
}, {
  timestamps: true
});

// Compound index for efficient queries
FormResponseSchema.index({ formId: 1, deletedInAirtable: 1 });

export const FormResponse = mongoose.model<IFormResponse>('FormResponse', FormResponseSchema);
