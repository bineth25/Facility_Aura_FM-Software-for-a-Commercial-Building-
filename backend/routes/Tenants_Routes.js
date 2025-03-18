import express from 'express';
import { addTenantToSpace, removeTenantFromSpace, updateTenantInfo } from '../controllers/Tenants_Controller.js';

const router = express.Router();

// Define routes for tenant management
router.post('/addTenantToSpace', addTenantToSpace);
router.post('/removeTenantFromSpace', removeTenantFromSpace);
router.put('/updateTenantInfo', updateTenantInfo);

export default router;

/*
import {addTenant, getAllTenants, getTenantById, updateTenantById, deleteTenantById} from '../controllers/Tenants_Controller.js';
const tenantRouter = express.Router();

// Define routes and link them to the controller functions
tenantRouter.post('/add', addTenant);
tenantRouter.get('/', getAllTenants);
tenantRouter.get('/:id', getTenantById);
tenantRouter.put('/update/:id', updateTenantById);
tenantRouter.delete('/delete/:id', deleteTenantById);

export default tenantRouter;
*/
