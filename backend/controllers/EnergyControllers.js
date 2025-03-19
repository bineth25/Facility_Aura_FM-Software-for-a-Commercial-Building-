import Energy from '../models/EnergyModel.js';
import CategoryLimit from '../models/CategoryLimit.js';
import ExceededEnergyReading from '../models/ExceededEnergyReading.js';  // Import the ExceededEnergyReading model

// Add a new energy reading
export const addEnergyReading = async (req, res) => {
    try {
        const { year, month, floor, category, reading } = req.body;

        // Validate required fields
        if (!year || !month || !floor || !category || !reading) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate that the provided month is valid
        const validMonths = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        if (!validMonths.includes(month)) {
            return res.status(400).json({ message: 'Invalid month provided' });
        }

        // Fetch the max consumption limit for the given category
        const categoryLimit = await CategoryLimit.findOne({ category });
        if (!categoryLimit) {
            return res.status(404).json({ message: 'Category limit not found for the specified category' });
        }

        // Check if the reading exceeds the max consumption limit for this category
        const isExceeded = reading > categoryLimit.maxConsumptionLimit;

        // Create a new energy reading
        const energyReading = new Energy({
            year, 
            month, 
            floor, 
            category, 
            reading,
            isExceeded // Flag indicating if the reading exceeds the limit
        });

        await energyReading.save();

        if (isExceeded) {
            // Move or copy the exceeded reading to the ExceededEnergyReadings collection
            const exceededReading = new ExceededEnergyReading({
                year,
                month,
                floor,
                category,
                reading
            });

            await exceededReading.save();  // Save the exceeded reading to the separate collection
        }

        res.status(201).json({ message: 'Energy reading added successfully', energyReading });
    } catch (error) {
        res.status(500).json({ message: 'Error adding energy reading', error: error.message });
    }
};

// Get all energy readings or filter by query parameters (year, month, floor, category)
export const getEnergyReadings = async (req, res) => {
    try {
        const { year, month, floor, category, isExceeded } = req.query;

        // Build the query object dynamically based on provided filters
        let query = {};

        if (year) query.year = year;
        if (month) query.month = month;
        if (floor) query.floor = floor;
        if (category) query.category = category;
        if (isExceeded !== undefined) query.isExceeded = isExceeded; // Filter by exceeded readings if needed

        // Fetch energy readings based on the filters
        const energyReadings = await Energy.find(query);

        if (energyReadings.length === 0) {
            return res.status(404).json({ message: 'No energy readings found with the specified filters' });
        }

        res.json(energyReadings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching energy readings', error: error.message });
    }
};

// Get all exceeded energy readings (this is the separate table for exceeded readings)
export const getExceededReadings = async (req, res) => {
    try {
        const exceededReadings = await ExceededEnergyReading.find();
        res.json(exceededReadings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching exceeded readings', error: error.message });
    }
};

// Update an existing energy reading by ID
export const updateEnergyReading = async (req, res) => {
    try {
        const { id } = req.params;
        const { year, month, floor, category, reading } = req.body;

        // Validate required fields
        if (!year || !month || !floor || !category || !reading) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Validate that the provided month is valid
        const validMonths = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        if (!validMonths.includes(month)) {
            return res.status(400).json({ message: 'Invalid month provided' });
        }

        // Fetch the energy reading by ID
        const energyReading = await Energy.findById(id);
        if (!energyReading) {
            return res.status(404).json({ message: 'Energy reading not found' });
        }

        // Update the energy reading fields
        energyReading.year = year;
        energyReading.month = month;
        energyReading.floor = floor;
        energyReading.category = category;
        energyReading.reading = reading;
        energyReading.isExceeded = reading > (await CategoryLimit.findOne({ category })).maxConsumptionLimit;

        await energyReading.save();

        res.status(200).json({ message: 'Energy reading updated successfully', energyReading });
    } catch (error) {
        res.status(500).json({ message: 'Error updating energy reading', error: error.message });
    }
};

// Delete an energy reading by ID
export const deleteEnergyReadingById = async (req, res) => {
    try {
        const { id } = req.params;

        // Fetch the energy reading by ID
        const energyReading = await Energy.findById(id);
        if (!energyReading) {
            return res.status(404).json({ message: 'Energy reading not found' });
        }

        // Delete the energy reading
        await energyReading.remove();

        res.status(200).json({ message: 'Energy reading deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting energy reading', error: error.message });
    }
};
