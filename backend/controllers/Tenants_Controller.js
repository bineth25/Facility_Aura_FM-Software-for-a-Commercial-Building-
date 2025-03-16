import Tenants_Details from '../models/Tenants_Details.js';

// Add a new tenant
export const addTenant = async (req, res) => {
    try {
        const { Tenant_ID, name, nic, email, phone, address } = req.body;

        // Validate required fields
        if (!Tenant_ID || !name || !nic || !email || !phone || !address) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for duplicate Tenant_ID
        const existingTenant = await Tenants_Details.findOne({ Tenant_ID });
        if (existingTenant) {
            return res.status(400).json({ message: 'Tenant ID already exists' });
        }

        const tenant = new Tenants_Details({ Tenant_ID, name, nic, email, phone, address });
        await tenant.save();

        res.status(201).json({ message: 'Tenant added successfully', tenant });
    } catch (error) {
        res.status(500).json({ message: 'Error adding tenant', error: error.message });
    }
};

// Get all tenants
export const getAllTenants = async (req, res) => {
    try {
        const tenants = await Tenants_Details.find();
        res.json(tenants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get tenant by ID
export const getTenantById = async (req, res) => {
    try {
        const tenant = await Tenants_Details.findById(req.params.id);
        if (!tenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.json(tenant);
    } catch (error) {
        res.status(400).json({ message: 'Error fetching tenant', error: error.message });
    }
};

// Update tenant by ID
export const updateTenantById = async (req, res) => {
    try {
        const { Tenant_ID, name, nic, email, phone, address } = req.body;

        const updatedTenant = await Tenants_Details.findByIdAndUpdate(
            req.params.id,
            { Tenant_ID, name, nic, email, phone, address },
            { new: true }
        );

        if (!updatedTenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }

        res.status(200).json({ message: 'Tenant updated successfully', tenant: updatedTenant });
    } catch (error) {
        res.status(400).json({ message: 'Error updating tenant', error: error.message });
    }
};

// Delete tenant by ID
export const deleteTenantById = async (req, res) => {
    try {
        const deletedTenant = await Tenants_Details.findByIdAndDelete(req.params.id);
        if (!deletedTenant) {
            return res.status(404).json({ message: 'Tenant not found' });
        }
        res.status(200).json({ message: 'Tenant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting tenant', error: error.message });
    }
};