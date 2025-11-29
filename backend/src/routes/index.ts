import express from 'express';
import { authenticate } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as airtableController from '../controllers/airtableController';
import * as formController from '../controllers/formController';
import * as responseController from '../controllers/responseController';
import * as webhookController from '../controllers/webhookController';

const router = express.Router();


router.get('/auth/airtable', authController.initiateOAuth);
router.get('/auth/airtable/callback', authController.handleOAuthCallback);

// ============================================
// AIRTABLE DATA SELECTION ROUTES
// ============================================
router.get('/airtable/bases', authenticate, airtableController.listBases);
router.get('/airtable/base/:baseId/tables', authenticate, airtableController.listTables);
router.get('/airtable/table/:baseId/:tableId/fields', authenticate, airtableController.getTableFields);

// ============================================
// FORM BUILDER ROUTES
// ============================================
router.post('/forms', authenticate, formController.createForm);
router.get('/forms', authenticate, formController.listForms);
router.get('/form/:formId', authenticate, formController.getForm);

// ============================================
// FORM SUBMISSION ROUTES
// ============================================
router.post('/forms/:formId/submit', responseController.submitForm);

// ============================================
// RESPONSE LISTING ROUTES
// ============================================
router.get('/forms/:formId/responses', authenticate, responseController.listFormResponses);
router.get('/responses/:responseId', authenticate, responseController.getResponse);

// ============================================
// WEBHOOK ROUTES
// ============================================
router.post('/webhooks/airtable', webhookController.handleAirtableWebhook);
router.get('/webhooks/airtable/test', webhookController.testWebhook);

// ============================================
// HEALTH CHECK
// ============================================
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

export default router;
