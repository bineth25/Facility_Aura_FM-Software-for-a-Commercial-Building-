import CategoryLimit from '../models/CategoryLimit.js';


export const setCategoryLimit = async (req, res) => {
    try {
        const { category, maxConsumptionLimit } = req.body;

      
        if (!category || !maxConsumptionLimit) {
            return res.status(400).json({ message: 'Category and max consumption limit are required' });
        }

        
        const existingCategoryLimit = await CategoryLimit.findOne({ category });
        if (existingCategoryLimit) {
            
            existingCategoryLimit.maxConsumptionLimit = maxConsumptionLimit;
            await existingCategoryLimit.save();
            return res.status(200).json({
                message: 'Category limit updated successfully',
                categoryLimit: existingCategoryLimit
            });
        }

       
        const newCategoryLimit = new CategoryLimit({
            category,
            maxConsumptionLimit
        });

        await newCategoryLimit.save();
        res.status(201).json({
            message: 'Category limit set successfully',
            categoryLimit: newCategoryLimit
        });
    } catch (error) {
        res.status(500).json({ message: 'Error setting category limit', error: error.message });
    }
};

// Get all category limits
export const getCategoryLimits = async (req, res) => {
    try {
        const categoryLimits = await CategoryLimit.find();
        res.json(categoryLimits);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching category limits', error: error.message });
    }
};

// Update a specific category's max consumption limit 
export const updateCategoryLimit = async (req, res) => {
    try {
        const { category, maxConsumptionLimit } = req.body;

       
        if (!category || !maxConsumptionLimit) {
            return res.status(400).json({ message: 'Category and max consumption limit are required' });
        }

        
        const existingCategoryLimit = await CategoryLimit.findOne({ category });
        if (!existingCategoryLimit) {
            return res.status(404).json({ message: 'Category limit not found for the specified category' });
        }

        // Update the max consumption limit
        existingCategoryLimit.maxConsumptionLimit = maxConsumptionLimit;
        await existingCategoryLimit.save();

        res.status(200).json({
            message: 'Category limit updated successfully',
            categoryLimit: existingCategoryLimit
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating category limit', error: error.message });
    }
};

// Delete a specific category's limit 
export const deleteCategoryLimit = async (req, res) => {
    try {
        const { category } = req.body;

        if (!category) {
            return res.status(400).json({ message: 'Category is required to delete' });
        }

        // Find and delete the category limit
        const deletedCategoryLimit = await CategoryLimit.findOneAndDelete({ category });
        if (!deletedCategoryLimit) {
            return res.status(404).json({ message: 'Category limit not found for the specified category' });
        }

        res.status(200).json({
            message: 'Category limit deleted successfully',
            categoryLimit: deletedCategoryLimit
        });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting category limit', error: error.message });
    }
};
