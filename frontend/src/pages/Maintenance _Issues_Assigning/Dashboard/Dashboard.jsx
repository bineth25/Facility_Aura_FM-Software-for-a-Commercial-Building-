import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import './Dashboard.css';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [taskData, setTaskData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [categoryData, setCategoryData] = useState(null);
  const [completionData, setCompletionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTaskType, setSelectedTaskType] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState(null);

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

  const handleTaskTypeClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const taskType = taskData.labels[index];
      setSelectedTaskType(taskType);
    }
  };

  const handlePriorityClick = (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const priority = priorityData.labels[index];
      setSelectedPriority(priority);
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('dashboard__container');
    const charts = document.querySelectorAll('.dashboard__chart-card canvas');

    Promise.all(Array.from(charts).map((chart) => html2canvas(chart)))
      .then((chartsCanvas) => {
        const pdf = new jsPDF('p', 'mm', 'a4');
        const margin = 10;
        let yPosition = margin;

        chartsCanvas.forEach((canvas, index) => {
          const imgData = canvas.toDataURL('image/png');
          const imgWidth = 180;
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          if (yPosition + imgHeight > 280) {
            pdf.addPage();
            yPosition = margin;
          }

          pdf.addImage(imgData, 'PNG', margin, yPosition, imgWidth, imgHeight);
          yPosition += imgHeight + margin;
        });

        const categoryCard = document.querySelector('.dashboard__category-card');
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

  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        
        const tasksResponse = await fetch('http://localhost:4000/api/tasks/getall');
        if (!tasksResponse.ok) {
          throw new Error(`HTTP error! Status: ${tasksResponse.status}`);
        }
        const allTasks = await tasksResponse.json();

        
        const completedResponse = await fetch('http://localhost:4000/api/submitted-tasks');
        if (!completedResponse.ok) {
          throw new Error(`HTTP error! Status: ${completedResponse.status}`);
        }
        const completedTasks = await completedResponse.json();

        
        const taskTypeCounts = allTasks.reduce((acc, task) => {
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

        
        const priorityCounts = allTasks.reduce((acc, task) => {
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

        
        const categoryCounts = allTasks.reduce((acc, task) => {
          acc[task.category] = (acc[task.category] || 0) + 1;
          return acc;
        }, {});

        
        const completedTaskIds = completedTasks.map(task => task.Task_ID);
        const totalTasksCount = allTasks.length;
        const completedTasksCount = completedTasks.length;
        const uncompletedTasksCount = totalTasksCount - completedTasksCount;

        const completionChartData = {
          labels: ['Completed', 'Uncompleted'],
          datasets: [
            {
              label: 'Task Completion',
              data: [completedTasksCount, uncompletedTasksCount],
              backgroundColor: [
                'rgba(75, 192, 192, 0.6)',
                'rgba(255, 99, 132, 0.6)'
              ],
              borderColor: [
                'rgba(75, 192, 192, 1)',
                'rgba(255, 99, 132, 1)'
              ],
              borderWidth: 1,
              hoverOffset: 10,
            },
          ],
        };

        setTaskData(taskChartData);
        setPriorityData(priorityChartData);
        setCategoryData(categoryCounts);
        setCompletionData(completionChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching task data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchTaskData();
  }, []);

  return (
    <div className="dashboard__container" id="dashboard__container">
      <Notification />
      <div className="dashboard__charts-container">
        <div className="dashboard__chart-card dashboard__task-type-card">
          <h2>Task Type Distribution</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="dashboard__error-message">Error: {error}</p>
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
                <div className="dashboard__selected-info">
                  <h3>Selected Task Type: {selectedTaskType}</h3>
                  <p>Click on a segment to view details.</p>
                </div>
              )}
            </>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="dashboard__chart-card dashboard__priority-card">
          <h2>Priority Distribution</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="dashboard__error-message">Error: {error}</p>
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
                <div className="dashboard__selected-info">
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

      <div className="dashboard__completion-container">
        <div className="dashboard__category-card">
          <h2>Task Categories</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="dashboard__error-message">Error: {error}</p>
          ) : categoryData ? (
            <div className="dashboard__category-list">
              {Object.entries(categoryData).map(([category, count]) => (
                <div key={category} className="dashboard__category-item">
                  <span className="dashboard__category-name">{category}</span>
                  <span className="dashboard__category-count">{count} tasks</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>

        <div className="dashboard__chart-card dashboard__completion-card">
          <h2>Task Completion</h2>
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="dashboard__error-message">Error: {error}</p>
          ) : completionData ? (
            <Pie
              data={completionData}
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
              }}
            />
          ) : (
            <p>No data available</p>
          )}
        </div>
      </div>

      <div className="dashboard__report-button-container">
        <button className="dashboard__report-button" onClick={generatePDF}>
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default Dashboard;