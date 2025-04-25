import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the valid months
const validMonths = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const energySchema = new Schema({
    year: {
        type: Number, // DataType
        required: [true, 'Year is required'], // Validation with custom error message
        min: [2000, 'Year must be at least 2000'], // Validation for minimum year
        max: [new Date().getFullYear(), 'Year cannot be in the future'], // Validation for max year
    },

    month: {
        type: String, // DataType
        required: [true, 'Month is required'], // Validation for month
        trim: true, // Trims spaces
        enum: {
            values: validMonths, // Restricts to valid months
            message: '{VALUE} is not a valid month' // Custom error message
        }
    },

    floor: {
        type: Number, // DataType
        required: [true, 'Floor is required'], // Validation for floor
        min: [1, 'Floor must be a positive integer'], // Ensure floor is positive
        max: [100, 'Floor value exceeds limit'], // Maximum allowed floor number
        default: 1, // Default floor value if not provided
    },

    category: {
        type: String, // DataType
        required: [true, 'Category is required'], // Validation for category
        trim: true, // Trim spaces
        enum: {
            values: ['HVAC', 'Lighting', 'Renewable', 'Other'], // Valid categories
            message: '{VALUE} is not a valid category' // Custom error message
        }
    },

    reading: {
        type: Number, // DataType
        required: [true, 'Reading is required'], // Validation for reading field
        min: [0, 'Reading must be a positive number'], // Reading must be positive
    },

    isExceeded: {
        type: Boolean,
        default: false,  // Will be set to `true` if the reading exceeds the limit
    }
    
});

export default mongoose.model('EnergyModel', energySchema);
