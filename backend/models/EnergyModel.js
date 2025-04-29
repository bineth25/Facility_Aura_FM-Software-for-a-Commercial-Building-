import mongoose from 'mongoose';

const { Schema } = mongoose;


const validMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const energySchema = new Schema({
    year: {
        type: Number, 
        required: [true, 'Year is required'], 
        min: [2000, 'Year must be at least 2000'], 
        max: [new Date().getFullYear(), 'Year cannot be in the future'], 
    },

    month: {
        type: String, 
        required: [true, 'Month is required'], 
        trim: true, 
        enum: {
            values: validMonths, 
            message: '{VALUE} is not a valid month' // Custom error message
        }
    },

    floor: {
        type: Number, 
        required: [true, 'Floor is required'], 
        min: [1, 'Floor must be a positive integer'], 
        max: [100, 'Floor value exceeds limit'], 
        default: 1, 
    },

    category: {
        type: String, 
        required: [true, 'Category is required'], 
        trim: true, 
        enum: {
            values: ['HVAC', 'Lighting', 'Renewable', 'Other'], 
            message: '{VALUE} is not a valid category' 
        }
    },

    reading: {
        type: Number, 
        required: [true, 'Reading is required'], 
        min: [0, 'Reading must be a positive number'], 
    },

    isExceeded: {
        type: Boolean,
        default: false,  
    }
    
});

export default mongoose.model('EnergyModel', energySchema);
