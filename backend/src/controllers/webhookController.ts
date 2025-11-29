import { Request, Response } from 'express';
import { FormResponse } from '../models';

/**
 * POST /webhooks/airtable
 * Webhook receiver for Airtable changes
 * Handles record.updated and record.deleted events
 */
export const handleAirtableWebhook = async (req: Request, res: Response) => {
  try {
    const { webhook } = req.body;

    if (!webhook) {
      return res.status(400).json({
        error: 'Invalid webhook payload',
        details: 'webhook object is required'
      });
    }

    // Airtable webhook structure varies, but typically includes:
    // - baseId
    // - tableId
    // - webhookId
    // - timestamp
    // - actionMetadata with changedTablesById

    const { baseId, actionMetadata } = webhook;

    if (!actionMetadata || !actionMetadata.changedTablesById) {
      console.log('No table changes in webhook');
      return res.status(200).json({ success: true, message: 'No changes to process' });
    }

    // Process each changed table
    for (const [tableId, changes] of Object.entries(actionMetadata.changedTablesById)) {
      const tableChanges = changes as any;

      // Handle created records (not typically needed for our use case)
      if (tableChanges.createdRecordsById) {
        console.log(`Created records in table ${tableId}:`, Object.keys(tableChanges.createdRecordsById).length);
      }

      // Handle updated records
      if (tableChanges.changedRecordsById) {
        console.log(`Updated records in table ${tableId}:`, Object.keys(tableChanges.changedRecordsById).length);
        
        for (const [recordId, recordChanges] of Object.entries(tableChanges.changedRecordsById)) {
          const changes = recordChanges as any;
          
          // Find the response in our database
          const response = await FormResponse.findOne({ airtableRecordId: recordId });
          
          if (response) {
            // Update the answers with new field values
            if (changes.current && changes.current.cellValuesByFieldId) {
              const updatedAnswers = { ...response.answers };
              
              // Map Airtable field IDs to our question keys
              // This requires looking up the form schema
              const FormSchema = (await import('../models')).FormSchema;
              const form = await FormSchema.findById(response.formId);
              
              if (form) {
                // Create a map of fieldId to questionKey
                const fieldMap = new Map<string, string>();
                form.questions.forEach(q => {
                  fieldMap.set(q.fieldId, q.questionKey);
                });

                // Update answers based on changed fields
                for (const [fieldId, newValue] of Object.entries(changes.current.cellValuesByFieldId)) {
                  const questionKey = fieldMap.get(fieldId);
                  if (questionKey) {
                    updatedAnswers[questionKey] = newValue;
                  }
                }

                response.answers = updatedAnswers;
                response.updatedAt = new Date();
                await response.save();
                
                console.log(`Updated response ${response._id} for record ${recordId}`);
              }
            }
          }
        }
      }

      // Handle deleted records - soft delete in MongoDB
      if (tableChanges.destroyedRecordIds) {
        console.log(`Deleted records in table ${tableId}:`, tableChanges.destroyedRecordIds.length);
        
        for (const recordId of tableChanges.destroyedRecordIds) {
          const response = await FormResponse.findOne({ airtableRecordId: recordId });
          
          if (response) {
            // Soft delete - set flag instead of removing from DB
            response.deletedInAirtable = true;
            response.updatedAt = new Date();
            await response.save();
            
            console.log(`Marked response ${response._id} as deleted for record ${recordId}`);
          }
        }
      }
    }

    res.status(200).json({
      success: true,
      message: 'Webhook processed successfully'
    });
  } catch (error: any) {
    console.error('Webhook processing error:', error.message);
    // Return 200 to prevent Airtable from retrying
    // Log the error for investigation
    res.status(200).json({
      success: false,
      error: 'Webhook processing failed',
      details: error.message
    });
  }
};

/**
 * GET /webhooks/airtable/test
 * Test endpoint to verify webhook is accessible
 */
export const testWebhook = (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Webhook endpoint is accessible',
    timestamp: new Date().toISOString()
  });
};
