import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./notification.css"; 
import notificationIcon from "./Assets/notification_icon.png";
import axios from 'axios';

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDate] = useState(new Date()); 
  const [currentTime, setCurrentTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const notificationRef = useRef(null);
  const [approvedTasks, setApprovedTasks] = useState([]);
  const [rejectedTasks, setRejectedTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  // Store notification data in a ref to keep them consistent between renders
  const notificationDataRef = useRef({});
  // Store active notifications that haven't been dismissed
  const [activeNotifications, setActiveNotifications] = useState([]);
  // Store read status to track which notifications have been viewed
  const [readStatus, setReadStatus] = useState({});

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setCurrentTime(formattedTime);
    };

    updateClock(); 
    const interval = setInterval(updateClock, 1000); 

    return () => clearInterval(interval); 
  }, []);

  // Fetch tasks data for notifications
  useEffect(() => {
    const fetchTaskData = async () => {
      try {
        // Get the logged-in user from localStorage
        const userJSON = localStorage.getItem('fm_user');
        if (!userJSON) {
          console.log('User not found in localStorage');
          setLoading(false);
          return;
        }
        
        const user = JSON.parse(userJSON);
        const technicianId = user.technicianId;
        
        if (!technicianId) {
          console.log('No technician ID found');
          setLoading(false);
          return;
        }
        
        console.log('Fetching notification tasks for technician ID:', technicianId);
        
        // Hard-coded API base URL - change this to match your backend server
        const API_BASE_URL = 'http://localhost:4000';
        
        try {
          // Fetch approved tasks
          const approvedResponse = await axios.get(`${API_BASE_URL}/api/approved-tasks/technician/${technicianId}`);
          console.log('Notification - Approved tasks response:', approvedResponse.data);
          setApprovedTasks(Array.isArray(approvedResponse.data) ? approvedResponse.data : []);
        } catch (approvedError) {
          console.error('Error fetching approved tasks for notifications:', approvedError);
          setApprovedTasks([]);
        }
        
        try {
          // Fetch rejected tasks
          const rejectedResponse = await axios.get(`${API_BASE_URL}/api/rejected-tasks/technician/${technicianId}`);
          console.log('Notification - Rejected tasks response:', rejectedResponse.data);
          setRejectedTasks(Array.isArray(rejectedResponse.data) ? rejectedResponse.data : []);
        } catch (rejectedError) {
          console.error('Error fetching rejected tasks for notifications:', rejectedError);
          setRejectedTasks([]);
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching notification task data:', err);
        setLoading(false);
        // Initialize with empty arrays on error
        setApprovedTasks([]);
        setRejectedTasks([]);
      }
    };

    fetchTaskData();
  }, []);

  // Initialize active notifications once data is loaded
  useEffect(() => {
    if (!loading) {
      const notifications = generateTaskNotifications();
      setActiveNotifications(notifications);
      
      // Initialize all notifications as unread
      const initialReadStatus = {};
      notifications.forEach(notification => {
        initialReadStatus[notification.id] = false;
      });
      setReadStatus(initialReadStatus);
    }
  }, [loading, approvedTasks, rejectedTasks]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setShowCalendar(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formattedDate = currentDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Generate notifications from task data
  const generateTaskNotifications = () => {
    const notifications = [];
    
    // Add recent approved tasks (maximum 5)
    if (approvedTasks && approvedTasks.length > 0) {
      approvedTasks.slice(0, 5).forEach((task, index) => {
        const taskId = `approved-${task.Task_ID || index}`;
        
        // Format date properly
        const completionDate = task.Completion_Date 
          ? new Date(task.Completion_Date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            }) 
          : "Recently";
        
        notifications.push({
          id: taskId,
          type: 'approved',
          title: task.Issue_Title || 'Task',
          location: task.Location || 'Unknown location',
          category: task.category || 'General',
          details: `Task approved on ${completionDate}`,
          date: completionDate
        });
      });
    }
    
    // Add recent rejected tasks (maximum 5)
    if (rejectedTasks && rejectedTasks.length > 0) {
      rejectedTasks.slice(0, 5).forEach((task, index) => {
        const taskId = `rejected-${task.Task_ID || index}`;
        
        // Format date properly
        const rejectionDate = task.Rejected_Date 
          ? new Date(task.Rejected_Date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric"
            }) 
          : "Recently";
        
        notifications.push({
          id: taskId,
          type: 'rejected',
          title: task.Issue_Title || 'Task',
          location: task.Location || 'Unknown location',
          category: task.category || 'General',
          details: `Reason: ${task.Rejection_Reason || 'Not specified'}`,
          date: rejectionDate
        });
      });
    }
    
    // Add default notifications if both arrays are empty and we're not still loading
    if (notifications.length === 0 && !loading) {
      const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      });
      
      notifications.push(
        { 
          id: 'system-1', 
          type: 'system', 
          title: "System Update", 
          details: "New task assignment system now active",
          date: today
        },
        { 
          id: 'system-2', 
          type: 'system', 
          title: "Reminder", 
          details: "Complete your pending tasks",
          date: today
        }
      );
    }
    
    return notifications;
  };

  // Handle notification click to mark as read
  const handleNotificationClick = (id) => {
    setReadStatus(prev => ({
      ...prev,
      [id]: true
    }));
  };

  // Handle notification removal
  const handleRemoveNotification = (id, event) => {
    // Stop the click event from propagating to parent elements
    event.stopPropagation();
    
    // Remove the notification from activeNotifications
    setActiveNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  return (
    <div className="dashboard-container">
      {/* Top Bar with Date, Time, and Notification */}
      <div className="top-bar">
        {/* Left-Aligned Time */}
        <div className="top-bar-left-time">{currentTime}</div>

        {/* Clickable Date with Calendar Popup */}
        <div className="top-bar-date" onClick={() => setShowCalendar(!showCalendar)}>
          <span className="date-icon">📅</span> {formattedDate}
        </div>

        {showCalendar && (
          <div className="calendar-popup" ref={calendarRef}>
            <div className="calendar-header">Calendar</div>
            <DatePicker
              selected={currentDate} 
              inline
            />
          </div>
        )}

        {/* Notification Section */}
        <div className="notification-wrapper" ref={notificationRef}>
          <img
            src={notificationIcon}
            alt="Notifications"
            className="notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {activeNotifications.length > 0 && <span className="notification-badge">{activeNotifications.length}</span>}

          {/* Notification Dropdown - Shows when clicked */}
          {showNotifications && (
            <div className="notification-dropdown">
              <div className="notification-header">
                <span>Notifications</span>
                {activeNotifications.length > 0 && 
                  <span className="notification-count">{activeNotifications.length} notifications</span>
                }
              </div>

              {loading ? (
                <div className="notification-loading">
                  <div className="loading-spinner"></div>
                  <p>Loading notifications...</p>
                </div>
              ) : activeNotifications.length > 0 ? (
                <div className="notification-list">
                  {activeNotifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notification-item ${notification.type === 'rejected' ? 'notification-rejected' : notification.type === 'approved' ? 'notification-approved' : 'notification-system'} ${!readStatus[notification.id] ? 'new-notification' : ''}`}
                      onClick={() => handleNotificationClick(notification.id)}
                    >
                      <div className="notification-status-icon">
                        {notification.type === 'approved' ? '✓' : 
                         notification.type === 'rejected' ? '✗' : 'ℹ'}
                      </div>
                      
                      <div className="notification-text">
                        <div className="notification-header-row">
                          <span className="notification-title">
                            {notification.type === 'approved' ? 'Task Approved' : 
                             notification.type === 'rejected' ? 'Task Rejected' : 
                             notification.title}
                          </span>
                          <span className="notification-date">{notification.date}</span>
                        </div>
                        
                        {(notification.type === 'approved' || notification.type === 'rejected') ? (
                          <div className="notification-content">
                            <p className="notification-task-title">{notification.title}</p>
                            <div className="notification-details">
                              <div className="notification-detail-item">
                                <span className="notification-label">Category:</span> 
                                <span className="notification-value">{notification.category}</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="notification-label">Location:</span> 
                                <span className="notification-value">{notification.location}</span>
                              </div>
                              <div className="notification-detail-item">
                                <span className="notification-info">{notification.details}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="notification-content">
                            <p className="notification-info">{notification.details}</p>
                          </div>
                        )}
                      </div>
                      
                      {/* Close button to remove notification */}
                      <div 
                        className="notification-close" 
                        onClick={(e) => handleRemoveNotification(notification.id, e)}
                      >
                        &times;
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-notifications">
                  <div className="empty-notifications-icon">🔔</div>
                  <p>No new notifications</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;