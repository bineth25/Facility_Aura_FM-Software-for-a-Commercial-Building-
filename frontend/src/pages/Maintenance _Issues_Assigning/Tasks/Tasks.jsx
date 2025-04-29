import React, { useState, useEffect } from 'react';
import './Tasks.css';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import plusIcon from './Assets/plus.png';
import axios from 'axios';

function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [taskID, setTaskID] = useState('');
  const [taskType, setTaskType] = useState('Maintenance');
  const [issueTitle, setIssueTitle] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('Low');
  const [location, setLocation] = useState('');
  const [technicianID, setTechnicianID] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [description, setDescription] = useState('');
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);
  const [filteredTechnicianIDs, setFilteredTechnicianIDs] = useState([]);

  // Validation error states
  const [issueTitleError, setIssueTitleError] = useState('');
  const [technicianNameError, setTechnicianNameError] = useState('');
  const [locationError, setLocationError] = useState('');

  // Map categories to their respective technician IDs
  const categoryTechnicianMap = {
    'Plumbing': ['PL001', 'PL002'],
    'Electrical': ['EL001', 'EL002'],
    'HVAC': ['HV001', 'HV002'],
    'Mechanical': ['MT001', 'MT002'],
    'Elevator Maintenance': ['ET001', 'ET002'],
    'Handyman': ['HA001', 'HA002'],
    'Security System Maintenance': ['SS001', 'SS002']
  };

  const technicianIDs = [
    'PL001', 'PL002', 
    'EL001', 'EL002', 
    'HV001', 'HV002', 
    'MT001', 'MT002', 
    'ET001', 'ET002', 
    'HA001', 'HA002', 
    'SS001', 'SS002'
  ];

  useEffect(() => {
    fetchTasks();
  }, []);

  // Update filtered technician IDs when category changes
  useEffect(() => {
    if (category && categoryTechnicianMap[category]) {
      setFilteredTechnicianIDs(categoryTechnicianMap[category]);
      // Reset technician ID if current selection is not in the filtered list
      if (technicianID && !categoryTechnicianMap[category].includes(technicianID)) {
        setTechnicianID('');
        setTechnicianName('');
      }
    } else {
      setFilteredTechnicianIDs([]);
      setTechnicianID('');
      setTechnicianName('');
    }
  }, [category]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tasks/getall');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const openForm = () => {
    const nextTaskID = tasks.length > 0 ? Math.max(...tasks.map(task => parseInt(task.Task_ID))) + 1 : 1;
    setTaskID(nextTaskID.toString());
    setAssignedDate(new Date().toISOString().split('T')[0]);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    resetForm();
  };

  const resetForm = () => {
    setTaskID('');
    setIssueTitle('');
    setCategory('');
    setPriority('Low');
    setLocation('');
    setTechnicianID('');
    setTechnicianName('');
    setAssignedDate('');
    setDescription('');
    setWordCount(0);
    setError('');
    setSuccessMessage('');
    setEditTask(null);
    setIssueTitleError('');
    setTechnicianNameError('');
    setLocationError('');
    setFilteredTechnicianIDs([]);
  };

  const countWords = (value) => value.trim().split(/\s+/).length;

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    const words = countWords(value);
    if (words <= 20) {
      setDescription(value);
      setWordCount(words);
    }
  };

  const validateIssueTitle = (value) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(value)) {
      setIssueTitleError('Only alphabetic characters and spaces are allowed.');
      return false;
    } else {
      setIssueTitleError('');
      return true;
    }
  };

  const validateTechnicianName = (value) => {
    const regex = /^[A-Za-z\s]+$/;
    if (!regex.test(value)) {
      setTechnicianNameError('Only alphabetic characters and spaces are allowed.');
      return false;
    } else {
      setTechnicianNameError('');
      return true;
    }
  };

  const validateLocation = (value) => {
    const regex = /^[A-Za-z0-9\s]+$/;
    if (!regex.test(value)) {
      setLocationError('Only alphanumeric characters and spaces are allowed.');
      return false;
    } else {
      setLocationError('');
      return true;
    }
  };

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const isIssueTitleValid = validateIssueTitle(issueTitle);
    const isTechnicianNameValid = validateTechnicianName(technicianName);
    const isLocationValid = validateLocation(location);

    if (!isIssueTitleValid || !isTechnicianNameValid || !isLocationValid) {
      return;
    }

    try {
      const taskData = {
        Task_ID: taskID,
        Task_Type: taskType,
        Issue_Title: issueTitle,
        category: category,
        priority: priority,
        Location: location,
        Technician_ID: technicianID,
        Technician_Name: technicianName,
        Assigned_Date: assignedDate,
        Description: description
      };

      const response = await axios.post('http://localhost:4000/api/tasks/upload', taskData);

      setPopupMessage('Task assigned successfully!');
      setPopupColor('green');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);

      closeForm();
      fetchTasks();
    } catch (error) {
      setPopupMessage('Failed to assign task. Please try again.');
      setPopupColor('red');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);
    }
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setTaskID(task.Task_ID);
    setTaskType(task.Task_Type);
    setIssueTitle(task.Issue_Title);
    setCategory(task.category);
    setPriority(task.priority);
    setLocation(task.Location);
    setTechnicianID(task.Technician_ID);
    setTechnicianName(task.Technician_Name);
    setAssignedDate(task.Assigned_Date);
    setDescription(task.Description);
    setWordCount(countWords(task.Description));
    
    // Set the filtered technician IDs based on the category
    if (task.category && categoryTechnicianMap[task.category]) {
      setFilteredTechnicianIDs(categoryTechnicianMap[task.category]);
    } else {
      setFilteredTechnicianIDs([]);
    }
    
    setShowForm(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    const isIssueTitleValid = validateIssueTitle(issueTitle);
    const isTechnicianNameValid = validateTechnicianName(technicianName);
    const isLocationValid = validateLocation(location);

    if (!isIssueTitleValid || !isTechnicianNameValid || !isLocationValid) {
      return;
    }

    try {
      const taskData = {
        Task_ID: taskID,
        Task_Type: taskType,
        Issue_Title: issueTitle,
        category: category,
        priority: priority,
        Location: location,
        Technician_ID: technicianID,
        Technician_Name: technicianName,
        Assigned_Date: assignedDate,
        Description: description
      };

      const response = await axios.put(`http://localhost:4000/api/tasks/update/${taskID}`, taskData);

      setPopupMessage('Task updated successfully!');
      setPopupColor('green');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);

      closeForm();
      fetchTasks();
    } catch (error) {
      setPopupMessage('Failed to update task. Please try again.');
      setPopupColor('red');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);
    }
  };

  const handleDelete = async (taskId) => {
    setDeleteTaskId(taskId);
  };

  const confirmDelete = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/tasks/delete/${deleteTaskId}`);
      setPopupMessage('Task deleted successfully!');
      setPopupColor('green');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);
      fetchTasks();
    } catch (error) {
      setPopupMessage('Failed to delete task. Please try again.');
      setPopupColor('red');
      setTimeout(() => {
        setPopupMessage('');
        setPopupColor('');
      }, 3000);
    } finally {
      setDeleteTaskId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteTaskId(null);
  };

  return (
    <div className="tasks-container">
      <Notification />
      {popupMessage && (
        <div className="tm-popup-message" style={{ backgroundColor: popupColor }}>
          {popupMessage}
        </div>
      )}
      {error && <p className="tm-error-message">{error}</p>}
      <button className="tm-assign-task-btn" onClick={openForm}>
        <img src={plusIcon} alt="Plus Icon" className="tm-plus-icon" />
        Assign Task
      </button>

      {showForm && (
        <div className="tm-modal-overlay">
          <div className="tm-task-form">
            <div className="tm-form-header tm-centered-title">
              <h2>{editTask ? 'Edit Task' : 'Task Assignment'}</h2>
              <button className="tm-close-icon" onClick={closeForm}>&times;</button>
            </div>

            <form onSubmit={editTask ? handleUpdate : handleSubmit}>
              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>Task ID:</label>
                  <input type="text" value={taskID} readOnly />
                </div>
                <div className="tm-form-group">
                  <label>Task Type:</label>
                  <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                    <option></option>
                    <option>Maintenance</option>
                    <option>Issue</option>
                  </select>
                </div>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>Issue Title:</label>
                  <input
                    type="text"
                    value={issueTitle}
                    onChange={(e) => {
                      setIssueTitle(e.target.value);
                      validateIssueTitle(e.target.value);
                    }}
                    required
                  />
                  {issueTitleError && <p className="tm-error-message">{issueTitleError}</p>}
                </div>
                <div className="tm-form-group">
                  <label>Category:</label>
                  <select value={category} onChange={handleCategoryChange}>
                    <option value="">Select Category</option>
                    <option>Electrical</option>
                    <option>Plumbing</option>
                    <option>HVAC</option>
                    <option>Mechanical</option>
                    <option>Elevator Maintenance</option>
                    <option>Handyman</option>
                    <option>Security System Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>Priority:</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option></option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="tm-form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value);
                      validateLocation(e.target.value);
                    }}
                    required
                  />
                  {locationError && <p className="tm-error-message">{locationError}</p>}
                </div>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>MSM ID:</label>
                  <select
                    value={technicianID}
                    onChange={(e) => setTechnicianID(e.target.value)}
                    required
                    disabled={filteredTechnicianIDs.length === 0}
                  >
                    <option value="">Select Technician ID</option>
                    {filteredTechnicianIDs.map((id) => (
                      <option key={id} value={id}>{id}</option>
                    ))}
                  </select>
                  {filteredTechnicianIDs.length === 0 && category && (
                    <p className="tm-error-message">Please select a valid category first</p>
                  )}
                </div>
                <div className="tm-form-group">
                  <label>MSM Name:</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => {
                      setTechnicianName(e.target.value);
                      validateTechnicianName(e.target.value);
                    }}
                    required
                  />
                  {technicianNameError && <p className="tm-error-message">{technicianNameError}</p>}
                </div>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group">
                  <label>Assigned Date:</label>
                  <input type="date" value={assignedDate} readOnly />
                </div>
              </div>

              <div className="tm-form-row">
                <div className="tm-form-group tm-full-width">
                  <label>Description (Max 20 words):</label>
                  <textarea className="tm-textarea" value={description} onChange={handleDescriptionChange}></textarea>
                  <p className="tm-word-count">Words: {wordCount} / 20</p>
                </div>
              </div>

              <div className="tm-form-buttons">
                <button type="submit" className="tm-assign-btn">{editTask ? 'Update Task' : 'Assign'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTaskId && (
        <div className="tm-modal-overlay">
          <div className="tm-confirmation-dialog">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="tm-confirmation-buttons">
              <button onClick={confirmDelete} className="tm-confirm-btn">Yes</button>
              <button onClick={cancelDelete} className="tm-cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}

      <div className="tm-tasks-list">
        <h2>Task List</h2>
        <div className="tm-task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="tm-task-card">
              <h3>{task.Issue_Title}</h3>
              <div className="tm-task-details">
                <p><strong>Task ID:</strong> {task.Task_ID}</p>
                <p><strong>Task Type:</strong> {task.Task_Type}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Location:</strong> {task.Location}</p>
                <p><strong>MSM ID:</strong> {task.Technician_ID}</p>
                <p><strong>MSM Name:</strong> {task.Technician_Name}</p>
                <p><strong>Assigned Date:</strong> {task.Assigned_Date}</p>
                <p><strong>Description:</strong> {task.Description}</p>
              </div>
              <div className="tm-card-buttons">
                <button className="tm-edit-btn" onClick={() => handleEdit(task)}>Edit</button>
                <button className="tm-delete-btn" onClick={() => handleDelete(task.Task_ID)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;