import React, { useState, useEffect } from 'react';
import './Tasks.css';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import plusIcon from './Assets/plus.png';
import attachIcon from './Assets/attach_icon.png';
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
  const [attachedFile, setAttachedFile] = useState(null);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [tasks, setTasks] = useState([]);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [editTask, setEditTask] = useState(null);
  const [deleteTaskId, setDeleteTaskId] = useState(null);

  // Validation error states
  const [issueTitleError, setIssueTitleError] = useState('');
  const [technicianNameError, setTechnicianNameError] = useState('');
  const [technicianIDError, setTechnicianIDError] = useState('');
  const [locationError, setLocationError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tasks/getall');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const openForm = () => {
    const nextTaskID = tasks.length > 0 ? Math.max(...tasks.map(task => task.Task_ID)) + 1 : 1;
    setTaskID(nextTaskID.toString());
    setAssignedDate(new Date().toISOString().split('T')[0]); // Set today's date
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
    setAttachedFile(null);
    setError('');
    setPhotoError('');
    setSuccessMessage('');
    setEditTask(null);
    setIssueTitleError('');
    setTechnicianNameError('');
    setTechnicianIDError('');
    setLocationError('');
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) {
        setAttachedFile(file);
        setPhotoError('');
      } else {
        setAttachedFile(null);
        setPhotoError('File size exceeds 5MB. Please upload a smaller file.');
      }
    }
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

  // Validation functions
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

  const validateTechnicianID = (value) => {
    const regex = /^[A-Za-z0-9]+$/;
    if (!regex.test(value)) {
      setTechnicianIDError('Only alphanumeric characters are allowed.');
      return false;
    } else {
      setTechnicianIDError('');
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

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate all fields
    const isIssueTitleValid = validateIssueTitle(issueTitle);
    const isTechnicianNameValid = validateTechnicianName(technicianName);
    const isTechnicianIDValid = validateTechnicianID(technicianID);
    const isLocationValid = validateLocation(location);

    if (!isIssueTitleValid || !isTechnicianNameValid || !isTechnicianIDValid || !isLocationValid) {
      return;
    }

    const formData = new FormData();
    formData.append('Task_ID', taskID);
    formData.append('Task_Type', taskType);
    formData.append('Issue_Title', issueTitle);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('Location', location);
    formData.append('Technician_ID', technicianID);
    formData.append('Technician_Name', technicianName);
    formData.append('Assigned_Date', assignedDate);
    formData.append('Description', description);
    if (attachedFile) {
      formData.append('image', attachedFile);
    }

    try {
      const response = await axios.post('http://localhost:4000/api/tasks/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
    setShowForm(true);
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError('');
    setSuccessMessage('');

    // Validate all fields
    const isIssueTitleValid = validateIssueTitle(issueTitle);
    const isTechnicianNameValid = validateTechnicianName(technicianName);
    const isTechnicianIDValid = validateTechnicianID(technicianID);
    const isLocationValid = validateLocation(location);

    if (!isIssueTitleValid || !isTechnicianNameValid || !isTechnicianIDValid || !isLocationValid) {
      return;
    }

    const formData = new FormData();
    formData.append('Task_ID', taskID);
    formData.append('Task_Type', taskType);
    formData.append('Issue_Title', issueTitle);
    formData.append('category', category);
    formData.append('priority', priority);
    formData.append('Location', location);
    formData.append('Technician_ID', technicianID);
    formData.append('Technician_Name', technicianName);
    formData.append('Assigned_Date', assignedDate);
    formData.append('Description', description);
    if (attachedFile) {
      formData.append('image', attachedFile);
    }

    try {
      const response = await axios.put(`http://localhost:4000/api/tasks/update/${taskID}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

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
        <div className="popup-message" style={{ backgroundColor: popupColor }}>
          {popupMessage}
        </div>
      )}
      {error && <p className="error-message">{error}</p>}
      <button className="assign-task-btn" onClick={openForm}>
        <img src={plusIcon} alt="Plus Icon" className="plus-icon" />
        Assign Task
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="task-form">
            <div className="form-header centered-title">
              <h2>{editTask ? 'Edit Task' : 'Task Assignment'}</h2>
              <button className="close-btn" onClick={closeForm}>&times;</button>
            </div>

            <form onSubmit={editTask ? handleUpdate : handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Task ID:</label>
                  <input type="text" value={taskID} readOnly />
                </div>
                <div className="form-group">
                  <label>Task Type:</label>
                  <select value={taskType} onChange={(e) => setTaskType(e.target.value)}>
                    <option></option>
                    <option>Maintenance</option>
                    <option>Issue</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
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
                  {issueTitleError && <p className="error-message">{issueTitleError}</p>}
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <select type="text" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option></option>
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

              <div className="form-row">
                <div className="form-group">
                  <label>Priority:</label>
                  <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                    <option></option>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Urgent</option>
                  </select>
                </div>
                <div className="form-group">
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
                  {locationError && <p className="error-message">{locationError}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technician ID:</label>
                  <input
                    type="text"
                    value={technicianID}
                    onChange={(e) => {
                      setTechnicianID(e.target.value);
                      validateTechnicianID(e.target.value);
                    }}
                    required
                  />
                  {technicianIDError && <p className="error-message">{technicianIDError}</p>}
                </div>
                <div className="form-group">
                  <label>Technician Name:</label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => {
                      setTechnicianName(e.target.value);
                      validateTechnicianName(e.target.value);
                    }}
                    required
                  />
                  {technicianNameError && <p className="error-message">{technicianNameError}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Assigned Date:</label>
                  <input type="date" value={assignedDate} readOnly />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description (Max 20 words):</label>
                  <textarea value={description} onChange={handleDescriptionChange}></textarea>
                  <p className="word-count">Words: {wordCount} / 20</p>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Photos (Max size: 5MB):</label>
                  <div className="file-upload">
                    <label htmlFor="file-input" className="file-label">
                      <img src={attachIcon} alt="Attach Icon" className="attach-icon" />
                      <span>Attach File</span>
                    </label>
                    <input id="file-input" type="file" className="file-input" onChange={handleFileChange} />
                    {attachedFile && <p className="file-name">{attachedFile.name}</p>}
                    {photoError && <p className="error-message">{photoError}</p>}
                  </div>
                </div>
              </div>

              <div className="form-buttons">
                <button type="submit" className="assign-btn">{editTask ? 'Update Task' : 'Assign'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteTaskId && (
        <div className="modal-overlay">
          <div className="confirmation-dialog">
            <h3>Are you sure you want to delete this task?</h3>
            <div className="confirmation-buttons">
              <button onClick={confirmDelete} className="confirm-btn">Yes</button>
              <button onClick={cancelDelete} className="cancel-btn">No</button>
            </div>
          </div>
        </div>
      )}

      <div className="tasks-list">
        <h2>Task List</h2>
        <div className="task-grid">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <h3>{task.Issue_Title}</h3>
              <div className="task-details">
                <p><strong>Task ID:</strong> {task.Task_ID}</p>
                <p><strong>Task Type:</strong> {task.Task_Type}</p>
                <p><strong>Category:</strong> {task.category}</p>
                <p><strong>Priority:</strong> {task.priority}</p>
                <p><strong>Location:</strong> {task.Location}</p>
                <p><strong>Technician ID:</strong> {task.Technician_ID}</p>
                <p><strong>Technician Name:</strong> {task.Technician_Name}</p>
                <p><strong>Assigned Date:</strong> {task.Assigned_Date}</p>
                <p><strong>Description:</strong> {task.Description}</p>
                {task.image && <img src={`http://localhost:4000/${task.image}`} alt="Task" className="task-image" />}
              </div>
              <button className="edit-btn" onClick={() => handleEdit(task)}>Edit</button>
              <button className="delete-btn" onClick={() => handleDelete(task.Task_ID)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Tasks;