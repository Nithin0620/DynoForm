import { Request, Response } from 'express';
import { FormSchema, IQuestion } from '../models';
import { body, validationResult } from 'express-validator';
import { isSupportedFieldType, mapAirtableTypeToQuestionType } from '../utils/fieldTypeValidation';

/**
 * POST /forms
 * Create a new form schema
 */
export const createForm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { airtableBaseId, airtableTableId, questions } = req.body;

    // Validate required fields
    if (!airtableBaseId || !airtableTableId || !questions || !Array.isArray(questions)) {
      return res.status(400).json({
        error: 'Invalid request',
        details: 'airtableBaseId, airtableTableId, and questions array are required'
      });
    }

    // Validate questions
    const questionKeys = new Set<string>();
    for (const question of questions) {
      // Check required fields
      if (!question.questionKey || !question.fieldId || !question.label || !question.type) {
        return res.status(400).json({
          error: 'Invalid question format',
          details: 'Each question must have questionKey, fieldId, label, and type'
        });
      }

      // Check for duplicate question keys
      if (questionKeys.has(question.questionKey)) {
        return res.status(400).json({
          error: 'Duplicate question key',
          details: `Question key "${question.questionKey}" is used more than once`
        });
      }
      questionKeys.add(question.questionKey);

      // Validate field type is supported
      const validTypes = ['shortText', 'longText', 'singleSelect', 'multiSelect', 'attachment'];
      if (!validTypes.includes(question.type)) {
        return res.status(400).json({
          error: 'Unsupported field type',
          details: `Field type "${question.type}" is not supported. Only ${validTypes.join(', ')} are allowed.`
        });
      }

      // Validate select types have options
      if ((question.type === 'singleSelect' || question.type === 'multiSelect') && 
          (!question.options || !Array.isArray(question.options) || question.options.length === 0)) {
        return res.status(400).json({
          error: 'Invalid select field',
          details: `Question "${question.questionKey}" is a select type but has no options`
        });
      }

      // Validate conditional rules if present
      if (question.conditionalRules) {
        const rules = question.conditionalRules;
        
        if (!rules.logic || !['AND', 'OR'].includes(rules.logic)) {
          return res.status(400).json({
            error: 'Invalid conditional rules',
            details: `Question "${question.questionKey}" has invalid logic. Must be "AND" or "OR"`
          });
        }

        if (!rules.conditions || !Array.isArray(rules.conditions) || rules.conditions.length === 0) {
          return res.status(400).json({
            error: 'Invalid conditional rules',
            details: `Question "${question.questionKey}" has conditional rules but no conditions`
          });
        }

        for (const condition of rules.conditions) {
          if (!condition.questionKey || !condition.operator || condition.value === undefined) {
            return res.status(400).json({
              error: 'Invalid condition',
              details: `Condition must have questionKey, operator, and value`
            });
          }

          if (!['equals', 'notEquals', 'contains'].includes(condition.operator)) {
            return res.status(400).json({
              error: 'Invalid operator',
              details: `Operator must be one of: equals, notEquals, contains`
            });
          }

          // Check that referenced question exists and comes before this one
          const refIndex = questions.findIndex((q: any) => q.questionKey === condition.questionKey);
          const currentIndex = questions.findIndex((q: any) => q.questionKey === question.questionKey);
          
          if (refIndex === -1) {
            return res.status(400).json({
              error: 'Invalid condition reference',
              details: `Question "${question.questionKey}" references non-existent question "${condition.questionKey}"`
            });
          }

          if (refIndex >= currentIndex) {
            return res.status(400).json({
              error: 'Invalid condition reference',
              details: `Question "${question.questionKey}" cannot reference a question that comes after it`
            });
          }
        }
      }
    }

    // Create form schema
    const formSchema = await FormSchema.create({
      owner: req.user._id,
      airtableBaseId,
      airtableTableId,
      questions
    });

    res.status(201).json({
      success: true,
      formId: formSchema._id,
      form: formSchema
    });
  } catch (error: any) {
    console.error('Error creating form:', error.message);
    res.status(500).json({
      error: 'Failed to create form',
      details: error.message
    });
  }
};

/**
 * GET /form/:formId
 * Get a form schema by ID
 */
export const getForm = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { formId } = req.params;

    const form = await FormSchema.findById(formId);

    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }

    // Check authorization
    if (req.user.role !== 'admin' && form.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ form });
  } catch (error: any) {
    console.error('Error fetching form:', error.message);
    res.status(500).json({
      error: 'Failed to fetch form',
      details: error.message
    });
  }
};

/**
 * GET /forms
 * List all forms (for current user, or all if admin)
 */
export const listForms = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const query = req.user.role === 'admin' ? {} : { owner: req.user._id };
    const forms = await FormSchema.find(query)
      .populate('owner', 'name email')
      .sort({ createdAt: -1 });

    res.json({ forms, count: forms.length });
  } catch (error: any) {
    console.error('Error listing forms:', error.message);
    res.status(500).json({
      error: 'Failed to list forms',
      details: error.message
    });
  }
};
