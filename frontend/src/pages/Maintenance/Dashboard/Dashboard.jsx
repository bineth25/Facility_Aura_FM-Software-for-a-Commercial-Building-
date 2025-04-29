import React, { useState, useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import axios from 'axios';
import { usePDF } from 'react-to-pdf';
import './Dashboard.css';
import Notification from '../notification/notification'; // Import the Notification component
import '../notification/notification.css';

function Dashboard() {
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [technicianName, setTechnicianName] = useState('');
  const dashboardRef = useRef();
  const { toPDF, targetRef } = usePDF({filename: 'technician-dashboard-report.pdf'});

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the logged-in user from localStorage
        const userJSON = localStorage.getItem('fm_user');
        if (!userJSON) {
          throw new Error('User not found in localStorage');
        }
        
        const user = JSON.parse(userJSON);
        const technicianId = user.technicianId; // This should be in format PL001 (uppercase)
        
        // Set technician name from user data
        setTechnicianName(user.firstName ? `${user.firstName} ${user.lastName}` : 'Technician');
        
        console.log('Fetching tasks for technician ID:', technicianId);
        
        // Hard-coded API base URL - change this to match your backend server
        const API_BASE_URL = 'http://localhost:4000';
        
        try {
          // Fetch approved tasks with full URL
          const approvedResponse = await axios.get(`${API_BASE_URL}/api/approved-tasks/technician/${technicianId}`);
          console.log('Approved tasks response:', approvedResponse.data);
          setApprovedTasks(Array.isArray(approvedResponse.data) ? approvedResponse.data : []);
        } catch (approvedError) {
          console.error('Error fetching approved tasks:', approvedError);
          setApprovedTasks([]);
        }
        
        try {
          // Fetch rejected tasks with full URL
          const rejectedResponse = await axios.get(`${API_BASE_URL}/api/rejected-tasks/technician/${technicianId}`);
          console.log('Rejected tasks response:', rejectedResponse.data);
          setRejectedTasks(Array.isArray(rejectedResponse.data) ? rejectedResponse.data : []);
        } catch (rejectedError) {
          console.error('Error fetching rejected tasks:', rejectedError);
          setRejectedTasks([]);
        }
        
        try {
          // Fetch assigned tasks (current active tasks) with full URL
          const assignedResponse = await axios.get(`${API_BASE_URL}/api/tasks/getall`);
          
          // Filter tasks by technician ID
          const filteredTasks = Array.isArray(assignedResponse.data) 
            ? assignedResponse.data.filter(task => {
                // Case-insensitive comparison
                const taskTechId = task.Technician_ID?.toUpperCase();
                const currentTechId = technicianId?.toUpperCase();
                return taskTechId === currentTechId;
              })
            : [];
          
          setAssignedTasks(filteredTasks);
        } catch (assignedError) {
          console.error('Error fetching assigned tasks:', assignedError);
          setAssignedTasks([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching task data:', err);
        setError(err.message || 'Failed to fetch task data');
        setLoading(false);
        // Initialize with empty arrays on error
        setApprovedTasks([]);
        setRejectedTasks([]);
        setAssignedTasks([]);
      }
    };

    fetchData();
  }, []);

  // Prepare data for status pie chart
  const statusPieData = [
    { name: 'Approved Tasks', value: approvedTasks.length, color: '#4CAF50' },
    { name: 'Rejected Tasks', value: rejectedTasks.length, color: '#F44336' }
  ];

  // Filter out zero values to avoid empty sections in the pie chart
  const filteredStatusPieData = statusPieData.filter(item => item.value > 0);

  // Prepare data for priority pie chart
  const priorityCount = {
    low: 0,
    medium: 0,
    high: 0,
    urgent: 0
  };

  // Count tasks by priority
  assignedTasks.forEach(task => {
    const priority = task.priority?.toLowerCase() || 'medium';
    if (priority.includes('low')) priorityCount.low++;
    else if (priority.includes('medium')) priorityCount.medium++;
    else if (priority.includes('high')) priorityCount.high++;
    else if (priority.includes('urgent')) priorityCount.urgent++;
  });

  const priorityPieData = [
    { name: 'Low', value: priorityCount.low, color: '#8BC34A' },
    { name: 'Medium', value: priorityCount.medium, color: '#FF9800' },
    { name: 'High', value: priorityCount.high, color: '#F44336' },
    { name: 'Urgent', value: priorityCount.urgent, color: '#D32F2F' }
  ];

  // Filter out zero values for priority chart
  const filteredPriorityPieData = priorityPieData.filter(item => item.value > 0);

  // If both values are zero, show empty state instead of empty chart
  const hasStatusData = filteredStatusPieData.length > 0;
  const hasPriorityData = filteredPriorityPieData.length > 0;

  return (
    <>
      {/* Add the Notification component at the top */}
      <Notification />
      
      <div className="tech_dashboard_container" ref={targetRef}>
        <h1 className="tech_dashboard_title">Welcome, {technicianName}!</h1>
        
        {loading ? (
          <div className="tech_loading_indicator">Loading task data...</div>
        ) : error ? (
          <div className="tech_error_message">
            <p>Error: {error}</p>
            <p>Please try again later or contact support.</p>
          </div>
        ) : (
          <div className="tech_dashboard_content">
            <div className="tech_task_summary">
              <div className="tech_task_card tech_approved">
                <h2>Approved Tasks</h2>
                <p className="tech_task_count">{approvedTasks.length}</p>
              </div>
              <div className="tech_task_card tech_rejected">
                <h2>Rejected Tasks</h2>
                <p className="tech_task_count">{rejectedTasks.length}</p>
              </div>
              <div className="tech_task_card tech_assigned">
                <h2>Assigned Tasks</h2>
                <p className="tech_task_count">{assignedTasks.length}</p>
              </div>
            </div>
            
            <div className="tech_charts_container">
              <div className="tech_chart_card">
                <h2 className="tech_chart_title">Task Status Distribution</h2>
                {hasStatusData ? (
                  <div className="tech_chart_visual_container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={filteredStatusPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {filteredStatusPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="tech_no_data_message">
                    <p>No task status data available to display.</p>
                    <p>Complete some tasks to see your performance metrics!</p>
                  </div>
                )}
              </div>

              <div className="tech_chart_card">
                <h2 className="tech_chart_title">Task Priority Distribution</h2>
                {hasPriorityData ? (
                  <div className="tech_chart_visual_container">
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={filteredPriorityPieData}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {filteredPriorityPieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="tech_no_data_message">
                    <p>No task priority data available to display.</p>
                    <p>You currently have no assigned tasks.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="tech_report_button_container">
              <button 
                onClick={() => toPDF()} 
                className="tech_generate_report_button"
              >
                <span className="tech_button_icon">📊</span> Download PDF Report
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Dashboard;