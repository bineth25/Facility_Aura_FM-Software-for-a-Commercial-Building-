import express from 'express';
import { addTenantToSpace, updateTenantInfo, removeTenantFromSpace, getAllTenants, deleteTenant, checkTenantId } from '../controllers/Tenants_Controller.js';

const router = express.Router();

// Define routes for tenant management
router.post('/addTenantToSpace', addTenantToSpace);
router.post('/updateTenantInfo', updateTenantInfo);
router.post('/removeTenantFromSpace', removeTenantFromSpace);
router.get('/', getAllTenants); // Fetch all tenants
router.delete('/:tenantId', deleteTenant); // Delete a tenant
router.get('/checkTenantId/:tenantId', checkTenantId);

export default router;



