import Energy from '../models/EnergyModel.js';
import CategoryLimit from '../models/CategoryLimit.js';
import ExceededEnergyReading from '../models/ExceededEnergyReading.js';  


export const addEnergyReading = async (req, res) => {
    try {
        const { year, month, floor, category, reading } = req.body;

        
        if (!year || !month || !floor || !category || !reading) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if this exact entry already exists
        const existingEntry = await Energy.findOne({
            year, 
            month, 
            floor, 
            category, 
            /*reading*/
        });

        if (existingEntry) {
            return res.status(400).json({ message: 'Duplicate entry found. This data already exists.' });
        }

        // Fetch the max consumption limit for the given category
        const categoryLimit = await CategoryLimit.findOne({ category });
        if (!categoryLimit) {
            return res.status(404).json({ message: 'Category limit not found for the specified category' });
        }

        
        const isExceeded = reading > categoryLimit.maxConsumptionLimit;

       
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


// Get all energy readings with the functionality of filtering by query parameters (year, month, floor, category)
export const getEnergyReadings = async (req, res) => {
    try {
        const { year, month, floor, category, isExceeded } = req.query;

        // Build the query object dynamically based on provided filters
        let query = {};

        if (year) query.year = year;
        if (month) query.month = month;
        if (floor) query.floor = floor;
        if (category) query.category = category;
        if (isExceeded !== undefined) query.isExceeded = isExceeded; 

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

// Get all exceeded energy readings 
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

      
        if (!year || !month || !floor || !category || !reading) {
            return res.status(400).json({ message: 'All fields are required' });
        }

       
        const validMonths = [
            'January', 'February', 'March', 'April', 'May', 'June', 
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        if (!validMonths.includes(month)) {
            return res.status(400).json({ message: 'Invalid month provided' });
        }

        
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
        await Energy.deleteOne({ _id: id });  // Using deleteOne() instead of remove()


        res.status(200).json({ message: 'Energy reading deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting energy reading', error: error.message });
    }
};


// Get average monthly energy consumption by floor and category
export const getAvgMonthlyConsumption = async (req, res) => {
    try {
        const { year, category } = req.query;

        if (!year || !category) {
            return res.status(400).json({ message: 'Year and category are required' });
        }

        // Fetch the limit for this category
        const categoryLimitDoc = await CategoryLimit.findOne({ category });
        if (!categoryLimitDoc) {
            return res.status(404).json({ message: 'No limit set for this category' });
        }
        const maxLimit = categoryLimitDoc.maxConsumptionLimit;

        // Calculate average reading per floor
        const energyReadings = await Energy.aggregate([
            { $match: { year: parseInt(year), category } },
            { $group: { 
                _id: "$floor",
                averageReading: { $avg: "$reading" }
            }},
            { $project: {
                floor: "$_id",
                averageReading: 1,
                _id: 0
            }}
        ]);

        if (energyReadings.length === 0) {
            return res.status(404).json({ message: 'No data found for the specified filters' });
        }

        //exceeded flag based on maxLimit
        const result = energyReadings.map(item => ({
            ...item,
            exceeded: item.averageReading > maxLimit
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching average consumption data', error: error.message });
    }
};
