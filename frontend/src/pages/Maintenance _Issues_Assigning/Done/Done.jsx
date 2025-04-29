import React, { useEffect, useState } from 'react';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import './Done.css';

const Done = () => {
    const [tasks, setTasks] = useState([]);
    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionModal, setShowRejectionModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [actionMessage, setActionMessage] = useState({ text: '', type: '' });

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('http://localhost:4000/api/submitted-tasks');
            if (!response.ok) {
                throw new Error('Failed to fetch tasks');
            }
            const data = await response.json();
            console.log('Fetched tasks:', data); // Debugging log
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            setActionMessage({
                text: 'Failed to load tasks. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCardClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    const closeRejectionModal = () => {
        setShowRejectionModal(false);
        setRejectionReason('');
    };

    const handleApprove = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/api/submitted-tasks/approve/${selectedTask.Task_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error('Failed to approve task');
            }

            // Update local state
            setTasks(tasks.filter(task => task.Task_ID !== selectedTask.Task_ID));
            setActionMessage({
                text: 'Task approved successfully!',
                type: 'success'
            });
            closeModal();
        } catch (error) {
            console.error('Error approving task:', error);
            setActionMessage({
                text: 'Failed to approve task. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const openRejectionModal = () => {
        setShowRejectionModal(true);
        setShowModal(false);
    };

    const submitRejection = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`http://localhost:4000/api/submitted-tasks/reject/${selectedTask.Task_ID}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rejectionReason })
            });

            if (!response.ok) {
                throw new Error('Failed to reject task');
            }

            // Update local state
            setTasks(tasks.filter(task => task.Task_ID !== selectedTask.Task_ID));
            setActionMessage({
                text: 'Task rejected successfully!',
                type: 'success'
            });
            closeRejectionModal();
        } catch (error) {
            console.error('Error rejecting task:', error);
            setActionMessage({
                text: 'Failed to reject task. Please try again.',
                type: 'error'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Clear action message after 5 seconds
    useEffect(() => {
        if (actionMessage.text) {
            const timer = setTimeout(() => {
                setActionMessage({ text: '', type: '' });
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [actionMessage]);

    return (
        <div className="done-page-container">
            {/* Notification Bar */}
            <div className="done-notification-container">
                <Notification />
            </div>

            {/* Page Title */}
            <div className="done-page-title">
                <h1>Completed Tasks</h1>
            </div>

            {/* Action Message */}
            {actionMessage.text && (
                <div className={`done-action-message ${actionMessage.type}`}>
                    {actionMessage.text}
                </div>
            )}

            {/* Task Cards - Only Important Information */}
            <div className="done-tasks-grid">
                {isLoading ? (
                    <p className="done-loading-text">Loading tasks...</p>
                ) : tasks.length > 0 ? (
                    tasks.map(task => (
                        <div 
                            key={task.Task_ID} 
                            className="done-card-item"
                            onClick={() => handleCardClick(task)}
                        >
                            <h3 className="done-card-title">{task.Issue_Title}</h3>
                            <p className="done-card-id"><strong>Task ID:</strong> {task.Task_ID}</p>
                            <p className="done-card-category"><strong>Category:</strong> {task.category}</p>
                            <p className="done-card-location"><strong>Location:</strong> {task.Location}</p>
                            <p className="done-card-date"><strong>Completion Date:</strong> {task.Completion_Date}</p>
                        </div>
                    ))
                ) : (
                    <p className="done-empty-message">No tasks found.</p>
                )}
            </div>

            {/* Task Detail Modal */}
            {showModal && selectedTask && (
                <div className="done-modal-overlay">
                    <div className="done-modal-container">
                        <div className="done-modal-header">
                            <div className="done-close-icon-wrapper">
                                <button className="done-close-button" onClick={closeModal}>✕</button>
                            </div>
                            <h2 className="done-modal-title">{selectedTask.Issue_Title}</h2>
                        </div>
                        <div className="done-modal-content">
                            <div className="done-detail-grid">
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Task ID:</span>
                                    <span className="done-detail-value">{selectedTask.Task_ID}</span>
                                </div>
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Category:</span>
                                    <span className="done-detail-value">{selectedTask.category}</span>
                                </div>
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Location:</span>
                                    <span className="done-detail-value">{selectedTask.Location}</span>
                                </div>
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Technician ID:</span>
                                    <span className="done-detail-value">{selectedTask.Technician_ID}</span>
                                </div>
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Technician Name:</span>
                                    <span className="done-detail-value">{selectedTask.Technician_Name}</span>
                                </div>
                                <div className="done-detail-item">
                                    <span className="done-detail-label">Completion Date:</span>
                                    <span className="done-detail-value">{selectedTask.Completion_Date}</span>
                                </div>
                            </div>
                            <div className="done-description-section">
                                <h3 className="done-description-heading">Description</h3>
                                <p className="done-description-text">{selectedTask.Description}</p>
                            </div>
                        </div>
                        <div className="done-modal-actions">
                            <button 
                                className={`done-reject-btn ${isLoading ? 'done-button-disabled' : ''}`}
                                onClick={openRejectionModal}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Reject'}
                            </button>
                            <button 
                                className={`done-approve-btn ${isLoading ? 'done-button-disabled' : ''}`}
                                onClick={handleApprove}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Approve'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Rejection Reason Modal */}
            {showRejectionModal && selectedTask && (
                <div className="done-modal-overlay">
                    <div className="done-modal-container done-rejection-modal">
                        <div className="done-modal-header">
                            <div className="done-close-icon-wrapper">
                                <button className="done-close-button" onClick={closeRejectionModal}>✕</button>
                            </div>
                            <h2 className="done-modal-title">Reason</h2>
                        </div>
                        <div className="done-modal-content">
                            <div className="done-rejection-form">
                                <label htmlFor="rejection-reason">Reason for Rejection:</label>
                                <textarea
                                    id="rejection-reason"
                                    className="done-rejection-textarea"
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Please provide a reason for rejecting this task..."
                                    rows={5}
                                ></textarea>
                            </div>
                        </div>
                        <div className="done-modal-actions">
                            <button className="done-cancel-btn" onClick={closeRejectionModal}>Cancel</button>
                            <button 
                                className={`done-submit-reject-btn ${isLoading ? 'done-button-disabled' : ''}`}
                                onClick={submitRejection}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'Submit Rejection'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Done;