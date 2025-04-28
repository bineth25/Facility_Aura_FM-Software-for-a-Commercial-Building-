import Space from '../models/Space.js';
import Tenant from '../models/Tenants_Details.js';
import { sendLeaseExpiryEmail } from '../config/emailSender.js';
import { catchAsync, AppError } from '../utils/errorHandler.js';

// Add Tenant to Space
export const addTenantToSpace = catchAsync(async (req, res) => {
  const { spaceId, tenantData } = req.body;

  if (!spaceId || !tenantData) {
    throw new AppError('Missing required data: spaceId or tenantData', 400, 'MISSING_DATA');
  }

  const space = await Space.findOne({ spaceId });

  if (!space) {
    throw new AppError('Space not found', 404, 'SPACE_NOT_FOUND');
  }

  if (!space.isAvailable) {
    throw new AppError('Space is not available', 409, 'SPACE_UNAVAILABLE');
  }

  const existingTenant = await Tenant.findOne({ Tenant_ID: tenantData.Tenant_ID });
  if (existingTenant) {
    throw new AppError('Tenant ID already exists', 409, 'TENANT_ID_EXISTS');
  }

  const tenant = new Tenant({
    Tenant_ID: tenantData.Tenant_ID,
    name: tenantData.name,
    nic: tenantData.nic,
    email: tenantData.email,
    phone: tenantData.phone,
    address: tenantData.address,
    description: tenantData.description,
    leaseStartDate: tenantData.leaseStartDate,
    leaseEndDate: tenantData.leaseEndDate,
    spaceId: spaceId
  });

  await tenant.save();

  space.isAvailable = false;
  space.tenant = tenant._id;
  await space.save();

  res.status(200).json({
    success: true,
    message: 'Tenant added to space successfully',
    tenant: tenant,
  });
});



// Remove Tenant from Space
export const removeTenantFromSpace = async (req, res) => {
  try {
    const { spaceId, tenantId } = req.body;

    const space = await Space.findOne({ spaceId });

    if (!space || space.isAvailable) {
      return res.status(404).json({ message: 'Space is available or does not exist.' });
    }

    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    space.isAvailable = true;
    space.tenant = null;
    await space.save();

    await tenant.remove();

    res.status(200).json({ message: 'Tenant removed from space successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing tenant from space', error });
  }
};

// Update Tenant Information
export const updateTenantInfo = async (req, res) => {
  try {
    const { tenantId, tenantData } = req.body;

    const tenant = await Tenant.findOne({ Tenant_ID: tenantId });

    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found.' });
    }

    tenant.name = tenantData.name || tenant.name;
    tenant.nic = tenantData.nic || tenant.nic;
    tenant.email = tenantData.email || tenant.email;
    tenant.phone = tenantData.phone || tenant.phone;
    tenant.address = tenantData.address || tenant.address;
    tenant.description = tenantData.description || tenant.description;
    tenant.leaseStartDate = tenantData.leaseStartDate || tenant.leaseStartDate;
    tenant.leaseEndDate = tenantData.leaseEndDate || tenant.leaseEndDate;

    await tenant.save();

    res.status(200).json({ message: 'Tenant information updated successfully', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error updating tenant information', error });
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

// Check if Tenant ID exists
export const checkTenantId = async (req, res) => {
  try {
    const tenant = await Tenant.findOne({ Tenant_ID: req.params.tenantId });
    res.json({ exists: !!tenant });
  } catch (error) {
    res.status(500).json({ message: 'Error checking Tenant ID', error });
  }
};

// Check Tenants Whose Lease is About to Expire
export const getExpiringLeases = async (req, res) => {
  try {
    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + 30); // 30 days from today

    const expiringTenants = await Tenant.find({
      leaseEndDate: { $gte: today, $lte: futureDate }
    });

    res.status(200).json(expiringTenants);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching expiring leases', error });
  }
};


// Send Lease Expiry Email to Tenant
export const sendExpiryEmail = async (req, res) => {
  try {
    const { email, name, leaseEndDate } = req.body;

    // Validate required fields
    if (!email || !name || !leaseEndDate) {
      return res.status(400).json({
        success: false,
        message: 'Missing required email data'
      });
    }

    await sendLeaseExpiryEmail(email, name, leaseEndDate);

    res.status(200).json({
      success: true,
      message: 'Email sent successfully'
    });
  } catch (error) {
    console.error('Error in sendExpiryEmail controller:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send email'
    });
  }
};
