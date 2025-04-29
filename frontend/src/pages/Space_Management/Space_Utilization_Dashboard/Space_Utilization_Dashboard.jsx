import React from 'react';
import { useNavigate } from 'react-router-dom';
import SpaceChart from './SpaceChart';
import './Space_Utilization_Dashboard.css';

const Space_Utilization_Dashboard = () => {
  const navigate = useNavigate();

  // Function to handle button click
  const handleViewMoreDetails = () => {
    navigate('/More_Space_Details');
  };

  return (
    <div className="dashboard-containers">
      <h1 className="dashboard-titles">Space Utilization Dashboard</h1>
      <SpaceChart />

      <button className="view-more-button" onClick={handleViewMoreDetails}>
        View More Details
      </button>
    </div>
  );
};

export default Space_Utilization_Dashboard;