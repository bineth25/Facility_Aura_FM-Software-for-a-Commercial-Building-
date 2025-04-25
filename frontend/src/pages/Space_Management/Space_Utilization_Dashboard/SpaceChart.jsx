import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend, Title } from "chart.js";
import "./Space_Utilization_Dashboard.css";

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend, Title);

const SpaceChart = () => {
    const [floorData, setFloorData] = useState([]);
    const [activeIndex, setActiveIndex] = useState(null);

    useEffect(() => {
        axios.get("http://localhost:4000/api/spaces/analysis")
            .then(response => {
                setFloorData(response.data);
            })
            .catch(error => console.error("Error fetching space analysis:", error));
    }, []);

    // Chart configuration options
    const getChartOptions = (floorId) => {
        return {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 16,
                        font: {
                            size: 13
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: {
                        size: 20,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: (context) => {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${value} (${percentage}%)`;
                        }
                    }
                },
                title: {
                    display: true,
                    text: `Floor ${floorId} Space Utilization`,
                    font: {
                        size: 18,
                        weight: 'bold'
                    },
                    padding: {
                        bottom: 18
                    },
                    color: '#00796b'
                }
            },
            animation: {
                animateScale: true,
                animateRotate: true,
                duration: 1000
            },
            cutout: '50%',
            borderWidth: 2,
            hoverOffset: 15
        };
    };

    // Chart data configuration
    const getChartData = (floor) => {
        return {
            labels: ["Available", "Occupied"],
            datasets: [
                {
                    data: [floor.availableSpaces, floor.occupiedSpaces],
                    backgroundColor: [
                        "rgba(66, 165, 245, 0.8)",
                        "rgba(239, 83, 80, 0.8)"
                    ],
                    borderColor: [
                        "rgba(30, 136, 229, 1)",
                        "rgba(211, 47, 47, 1)"
                    ],
                    hoverBackgroundColor: [
                        "rgba(66, 165, 245, 1)",
                        "rgb(241, 67, 64)"
                    ]
                }
            ]
        };
    };

    const handleChartHover = (index) => {
        setActiveIndex(index);
    };

    return (
        <div>
            <div className="pie-charts-container">
                {floorData.map((floor, index) => {
                    const isActive = activeIndex === index;
                    const utilizationPercentage = Math.round((floor.occupiedSpaces / (floor.availableSpaces + floor.occupiedSpaces)) * 100);

                    return (
                        <div
                            key={index}
                            className={`pie-chart-box ${isActive ? 'active-chart' : ''}`}
                            onMouseEnter={() => handleChartHover(index)}
                            onMouseLeave={() => handleChartHover(null)}
                        >
                            <div className="chart-wrapper">
                                <Pie
                                    data={getChartData(floor)}
                                    options={getChartOptions(floor.floorId)}
                                />
                                <div className="utilization-percentage">
                                    <span>{utilizationPercentage}%</span>
                                    <p>Utilization</p>
                                </div>
                            </div>
                            <div className="chart-metrics">
                                <div className="metric">
                                    <span className="metric-value">{floor.availableSpaces}</span>
                                    <span className="metric-label">Available</span>
                                </div>
                                <div className="metric">
                                    <span className="metric-value">{floor.occupiedSpaces}</span>
                                    <span className="metric-label">Occupied</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default SpaceChart;