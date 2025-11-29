import { Request, Response } from 'express';
import { FormSchema, IQuestion } from '../models';
import { body, validationResult } from 'express-validator';
import { isSupportedFieldType, mapAirtableTypeToQuestionType } from '../utils/fieldTypeValidation';


export const createForm = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { airtableBaseId, airtableTableId, questions } = req.body;

        if (!airtableBaseId || !airtableTableId || !questions || !Array.isArray(questions)) {
            return res.status(400).json({
                error: 'Invalid request',
                details: 'airtableBaseId, airtableTableId, and questions array are required'
            });
        }

        const questionKeys = new Set<string>();
        for (const question of questions) {
            if (!question.questionKey || !question.fieldId || !question.label || !question.type) {
                return res.status(400).json({
                    error: 'Invalid question format',
                    details: 'Each question must have questionKey, fieldId, label, and type'
                });
            }

            if (questionKeys.has(question.questionKey)) {
                return res.status(400).json({
                    error: 'Duplicate question key',
                    details: `Question key "${question.questionKey}" is used more than once`
                });
            }
            questionKeys.add(question.questionKey);

            const validTypes = ['shortText', 'longText', 'singleSelect', 'multiSelect', 'attachment'];
            if (!validTypes.includes(question.type)) {
                return res.status(400).json({
                    error: 'Unsupported field type',
                    details: `Field type "${question.type}" is not supported. Only ${validTypes.join(', ')} are allowed.`
                });
            }

            if ((question.type === 'singleSelect' || question.type === 'multiSelect') &&
                (!question.options || !Array.isArray(question.options) || question.options.length === 0)) {
                return res.status(400).json({
                    error: 'Invalid select field',
                    details: `Question "${question.questionKey}" is a select type but has no options`
                });
            }

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

        // Check if user is the owner of the form
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You can only access forms you created.' });
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


export const listForms = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        // Users can only see their own forms
        const forms = await FormSchema.find({ owner: req.user._id })
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
