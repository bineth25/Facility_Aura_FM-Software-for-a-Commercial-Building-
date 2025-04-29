import express from 'express';
import { addTenantToSpace, updateTenantInfo, removeTenantFromSpace, getAllTenants, deleteTenant, checkTenantId, getExpiringLeases, sendExpiryEmail } from '../controllers/Tenants_Controller.js';

const router = express.Router();

router.post('/addTenantToSpace', addTenantToSpace);
router.post('/updateTenantInfo', updateTenantInfo);
router.post('/removeTenantFromSpace', removeTenantFromSpace);
router.get('/', getAllTenants); 
router.delete('/:tenantId', deleteTenant); 
router.get('/checkTenantId/:tenantId', checkTenantId); 
router.get('/expiring-leases', getExpiringLeases); 
router.post('/send-expiry-email', sendExpiryEmail); 

export default router;



