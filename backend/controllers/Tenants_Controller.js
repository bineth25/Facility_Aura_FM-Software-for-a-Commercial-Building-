import Space from '../models/Space.js';
import Tenant from '../models/Tenants_Details.js';

// Add Tenant to Space
export const addTenantToSpace = async (req, res) => {
  try {
    const { spaceId, tenantData } = req.body;

    // Find the space by spaceId
    const space = await Space.findOne({ spaceId });

    if (!space || !space.isAvailable) {
      return res.status(404).json({ message: 'Space is not available or does not exist.' });
    }

    // Create a new tenant using the tenantData
    const tenant = new Tenant({
      Tenant_ID: tenantData.Tenant_ID,
      name: tenantData.name,
      nic: tenantData.nic,
      email: tenantData.email,
      phone: tenantData.phone,
      address: tenantData.address,
      description: tenantData.description,
      other: tenantData.other || null // Ensure `other` field is handled
    });

    // Save the tenant to the database
    await tenant.save();  // Ensure this line successfully saves the tenant

    // Update the space to be unavailable
    space.isAvailable = false;
    await space.save();

    res.status(200).json({
      message: 'Tenant added to space successfully',
      tenant: tenant,  // Return the saved tenant object
    });

  } catch (error) {
    res.status(500).json({ message: 'Error adding tenant to space', error });
  }
};


// Remove Tenant from Space (without deleting tenant record)
// Remove Tenant from Space (without deleting tenant record)
export const removeTenantFromSpace = async (req, res) => {
  try {
    const { spaceId, tenantId } = req.body;

    // Find the space by spaceId
    const space = await Space.findOne({ spaceId });

    if (!space || space.isAvailable) {
      return res.status(404).json({ message: 'Space is already available or does not exist.' });
    }

    // Ensure the tenant exists in the space
    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Disassociate the tenant from the space
    space.isAvailable = true;  // Space becomes available again
    space.tenant = null; // Remove the tenant allocation from the space

    // Save the updated space
    await space.save();

    res.status(200).json({ message: 'Tenant removed from space successfully (tenant info remains intact)' });
  } catch (error) {
    console.error('Error removing tenant from space:', error);
    res.status(500).json({ message: 'Error removing tenant from space', error });
  }
};

// Update Tenant Information
export const updateTenantInfo = async (req, res) => {
  try {
    const { tenantId, updatedData } = req.body;

    console.log("Tenant ID:", tenantId); // Add this line to check the tenantId

    // Find tenant by tenantId
    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      console.log("Tenant not found"); // Add this line for debugging
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Update tenant details
    Object.keys(updatedData).forEach(key => {
      tenant[key] = updatedData[key]; // Update fields dynamically
    });

    // Save updated tenant information
    await tenant.save();

    res.status(200).json({ message: 'Tenant information updated successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tenant information', error });
  }
};


/*

import Tenants_Details from '../models/Tenants_Details.js';
// Add a new tenant
export const addTenant = async (req, res) => {
    try {
        const { Tenant_ID, name, nic, email, phone, address,description } = req.body;

        // Validate required fields
        if (!Tenant_ID || !name || !nic || !email || !phone || !address || !description ) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check for duplicate Tenant_ID
        const existingTenant = await Tenants_Details.findOne({ Tenant_ID });
        if (existingTenant) {
            return res.status(400).json({ message: 'Tenant ID already exists' });
        }

        const tenant = new Tenants_Details({ Tenant_ID, name, nic, email, phone, address, description });
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
        const { Tenant_ID, name, nic, email, phone, address, description } = req.body;

        const updatedTenant = await Tenants_Details.findByIdAndUpdate(
            req.params.id,
            { Tenant_ID, name, nic, email, phone, address, description },
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
*/