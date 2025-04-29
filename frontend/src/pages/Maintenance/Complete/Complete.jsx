import React, { useState, useEffect } from 'react';
import Notification from '../notification/notification.jsx';
import styles from './Complete.module.css'; // Import the CSS module
import '../notification/notification.css';

function Complete() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    // Get logged in user from localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('fm_user'));
    
    if (loggedInUser && loggedInUser.technicianId) {
      fetchTasks(loggedInUser.technicianId);
    } else {
      console.error('No technicianId found in localStorage');
      setLoading(false);
    }
  }, []);

  const fetchTasks = async (id) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/api/stasks/submitted-tasks/technician/${id}`);
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (task) => {
    setSelectedTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedTask(null);
  };

  const handleUpdate = async () => {
    try {
      const updatedTask = {
        ...selectedTask,
        Completion_Date: new Date().toISOString().split('T')[0],
      };

      const response = await fetch(`http://localhost:4000/api/stasks/submitted-tasks/technician/${selectedTask.Technician_ID}/task/${selectedTask.Task_ID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedTask),
      });
      const data = await response.json();
      if (response.ok) {
        setTasks(tasks.map(task => task._id === selectedTask._id ? data.task : task));
        setSuccessMessage('Update Successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`http://localhost:4000/api/stasks/submitted-tasks/technician/${selectedTask.Technician_ID}/task/${selectedTask.Task_ID}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setTasks(tasks.filter(task => task._id !== selectedTask._id));
        setSuccessMessage('Delete Successfully');
        setTimeout(() => setSuccessMessage(''), 3000);
        handleCloseForm();
      }
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className={styles.completedTasksContainer}>
      <Notification />
      <h2 className={styles.completedTasksHeading}>My Completed Tasks</h2>
      
      {loading ? (
        <p className={styles.completedTasksLoading}>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className={styles.completedTasksEmpty}>No completed tasks found.</p>
      ) : (
        <div className={styles.completedTasksCardsContainer}>
          {tasks.map((task) => (
            <div key={task._id} className={styles.completedTaskCard}>
              <h3 className={styles.completedTaskTitle}>{task.Issue_Title}</h3>
              <p className={styles.completedTaskDescription}>{task.Description}</p>
              <p className={styles.completedTaskDate}><strong>Completed on:</strong> {task.Completion_Date}</p>
              <div className={styles.completedTaskEditButtonContainer}>
                <button className={styles.completedTaskEditButton} onClick={() => handleEditClick(task)}>Edit</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {showForm && selectedTask && (
        <div className={styles.completedTaskFormOverlay} onClick={handleCloseForm}>
          <div className={styles.completedTaskFormContainer} onClick={(e) => e.stopPropagation()}>
            <div className={styles.completedTaskFormHeader}>
              <h2 className={styles.completedTaskFormTitle}>Edit Task Completion</h2>
              <button className={styles.completedTaskCloseButton} onClick={handleCloseForm}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
            <form className={styles.completedTaskForm}>
              <div className={styles.completedTaskFormGrid}>
                <div className={styles.completedTaskFormColumn}>
                  <label className={styles.completedTaskFormLabel}>Task ID:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={selectedTask.Task_ID} readOnly />
                  <label className={styles.completedTaskFormLabel}>Category:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={selectedTask.category} readOnly />
                  <label className={styles.completedTaskFormLabel}>Location:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={selectedTask.Location} readOnly />
                </div>
                <div className={styles.completedTaskFormColumn}>
                  <label className={styles.completedTaskFormLabel}>Technician ID:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={selectedTask.Technician_ID} readOnly />
                  <label className={styles.completedTaskFormLabel}>Technician Name:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={selectedTask.Technician_Name} readOnly />
                  <label className={styles.completedTaskFormLabel}>Completion Date:</label>
                  <input className={styles.completedTaskFormInput} type="text" value={new Date().toISOString().split('T')[0]} readOnly />
                </div>
              </div>
              <label className={styles.completedTaskFormLabel}>Description:</label>
              <textarea
                className={styles.completedTaskFormTextarea}
                value={selectedTask.Description}
                onChange={(e) => setSelectedTask({ ...selectedTask, Description: e.target.value })}
              />
              <div className={styles.completedTaskFormButtons}>
                <button className={styles.completedTaskUpdateButton} type="button" onClick={handleUpdate}>Update</button>
                <button className={styles.completedTaskDeleteButton} type="button" onClick={handleDelete}>Delete</button>
              </div>
            </form>
          </div>
        </div>
      )}
      {successMessage && (
        <div className={styles.completedTaskSuccessMessage}>
          {successMessage}
        </div>
      )}
    </div>
  );
}

export default Complete;