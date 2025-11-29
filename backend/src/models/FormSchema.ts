import mongoose, { Schema, Document } from 'mongoose';

export type QuestionType = 'shortText' | 'longText' | 'singleSelect' | 'multiSelect' | 'attachment';

export interface IConditionalRules {
  logic: 'AND' | 'OR';
  conditions: Array<{
    questionKey: string;
    operator: 'equals' | 'notEquals' | 'contains';
    value: any;
  }>;
}

export interface IQuestion {
  questionKey: string;
  fieldId: string;
  label: string;
  type: QuestionType;
  required: boolean;
  options?: string[]; 
  conditionalRules?: IConditionalRules | null;
}

export interface IFormSchema extends Document {
  owner: mongoose.Types.ObjectId;
  airtableBaseId: string;
  airtableTableId: string;
  questions: IQuestion[];
  createdAt: Date;
  updatedAt: Date;
}

const ConditionalRulesSchema = new Schema<IConditionalRules>({
  logic: {
    type: String,
    enum: ['AND', 'OR'],
    required: true
  },
  conditions: [{
    questionKey: {
      type: String,
      required: true
    },
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains'],
      required: true
    },
    value: {
      type: Schema.Types.Mixed,
      required: true
    }
  }]
}, { _id: false });

const QuestionSchema = new Schema<IQuestion>({
  questionKey: {
    type: String,
    required: true
  },
  fieldId: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['shortText', 'longText', 'singleSelect', 'multiSelect', 'attachment'],
    required: true
  },
  required: {
    type: Boolean,
    default: false
  },
  options: [{
    type: String
  }],
  conditionalRules: {
    type: ConditionalRulesSchema,
    default: null
  }
}, { _id: false });

const FormSchemaSchema = new Schema<IFormSchema>({
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  airtableBaseId: {
    type: String,
    required: true
  },
  airtableTableId: {
    type: String,
    required: true
  },
  questions: {
    type: [QuestionSchema],
    required: true,
    validate: {
      validator: function(questions: IQuestion[]) {
        const keys = questions.map(q => q.questionKey);
        return keys.length === new Set(keys).size;
      },
      message: 'Question keys must be unique within a form'
    }
  }
}, {
  timestamps: true
});

export const FormSchema = mongoose.model<IFormSchema>('FormSchema', FormSchemaSchema);
