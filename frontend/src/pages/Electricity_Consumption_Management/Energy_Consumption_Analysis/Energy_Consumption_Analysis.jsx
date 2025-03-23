import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Energy_Consumption_Analysis = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [category, setCategory] = useState('');
    const [energyData, setEnergyData] = useState([]);
    const [loading, setLoading] = useState(false);

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        // Reset the energy data when filters change
        setEnergyData([]); 
        
        // Fetch the new data if all filters are set
        if (year && month && category) fetchEnergyData();
    }, [year, month, category]); // This ensures the chart updates when filters change
        

    const fetchEnergyData = async () => {
        if (!year || !month || !category) return;
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/energyReadings', {
                params: { year, month, category }
            });
            console.log('API Response:', response.data); // Log the API response for debugging
            setEnergyData(response.data);
        } catch (error) {
            console.error('Error fetching energy data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process data to include all floors with proper ordering
    const floors = Array.from({ length: 7 }, (_, i) => i + 1); // Assuming 7 floors
    const processedData = floors.map(floor => {
        const floorData = energyData.find(d => d.floor === floor); // Find the data for the current floor
        return {
            reading: floorData?.reading || 0, // If no data, use 0
            isExceeded: floorData?.isExceeded || false // Default to false if no data
        };
    });

    const chartData = {
        labels: floors.map(f => `Floor ${f}`),
        datasets: [{
            label: 'Energy Consumption',
            data: processedData.map(d => d.reading),
            backgroundColor: processedData.map(d => 
                d.isExceeded ? 'rgba(255, 99, 132, 0.8)' : 'rgba(54, 162, 235, 0.8)'
            ),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderRadius: 4,
            hoverBackgroundColor: processedData.map(d => 
                d.isExceeded ? 'rgba(255, 99, 132, 1)' : 'rgba(54, 162, 235, 1)'
            ),
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Energy Consumption Analysis - ${category} (${month} ${year})`,
                font: { size: 18 }
            },
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                bodyFont: { size: 14 },
                callbacks: {
                    label: (context) => {
                        const floor = context.label.replace('Floor ', '');
                        const reading = context.raw;
                        const isExceeded = processedData[context.dataIndex].isExceeded;
                        return `${reading} kWh ${isExceeded ? ' (Exceeded Limit)' : ''}`;
                    },
                    title: ([item]) => `Floor ${item.label.replace('Floor ', '')}`
                }
            }
        },
        scales: {
            x: {
                grid: { display: false },
                title: {
                    display: true,
                    text: 'Floor Number',
                    font: { weight: 'bold' }
                }
            },
            y: {
                grid: { color: '#e0e0e0' },
                title: {
                    display: true,
                    text: 'Energy Consumption (kWh)',
                    font: { weight: 'bold' }
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    /*useEffect(() => {
        if (year && month && category) fetchEnergyData();
    }, [year, month, category]); // This ensures the chart updates when filters change*/

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
                Energy Consumption Analysis
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <select 
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    className="p-2 border rounded-lg bg-white"
                >
                    <option value="">Select Year</option>
                    {Array.from({ length: 27 }, (_, i) => 2024 + i).map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>

                <select 
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    className="p-2 border rounded-lg bg-white"
                >
                    <option value="">Select Month</option>
                    {monthNames.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>

                <select 
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 border rounded-lg bg-white"
                >
                    <option value="">Select Category</option>
                    {['HVAC', 'Lighting', 'Renewable'].map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading energy data...</p>
                </div>
            ) : energyData.length > 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <Bar 
                        key={`${year}-${month}-${category}`} // Force re-render when filters change
                        data={chartData} 
                        options={chartOptions} 
                    />
                </div>
            ) : (
                year && month && category && (
                    <div className="text-center py-8 text-gray-500">
                        No data available for selected filters
                    </div>
                )
            )}
        </div>
    );
};

export default Energy_Consumption_Analysis;
