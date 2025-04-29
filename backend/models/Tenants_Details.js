import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({

    Tenant_ID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    nic: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    leaseStartDate: {
        type: Date,
        required: true
    },
    leaseEndDate: {
        type: Date,
        required: true
      },
    spaceId: { 
        type: String,
        required: true
    }
});

const Tenant = mongoose.models.Tenant || mongoose.model('Tenant_Detail', tenantSchema);
export default Tenant;