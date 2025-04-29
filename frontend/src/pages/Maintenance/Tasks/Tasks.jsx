import React, { useState, useEffect } from 'react';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import './Tasks.css';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const [description, setDescription] = useState('');
    const [submissionNotification, setSubmissionNotification] = useState(null);
    const [error, setError] = useState(null);
    const [technicianId, setTechnicianId] = useState('');

    useEffect(() => {
        // Get user data from localStorage
        const userData = localStorage.getItem('fm_user');
        if (userData) {
            const user = JSON.parse(userData);
            if (user.technicianId) {
                setTechnicianId(user.technicianId);
                fetchTasks(user.technicianId);
            } else {
                setError('No technician ID found. Please log in with a valid technician email.');
            }
        } else {
            setError('You are not logged in. Please log in first.');
        }
    }, []);

    const fetchTasks = async (id) => {
        try {
            const response = await fetch(`http://localhost:4000/api/stasks/tasks/technician/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const tasksWithStatus = data.map(task => ({ ...task, status: task.status || 'Pending' }));
            setTasks(tasksWithStatus);
            setError(null);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setError('Failed to fetch tasks. Please check your connection or try again later.');
        }
    };

    const handleTaskClick = (task) => {
        if (task.status !== 'Done') {
            setSelectedTask(task);
            setDescription('');
            setShowForm(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // First, submit the task to submitted_tasks collection
            const submitResponse = await fetch('http://localhost:4000/api/stasks/tasks/submit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...selectedTask,
                    Description: description,
                    Completion_Date: new Date().toISOString().split('T')[0],
                }),
            });
            const submitData = await submitResponse.json();
            
            if (submitResponse.ok || submitResponse.status === 400) {
                // If submission was successful or task was already submitted
                // Next, delete the task from task_details collection
                const taskId = selectedTask.Task_ID;
                const deleteResponse = await fetch(`http://localhost:4000/api/stasks/tasks/${taskId}`, {
                    method: 'DELETE',
                });
                
                if (deleteResponse.ok) {
                    // Update UI
                    const updatedTasks = tasks.filter(task => task.Task_ID !== selectedTask.Task_ID);
                    setTasks(updatedTasks);
                    setShowForm(false);
                    
                    if (submitResponse.ok) {
                        setSubmissionNotification('Task submitted successfully!');
                    } else {
                        setSubmissionNotification('Task already submitted!');
                    }
                    setTimeout(() => setSubmissionNotification(null), 3000);
                } else {
                    // Task deletion failed
                    console.error('Failed to delete task from task_details');
                    setSubmissionNotification('Task submitted but failed to remove from active tasks.');
                    setTimeout(() => setSubmissionNotification(null), 3000);
                    
                    // Still update UI to show task as done
                    const updatedTasks = tasks.map(task =>
                        task.Task_ID === selectedTask.Task_ID ? { ...task, status: 'Done' } : task
                    );
                    setTasks(updatedTasks);
                    setShowForm(false);
                }
            }
        } catch (error) {
            console.error('Error submitting task:', error);
            setSubmissionNotification('Failed to submit task. Please check your connection or try again later.');
            setTimeout(() => setSubmissionNotification(null), 3000);
        }
    };

    return (
        <div className="tasks-container">
            <Notification />
            {submissionNotification && (
                <div className={submissionNotification.includes('already') || submissionNotification.includes('failed') ? 'error-notification' : 'submission-notification'}>
                    {submissionNotification}
                </div>
            )}
            {error && <div className="error-notification">{error}</div>}
            <div className="tasks-content">
                <div className="tasks-page-title-container">
                    <h2>Available Tasks</h2>
                </div>
                <div className="tasks-grid">
                    {tasks.map((task) => (
                        <div key={task.Task_ID} className="task-card" onClick={() => handleTaskClick(task)}>
                            <div className="task-header">
                                <h3>{task.Issue_Title}</h3>
                                <span className={`status ${task.status === 'Done' ? 'done' : 'pending'}`}>
                                    {task.status === 'Done' ? 'Done' : 'Pending'}
                                </span>
                            </div>
                            <p>{task.Description}</p>
                            <div className="task-meta">
                                <span><strong>Location:</strong> {task.Location}</span>
                                <span><strong>Category:</strong> {task.category}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {showForm && selectedTask && (
                <div className="task-form-overlay">
                    <div className="task-form-container">
                        <div className="task-form-header">
                            <h2>Submit Task Completion</h2>
                            <span className="task-close-icon" onClick={() => setShowForm(false)}>&times;</span>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-columns">
                                <div className="form-left">
                                    <div className="form-group">
                                        <label>Task ID:</label>
                                        <input type="text" value={selectedTask.Task_ID} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Category:</label>
                                        <input type="text" value={selectedTask.category} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Location:</label>
                                        <input type="text" value={selectedTask.Location} readOnly />
                                    </div>
                                </div>
                                <div className="form-right">
                                    <div className="form-group">
                                        <label>Technician ID:</label>
                                        <input type="text" value={selectedTask.Technician_ID} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Technician Name:</label>
                                        <input type="text" value={selectedTask.Technician_Name} readOnly />
                                    </div>
                                    <div className="form-group">
                                        <label>Completion Date:</label>
                                        <input type="text" value={new Date().toISOString().split('T')[0]} readOnly />
                                    </div>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Description:</label>
                                <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="task-form-actions">
                                <button type="submit" className="submit-btn">Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tasks;