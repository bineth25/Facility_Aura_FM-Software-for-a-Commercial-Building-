import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema({

    Tenant_ID: {
        type: String,
        required: true
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
    }
});

const Tenant = mongoose.models.Tenant || mongoose.model('Tenant_Detail', tenantSchema);
export default Tenant;