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

// Update Tenant Information
export const updateTenantInfo = async (req, res) => {
  try {
    const { tenantId, tenantData } = req.body;

    // Find the tenant by Tenant_ID
    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Update tenant information
    tenant.name = tenantData.name || tenant.name;
    tenant.nic = tenantData.nic || tenant.nic;
    tenant.email = tenantData.email || tenant.email;
    tenant.phone = tenantData.phone || tenant.phone;
    tenant.address = tenantData.address || tenant.address;
    tenant.description = tenantData.description || tenant.description;
    tenant.other = tenantData.other || tenant.other;

    // Save the updated tenant
    await tenant.save();

    res.status(200).json({ message: 'Tenant information updated successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tenant information', error });
  }
};


// Remove Tenant from Space
export const removeTenantFromSpace = async (req, res) => {
  try {
    const { spaceId, tenantId } = req.body;

    // Find the space by spaceId
    const space = await Space.findOne({ spaceId });

    if (!space || space.isAvailable) {
      return res.status(404).json({ message: 'Space is available or does not exist.' });
    }

    // Find the tenant by Tenant_ID
    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    // Update the space to be available
    space.isAvailable = true;
    space.tenant = null;
    await space.save();

    // Remove the tenant from the database
    await tenant.remove();

    res.status(200).json({ message: 'Tenant removed from space successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing tenant from space', error });
  }
};

// Fetch all tenants
export const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find();
    res.status(200).json(tenants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tenants', error });
  }
};

// Delete a tenant
export const deleteTenant = async (req, res) => {
  try {
    const { tenantId } = req.params;
    await Tenant.findOneAndDelete({ Tenant_ID: tenantId });
    res.status(200).json({ message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting tenant', error });
  }
};
