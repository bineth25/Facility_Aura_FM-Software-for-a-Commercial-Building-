import React from 'react'
import SpaceChart from "./SpaceChart";
import './Space_Utilization_Dashboard.css'

const Space_Utilization_Dashboard = () => {
return (
    <div className="dashboard-container">
        <h1 className="dashboard-title">Space Utilization Dashboard</h1>
        <SpaceChart />
    </div>
);
} 

export default Space_Utilization_Dashboard