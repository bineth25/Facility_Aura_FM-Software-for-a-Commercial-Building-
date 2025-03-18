import React, { useEffect, useState } from "react";
import axios from "axios";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import "./Space_Utilization_Dashboard.css"; // Import CSS

// Register Chart.js components
Chart.register(ArcElement, Tooltip, Legend);

const SpaceChart = () => {
    const [floorData, setFloorData] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:4000/api/spaces/analysis")
            .then(response => {
                setFloorData(response.data); // Store the floor-wise data
            })
            .catch(error => console.error("Error fetching space analysis:", error));
    }, []);

    return (
        <div className="dashboard-container">
            <div className="pie-chart-container">
                {floorData.map((floor, index) => (
                    <div key={index} className="pie-chart-box">
                        <h3>Floor {floor.floorId}</h3>
                        <Pie
                            data={{
                                labels: ["Available Spaces", "Occupied Spaces"],
                                datasets: [
                                    {
                                        data: [floor.availableSpaces, floor.occupiedSpaces],
                                        backgroundColor: ["#42a5f5", "#ef5350"], // Blue & Red
                                    }
                                ]
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SpaceChart;
