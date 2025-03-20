import mongoose from 'mongoose';

const { Schema } = mongoose;

const categoryLimitSchema = new Schema({
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['HVAC', 'Lighting', 'Renewable', 'Other'], // Valid categories
        unique: true, // Ensure unique categories
    },
    maxConsumptionLimit: {
        type: Number,
        required: [true, 'Max consumption limit is required'],
        min: [0, 'Consumption limit must be a positive number'], // Ensure positive limit
    },
});

export default mongoose.model('CategoryLimit', categoryLimitSchema);
