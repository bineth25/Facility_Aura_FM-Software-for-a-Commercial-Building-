import mongoose from 'mongoose';

const { Schema } = mongoose;

const exceededEnergyReadingSchema = new Schema({
    
    year: {
        type: Number,
        required: true
    },
    month: {
        type: String,
        required: true
    },
    floor: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    reading: {
        type: Number,
        required: true
    },
    exceededAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('ExceededEnergyReading', exceededEnergyReadingSchema);
