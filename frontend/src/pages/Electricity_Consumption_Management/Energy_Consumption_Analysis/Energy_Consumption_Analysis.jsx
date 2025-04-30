import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import QRCode from 'react-qr-code';
import axios from 'axios';
import styles from './Energy_Consumption_Analysis.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Energy_Consumption_Analysis = () => {
    const [year, setYear] = useState('');
    const [month, setMonth] = useState('');
    const [category, setCategory] = useState('');
    const [energyData, setEnergyData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [qrData, setQrData] = useState('');

    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    useEffect(() => {
        // Reset the energy data when filters change
        setEnergyData([]);
        
        // Fetch the new data if all filters are set
        if (year && month && category) fetchEnergyData();
    }, [year, month, category]);

    const fetchEnergyData = async () => {
        if (!year || !month || !category) return;
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/energyReadings', {
                params: { year, month, category }
            });
            console.log('API Response:', response.data);
            setEnergyData(response.data);
        } catch (error) {
            console.error('Error fetching energy data:', error);
        } finally {
            setLoading(false);
        }
    };

    // Process data to include all floors with proper ordering
    const floors = Array.from({ length: 7 }, (_, i) => i + 1); 
    const processedData = floors.map(floor => {
        const floorData = energyData.find(d => d.floor === floor);
        return {
            reading: floorData?.reading || 0,
            isExceeded: floorData?.isExceeded || false
        };
    });

    const chartData = {
        labels: floors.map(f => `Floor ${f}`),
        datasets: [{
            label: 'Energy Consumption',
            data: processedData.map(d => d.reading),
            backgroundColor: processedData.map(d => 
                d.isExceeded ? 'rgba(239, 83, 80, 0.85)' : 'rgba(38, 166, 154, 0.85)'
            ),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1,
            borderRadius: 6,
            hoverBackgroundColor: processedData.map(d => 
                d.isExceeded ? 'rgba(239, 83, 80, 1)' : 'rgba(38, 166, 154, 1)'
            ),
        }]
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: `Energy Consumption Analysis - ${category} (${month} ${year})`,
                font: { size: 18, weight: 'bold' },
                padding: { top: 10, bottom: 20 }
            },
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(0,0,0,0.8)',
                bodyFont: { size: 14 },
                padding: 12,
                cornerRadius: 6,
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
                    font: { weight: 'bold', size: 14 },
                    padding: { top: 10 }
                }
            },
            y: {
                grid: { color: '#e0e0e0' },
                title: {
                    display: true,
                    text: 'Energy Consumption (kWh)',
                    font: { weight: 'bold', size: 14 },
                    padding: { bottom: 10 }
                },
                beginAtZero: true
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    const fetchAvgConsumptionData = async () => {
        if (!year || !category) return;
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:4000/api/energyReadings/avg', {
                params: { year, category }
            });
    
            // Sort the response data by floor number ascending
            const sortedData = response.data.sort((a, b) => a.floor - b.floor);
    
            // Compressed data for the URL parameter
            const reportData = {
                c: category, // category
                y: year,     // year
                f: sortedData.map(f => ({
                    n: f.floor,                    // floor number
                    r: parseFloat(f.averageReading.toFixed(2)), // reading
                    e: f.exceeded ? 1 : 0           // exceeded flag
                }))
            };
            
            const viewerUrl = `https://jayasankahirimuthugodage.github.io/energy-report-viewer/?data=${encodeURIComponent(JSON.stringify(reportData))}`;
    
            // Create a simple text summary version
            const textVersion = sortedData.map(floor => 
                `Floor ${floor.floor}: ${floor.averageReading.toFixed(2)} kWh${floor.exceeded ? ' (Exceeded)' : ''}`
            ).join('\n');
    
            // Combine both into the QR code data
            const qrContent = `🔵 View as Web: ${viewerUrl}\n🟢 View as Text:\n${textVersion}`;
    
            // Set the combined data into QR
            setQrData(qrContent);
    
        } catch (error) {
            console.error('Error fetching avg consumption data:', error);
        } finally {
            setLoading(false);
        }
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
    };

    const generatePDF = async () => {
        if (!year || !category) return;
    
        try {
            const response = await axios.get('http://localhost:4000/api/energyReadings/avg', {
                params: { year, category }
            });
    
            const doc = new jsPDF();
    
            doc.setFontSize(16);
            doc.text(`Energy Consumption Report`, 14, 20);
            doc.setFontSize(12);
            doc.text(`Year: ${year}`, 14, 30);
            doc.text(`Category: ${category}`, 14, 38);
    
            // Sort the response data by floor number before creating table rows
            const sortedData = response.data.sort((a, b) => a.floor - b.floor);
    
            const tableRows = sortedData.map((floorData, index) => [
                index + 1,
                `Floor ${floorData.floor}`,
                `${floorData.averageReading.toFixed(2)} kWh`,
                floorData.exceeded ? 'Yes' : 'No'
            ]);
    
            autoTable(doc, {
                head: [['#', 'Floor', 'Avg. Consumption', 'Exceeded Limit']],
                body: tableRows,
                startY: 45,
            });
    
            doc.save(`Energy_Report_${category}_${year}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        }
    };
    

    return (
        <div className={styles.eca_container}>
            <header className={styles.eca_header}>
                <h1 className={styles.eca_title}>Energy Consumption Analysis</h1>
            </header>

            <div className={styles.eca_content}>
                <div className={styles.eca_sidebar}>
                    <div className={styles.eca_card}>
                        <h2 className={styles.eca_card_title}>Analysis Filters</h2>
                        <div className={styles.eca_filter_group}>
                            <div className={styles.eca_filter_item}>
                                <label className={styles.eca_filter_label} htmlFor="year-select">Year</label>
                                <select 
                                    id="year-select"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                    className={styles.eca_select}
                                >
                                    <option value="">Select Year</option>
                                    {Array.from({ length: 27 }, (_, i) => 2024 + i).map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.eca_filter_item}>
                                <label className={styles.eca_filter_label} htmlFor="month-select">Month</label>
                                <select 
                                    id="month-select"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                    className={styles.eca_select}
                                >
                                    <option value="">Select Month</option>
                                    {monthNames.map(month => (
                                        <option key={month} value={month}>{month}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.eca_filter_item}>
                                <label className={styles.eca_filter_label} htmlFor="category-select">Category</label>
                                <select 
                                    id="category-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className={styles.eca_select}
                                >
                                    <option value="">Select Category</option>
                                    {['HVAC', 'Lighting', 'Renewable'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.eca_card}>
                        <h2 className={styles.eca_card_title}>Instructions</h2>
                        <div className={styles.eca_instruction_content}>
                            <p className={styles.eca_instruction_item}>
                                <span className={styles.eca_instruction_icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </span>
                                Select year, month and category to view floor-wise consumption
                            </p>
                            <p className={styles.eca_instruction_item}>
                                <span className={styles.eca_instruction_icon}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </span>
                                For average consumption, select only year and category
                            </p>
                        </div>
                    </div>

                    <div className={styles.eca_card}>
                        <h2 className={styles.eca_card_title}>Export Options</h2>
                        <div className={styles.eca_action_buttons}>
                            <button
                                onClick={generatePDF}
                                className={`${styles.eca_button} ${styles.eca_pdf_button}`}
                                disabled={!year || !category}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eca_button_icon}>
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <polyline points="14 2 14 8 20 8"></polyline>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    <line x1="16" y1="17" x2="8" y2="17"></line>
                                    <polyline points="10 9 9 9 8 9"></polyline>
                                </svg>
                                Generate PDF Report
                            </button>
                            
                            <button 
                                onClick={(e) => {
                                    e.preventDefault();
                                    fetchAvgConsumptionData();
                                    setIsModalOpen(true);
                                }}
                                className={`${styles.eca_button} ${styles.eca_qr_button}`}
                                disabled={!year || !category}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.eca_button_icon}>
                                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    <rect x="7" y="7" width="3" height="3"></rect>
                                    <rect x="14" y="7" width="3" height="3"></rect>
                                    <rect x="7" y="14" width="3" height="3"></rect>
                                    <rect x="14" y="14" width="3" height="3"></rect>
                                </svg>
                                Scan QR for Report
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.eca_main}>
                    {loading ? (
                        <div className={`${styles.eca_card} ${styles.eca_loading}`}>
                            <div className={styles.eca_spinner}></div>
                            <p className={styles.eca_loading_text}>Loading energy data...</p>
                        </div>
                    ) : energyData.length > 0 ? (
                        <div className={`${styles.eca_card} ${styles.eca_chart_container}`}>
                            <Bar 
                                key={`${year}-${month}-${category}`}
                                data={chartData} 
                                options={chartOptions} 
                            />
                            <div className={styles.eca_legend}>
                              <div className={styles.eca_legend_item}>
                                <span className={`${styles.eca_legend_color} ${styles.eca_normal}`}></span>
                                <span className={styles.eca_legend_text}>Normal Consumption (Below Limit)</span>
                              </div>
                              <div className={styles.eca_legend_item}>
                                <span className={`${styles.eca_legend_color} ${styles.eca_exceeded}`}></span>
                                <span className={styles.eca_legend_text}>Exceeded Consumption Limit</span>
                              </div>
                            </div>
                        </div>
                    ) : (
                        <div className={`${styles.eca_card} ${styles.eca_placeholder}`}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                                <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                                <path d="M3 5c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                                <path d="M12 8v13"></path>
                                <path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"></path>
                            </svg>
                            <h3 className={styles.eca_placeholder_title}>Energy Analysis Chart</h3>
                            <p className={styles.eca_placeholder_text}>Please select Year, Month, and Category to view the analysis chart</p>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modal with QR Code */}
            {isModalOpen && (
                <div className={styles.eca_modal_overlay}>
                    <div className={styles.eca_modal_container}>
                        <div className={styles.eca_modal_header}>
                            <h3 className={styles.eca_modal_title}>Energy Report QR Code</h3>
                            <button className={styles.eca_modal_close} onClick={closeModal} aria-label="Close modal">
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="18" y1="6" x2="6" y2="18"></line>
                                    <line x1="6" y1="6" x2="18" y2="18"></line>
                                </svg>
                            </button>
                        </div>
                        <div className={styles.eca_modal_body}>
                            {qrData ? (
                                <div className={styles.eca_qr_container}>
                                    <div className={styles.eca_qr_wrapper}>
                                        <QRCode value={qrData} size={200} />
                                    </div>
                                    <p className={styles.eca_qr_caption}>Scan to view the detailed report</p>
                                </div>
                            ) : (
                                <div className={styles.eca_modal_loading}>
                                    <div className={styles.eca_spinner}></div>
                                    <p>Generating QR code...</p>
                                </div>
                            )}
                        </div>
                        <div className={styles.eca_modal_footer}>
                            <button className={`${styles.eca_button} ${styles.eca_modal_button}`} onClick={closeModal}>
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Energy_Consumption_Analysis;