import mongoose from 'mongoose';
import dotenv from 'dotenv';
import EnergyModel from '../models/EnergyModel.js';
import connectDB from '../config/db.js';

// Load environment variables
dotenv.config();

const months = [
    'January', 'February', 'March', 'April', 'May', 'June', 
    'July', 'August', 'September', 'October', 'November', 'December'
];

const categories = ['HVAC', 'Lighting', 'Renewable', 'Other'];

// Helper function to generate realistic energy readings
const generateReading = (category, month, floor) => {
    const monthIndex = months.indexOf(month);
    let baseReading;
    
    switch(category) {
        case 'HVAC':
            // Higher in summer (June-August) and winter (December-February)
            baseReading = 2000 + (floor * 150);
            if (monthIndex >= 5 && monthIndex <= 7) { // Summer
                baseReading *= 1.4; // 40% increase
            } else if (monthIndex === 11 || monthIndex <= 1) { // Winter
                baseReading *= 1.3; // 30% increase
            }
            break;
            
        case 'Lighting':
            // More consistent, slightly higher in winter months
            baseReading = 800 + (floor * 80);
            if (monthIndex >= 10 || monthIndex <= 1) { // Winter months
                baseReading *= 1.2; // 20% increase
            }
            break;
            
        case 'Renewable':
            // Lower consumption, more in summer (solar)
            baseReading = 300 + (floor * 30);
            if (monthIndex >= 4 && monthIndex <= 8) { // Spring/Summer
                baseReading *= 1.5; // 50% increase
            }
            break;
            
        case 'Other':
            // Variable consumption
            baseReading = 500 + (floor * 50);
            break;
            
        default:
            baseReading = 1000;
    }
    
    // Add some randomness (±10%)
    const variation = baseReading * 0.1;
    const randomVariation = (Math.random() * 2 - 1) * variation;
    
    return Math.round(baseReading + randomVariation);
};

// Generate energy data
const generateEnergyData = () => {
    const energyData = [];
    const currentYear = new Date().getFullYear();
    const years = [currentYear - 1, currentYear]; // Last 2 years
    const floors = [1, 2, 3, 4, 5]; // 5 floors
    
    years.forEach(year => {
        let monthsToProcess = months;
        
        // If current year, only include months up to current month
        if (year === currentYear) {
            const currentMonth = new Date().getMonth();
            monthsToProcess = months.slice(0, currentMonth + 1);
        }
        
        monthsToProcess.forEach(month => {
            floors.forEach(floor => {
                categories.forEach(category => {
                    const reading = generateReading(category, month, floor);
                    
                    energyData.push({
                        year,
                        month,
                        floor,
                        category,
                        reading,
                        isExceeded: reading > 3500 // Mark as exceeded if above threshold
                    });
                });
            });
        });
    });
    
    return energyData;
};

// Seed function
const seedEnergyData = async () => {
    try {
        // Connect to database
        await connectDB();
        
        console.log('🌱 Starting energy data seeding...');
        
        // Clear existing energy data
        await EnergyModel.deleteMany({});
        console.log('🗑️  Cleared existing energy data');
        
        // Generate and insert new data
        const energyData = generateEnergyData();
        await EnergyModel.insertMany(energyData);
        
        console.log(`✅ Successfully seeded ${energyData.length} energy records`);
        
        // Display summary statistics
        const hvacCount = energyData.filter(e => e.category === 'HVAC').length;
        const lightingCount = energyData.filter(e => e.category === 'Lighting').length;
        const renewableCount = energyData.filter(e => e.category === 'Renewable').length;
        const otherCount = energyData.filter(e => e.category === 'Other').length;
        const exceededCount = energyData.filter(e => e.isExceeded).length;
        
        console.log('\n📊 Summary:');
        console.log(`   HVAC records: ${hvacCount}`);
        console.log(`   Lighting records: ${lightingCount}`);
        console.log(`   Renewable records: ${renewableCount}`);
        console.log(`   Other records: ${otherCount}`);
        console.log(`   Exceeded threshold: ${exceededCount}`);
        
        // Calculate average readings by category
        const avgHVAC = Math.round(energyData.filter(e => e.category === 'HVAC').reduce((sum, e) => sum + e.reading, 0) / hvacCount);
        const avgLighting = Math.round(energyData.filter(e => e.category === 'Lighting').reduce((sum, e) => sum + e.reading, 0) / lightingCount);
        const avgRenewable = Math.round(energyData.filter(e => e.category === 'Renewable').reduce((sum, e) => sum + e.reading, 0) / renewableCount);
        const avgOther = Math.round(energyData.filter(e => e.category === 'Other').reduce((sum, e) => sum + e.reading, 0) / otherCount);
        
        console.log('\n📈 Average Readings (kWh):');
        console.log(`   HVAC: ${avgHVAC} kWh`);
        console.log(`   Lighting: ${avgLighting} kWh`);
        console.log(`   Renewable: ${avgRenewable} kWh`);
        console.log(`   Other: ${avgOther} kWh`);
        
        process.exit(0);
        
    } catch (error) {
        console.error('❌ Error seeding energy data:', error);
        process.exit(1);
    }
};

// Run the seeder
seedEnergyData();
