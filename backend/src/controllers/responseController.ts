import { Request, Response } from 'express';
import { FormSchema, FormResponse, User } from '../models';
import { AirtableService } from '../services/airtableService';
import { shouldShowQuestion } from '../utils/conditionalLogic';


export const submitForm = async (req: Request, res: Response) => {
    try {
        const { formId } = req.params;
        const { answers } = req.body;

        if (!answers || typeof answers !== 'object') {
            return res.status(400).json({
                error: 'Invalid submission',
                details: 'answers object is required'
            });
        }

        // Get form schema
        const form = await FormSchema.findById(formId).populate('owner');
        if (!form) {
            return res.status(404).json({ error: 'Form not found' });
        }

        const formOwner = await User.findById(form.owner);
        if (!formOwner) {
            return res.status(500).json({ error: 'Form owner not found' });
        }

        const validationErrors: string[] = [];
        const airtableFields: Record<string, any> = {};

        for (const question of form.questions) {
            const shouldShow = shouldShowQuestion(question.conditionalRules, answers);

            if (!shouldShow) {
                continue;
            }

            const answer = answers[question.questionKey];

            if (question.required && (answer === undefined || answer === null || answer === '')) {
                validationErrors.push(`Question "${question.label}" (${question.questionKey}) is required`);
                continue;
            }

            if (answer === undefined || answer === null || answer === '') {
                continue;
            }

            switch (question.type) {
                case 'shortText':
                    if (typeof answer !== 'string') {
                        validationErrors.push(`Answer for "${question.label}" must be a string`);
                    } else {
                        airtableFields[question.fieldId] = answer;
                    }
                    break;

                case 'longText':
                    if (typeof answer !== 'string') {
                        validationErrors.push(`Answer for "${question.label}" must be a string`);
                    } else {
                        airtableFields[question.fieldId] = answer;
                    }
                    break;

                case 'singleSelect':
                    if (typeof answer !== 'string') {
                        validationErrors.push(`Answer for "${question.label}" must be a string`);
                    } else if (question.options && !question.options.includes(answer)) {
                        validationErrors.push(
                            `Answer for "${question.label}" must be one of: ${question.options.join(', ')}`
                        );
                    } else {
                        airtableFields[question.fieldId] = answer;
                    }
                    break;

                case 'multiSelect':
                    if (!Array.isArray(answer)) {
                        validationErrors.push(`Answer for "${question.label}" must be an array`);
                    } else if (question.options) {
                        const invalidOptions = answer.filter(opt => !question.options!.includes(opt));
                        if (invalidOptions.length > 0) {
                            validationErrors.push(
                                `Invalid options for "${question.label}": ${invalidOptions.join(', ')}`
                            );
                        } else {
                            airtableFields[question.fieldId] = answer;
                        }
                    } else {
                        airtableFields[question.fieldId] = answer;
                    }
                    break;

                case 'attachment':
                    if (!Array.isArray(answer)) {
                        validationErrors.push(`Answer for "${question.label}" must be an array of attachment objects`);
                    } else {
                        airtableFields[question.fieldId] = answer;
                    }
                    break;
            }
        }

        if (validationErrors.length > 0) {
            return res.status(400).json({
                error: 'Validation failed',
                details: validationErrors
            });
        }

        const airtableService = new AirtableService(formOwner.accessToken);
        let airtableRecord;

        try {
            airtableRecord = await airtableService.createRecord(
                form.airtableBaseId,
                form.airtableTableId,
                airtableFields
            );
        } catch (error: any) {
            console.error('Error creating Airtable record:', error.message);
            return res.status(500).json({
                error: 'Failed to save to Airtable',
                details: error.message
            });
        }

        const formResponse = await FormResponse.create({
            formId: form._id,
            airtableRecordId: airtableRecord.id,
            answers,
            status: 'submitted',
            deletedInAirtable: false
        });

        res.status(201).json({
            success: true,
            message: 'Form submitted successfully',
            responseId: formResponse._id,
            airtableRecordId: airtableRecord.id,
            response: formResponse
        });
    } catch (error: any) {
        console.error('Error submitting form:', error.message);
        res.status(500).json({
            error: 'Failed to submit form',
            details: error.message
        });
    }
};

export const listFormResponses = async (req: Request, res: Response) => {
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
            return res.status(403).json({ error: 'Access denied. You can only view responses to forms you created.' });
        }

        const includeDeleted = req.query.includeDeleted === 'true';

        const query: any = { formId };
        if (!includeDeleted) {
            query.deletedInAirtable = false;
        }

        const responses = await FormResponse.find(query)
            .sort({ createdAt: -1 });

        res.json({
            formId,
            responses,
            count: responses.length,
            includeDeleted
        });
    } catch (error: any) {
        console.error('Error listing responses:', error.message);
        res.status(500).json({
            error: 'Failed to list responses',
            details: error.message
        });
    }
};


export const getResponse = async (req: Request, res: Response) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const { responseId } = req.params;

        const response = await FormResponse.findById(responseId).populate('formId');
        if (!response) {
            return res.status(404).json({ error: 'Response not found' });
        }

        // Check if user is the owner of the form
        const form = response.formId as any;
        if (form.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: 'Access denied. You can only view responses to forms you created.' });
        }

        res.json({ response });
    } catch (error: any) {
        console.error('Error fetching response:', error.message);
        res.status(500).json({
            error: 'Failed to fetch response',
            details: error.message
        });
    }
};
