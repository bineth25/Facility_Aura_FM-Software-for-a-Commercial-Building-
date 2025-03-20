import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [taskData, setTaskData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

  // Fetch task data from the backend
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/tasks/getall');
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          const text = await response.text();
          console.error('Expected JSON, but got:', text);
          throw new Error('Invalid response format: Expected JSON');
        }

        const tasks = await response.json();
        console.log('Fetched tasks:', tasks);

        // Process tasks for task type distribution
        const taskTypeCounts = tasks.reduce((acc, task) => {
          acc[task.Task_Type] = (acc[task.Task_Type] || 0) + 1;
          return acc;
        }, {});

        const taskChartData = {
          labels: Object.keys(taskTypeCounts),
          datasets: [
            {
              label: 'Task Types',
              data: Object.values(taskTypeCounts),
              backgroundColor: Object.keys(taskTypeCounts).map(getColorForTaskType),
              borderColor: Object.keys(taskTypeCounts).map((taskType) =>
                taskType === 'Issue'
                  ? 'rgba(255, 99, 132, 1)'
                  : taskType === 'Maintenance'
                  ? 'rgba(255, 206, 86, 1)'
                  : 'rgba(54, 162, 235, 1)'
              ),
              borderWidth: 1,
              hoverOffset: 10,
            },
          ],
        };

        // Process tasks for priority distribution
        const priorityCounts = tasks.reduce((acc, task) => {
          acc[task.priority] = (acc[task.priority] || 0) + 1;
          return acc;
        }, {});

        const priorityChartData = {
          labels: Object.keys(priorityCounts),
          datasets: [
            {
              label: 'Priority Levels',
              data: Object.values(priorityCounts),
              backgroundColor: Object.keys(priorityCounts).map(getColorForPriority),
              borderColor: Object.keys(priorityCounts).map((priority) =>
                priority === 'Urgent'
                  ? 'rgba(255, 99, 132, 1)'
                  : priority === 'High'
                  ? 'rgba(255, 159, 64, 1)'
                  : priority === 'Medium'
                  ? 'rgba(255, 206, 86, 1)'
                  : 'rgba(75, 192, 192, 1)'
              ),
              borderWidth: 1,
              hoverOffset: 10,
            },
          ],
        };

        // Process tasks for category distribution
        const categoryCounts = tasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {});

        setTaskData(taskChartData);
        setPriorityData(priorityChartData);
        setCategoryData(categoryCounts);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  // Define custom colors for task types
  const getColorForTaskType = (taskType) => {
    switch (taskType) {
      case 'Issue':
        return 'rgba(255, 99, 132, 0.6)';
      case 'Maintenance':
        return 'rgba(255, 206, 86, 0.6)';
      default:
        return 'rgba(54, 162, 235, 0.6)';
    }
  };

  // Define custom colors for priority levels
  const getColorForPriority = (priority) => {
    switch (priority) {
      case 'Urgent':
        return 'rgba(255, 99, 132, 0.6)';
      case 'High':
        return 'rgba(255, 159, 64, 0.6)';
      case 'Medium':
        return 'rgba(255, 206, 86, 0.6)';
      case 'Low':
        return 'rgba(75, 192, 192, 0.6)';
      default:
        return 'rgba(54, 162, 235, 0.6)';
    }
  };

  // Handle click on task type pie chart segments
  const handleTaskTypeClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const taskType = taskData.labels[index];
      setSelectedTaskType(taskType);
    }
  };

  // Handle click on priority pie chart segments
  const handlePriorityClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const priority = priorityData.labels[index];
      setSelectedPriority(priority);
    }
  };

  // Generate PDF report
  const generatePDF = () => {
    const input = document.getElementById('dashboard-container');
    const charts = document.querySelectorAll('.chart-card canvas');

    // Ensure charts are fully rendered before capturing
    Promise.all(Array.from(charts).map((chart) => html2canvas(chart)))
      .then((chartsCanvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        let yPosition = margin;

        // Add each chart to the PDF
        chartsCanvas.forEach((canvas, index) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 180; // Adjust width to fit within A4
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (yPosition + imgHeight > 280) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + margin;
        });

        // Add Task Categories to the PDF
        const categoryCard = document.querySelector('.category-card');
        if (categoryCard) {
          html2canvas(categoryCard).then((categoryCanvas) => {
            const imgData = categoryCanvas.toDataURL('image/png');
            const imgWidth = 180;
            const imgHeight = (categoryCanvas.height * imgWidth) / categoryCanvas.width;

            if (yPosition + imgHeight > 280) {
              pdf.addPage();
              yPosition = margin;
            }

            pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
            pdf.save('dashboard_report.pdf');
          });
        } else {
          pdf.save('dashboard_report.pdf');
        }
      });
  };

  return (
    <div className="dashboard-container" id="dashboard-container">
      <Notification />
      <div className="charts-container">
        <div className="chart-card task-type-card">
          <h2>Task Type Distribution</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : taskData ? (
            <>
              <Pie
                data={taskData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 14,
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${label}: ${value} tasks (${percentage}%)`;
                        },
                      },
                    },
                  },
                  onClick: handleTaskTypeClick,
                }}
              />
              {selectedTaskType && (
                <div className="selected-info">
                  <h3>Selected Task Type: {selectedTaskType}</h3>
                  <p>Click on a segment to view details.</p>
                </div>
              )}
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="chart-card priority-card">
          <h2>Priority Distribution</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="error-message">Error: {error}</p>
          ) : priorityData ? (
            <>
              <Pie
                data={priorityData}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      position: 'bottom',
                      labels: {
                        font: {
                          size: 14,
                        },
                      },
                    },
                    tooltip: {
                      enabled: true,
                      callbacks: {
                        label: (context) => {
                          const label = context.label || '';
                          const value = context.raw || 0;
                          const total = context.dataset.data.reduce((a, b) => a + b, 0);
                          const percentage = ((value / total) * 100).toFixed(2);
                          return `${label}: ${value} tasks (${percentage}%)`;
                        },
                      },
                    },
                  },
                  onClick: handlePriorityClick,
                }}
              />
              {selectedPriority && (
                <div className="selected-info">
                  <h3>Selected Priority: {selectedPriority}</h3>
                  <p>Click on a segment to view details.</p>
                </div>
              )}
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      {/* New Category Card */}
      <div className="category-card">
        <h2>Task Categories</h2>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="error-message">Error: {error}</p>
        ) : categoryData ? (
          <div className="category-list">
            {Object.entries(categoryData).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <span className="category-count">{count} tasks</span>
              </div>
            ))}
          </div>
        ) : (
          <p>No data available</p>
        )}
      </div>

      {/* Report Generation Button */}
      <div className="report-button-container">
        <button className="report-button" onClick={generatePDF}>
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;