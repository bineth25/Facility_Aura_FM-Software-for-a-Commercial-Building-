import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./notification.css"; 
import notificationIcon from "./Assets/notification_icon.png"; 
import axios from "axios"; // Import axios for API calls

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDate] = useState(new Date()); 
  const [currentTime, setCurrentTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [hiddenNotifications, setHiddenNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState([]);
  const calendarRef = useRef(null);
  const notificationRef = useRef(null);

  // Load hidden and read notifications from localStorage when component mounts
  useEffect(() => {
    const storedHiddenNotifications = localStorage.getItem('hiddenNotifications');
    if (storedHiddenNotifications) {
      setHiddenNotifications(JSON.parse(storedHiddenNotifications));
    }
    
    const storedReadNotifications = localStorage.getItem('readNotifications');
    if (storedReadNotifications) {
      setReadNotifications(JSON.parse(storedReadNotifications));
    }
  }, []);

  // Fetch submitted, approved, and rejected tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch submitted tasks
        const submittedResponse = await axios.get('http://localhost:4000/api/submitted-tasks');
        
        // Fetch approved tasks
        const approvedResponse = await axios.get('http://localhost:4000/api/approved-tasks');
        
        // Fetch rejected tasks
        const rejectedResponse = await axios.get('http://localhost:4000/api/rejected-tasks');
        
        // Transform the submitted tasks data into notification format
        const submittedNotifications = submittedResponse.data.map((task) => {
          // Calculate time ago
          const submittedDate = new Date(task.Completion_Date);
          const daysAgo = Math.floor((new Date() - submittedDate) / (1000 * 60 * 60 * 24));
          const timeAgo = daysAgo > 0 ? `${daysAgo}d ago` : 'Today';
          
          return {
            id: task._id,
            title: task.Issue_Title,
            tech: task.Technician_Name,
            category: task.category,
            location: task.Location,
            time: timeAgo,
            status: 'submitted'
          };
        });
        
        // Transform the approved tasks data into notification format
        const approvedNotifications = approvedResponse.data.map((task) => {
          // Calculate time ago
          const approvedDate = new Date(task.Approved_Date);
          const daysAgo = Math.floor((new Date() - approvedDate) / (1000 * 60 * 60 * 24));
          const timeAgo = daysAgo > 0 ? `${daysAgo}d ago` : 'Today';
          
          return {
            id: task._id,
            title: task.Issue_Title,
            tech: task.Technician_Name,
            category: task.category,
            location: task.Location,
            time: timeAgo,
            status: 'approved'
          };
        });
        
        // Transform the rejected tasks data into notification format
        const rejectedNotifications = rejectedResponse.data.map((task) => {
          // Calculate time ago
          const rejectedDate = new Date(task.Rejected_Date);
          const daysAgo = Math.floor((new Date() - rejectedDate) / (1000 * 60 * 60 * 24));
          const timeAgo = daysAgo > 0 ? `${daysAgo}d ago` : 'Today';
          
          return {
            id: task._id,
            title: task.Issue_Title,
            tech: task.Technician_Name,
            category: task.category,
            location: task.Location,
            time: timeAgo,
            status: 'rejected',
            reason: task.Rejection_Reason
          };
        });
        
        // Combine all notifications
        const allNotifications = [
          ...submittedNotifications,
          ...approvedNotifications,
          ...rejectedNotifications
        ];
        
        // Sort notifications by the most recent first
        allNotifications.sort((a, b) => {
          const timeA = a.time === 'Today' ? 0 : parseInt(a.time.split('d')[0]);
          const timeB = b.time === 'Today' ? 0 : parseInt(b.time.split('d')[0]);
          return timeA - timeB;
        });
        
        // Filter out hidden notifications
        const filteredNotifications = allNotifications.filter(
          notification => !hiddenNotifications.includes(notification.id)
        );
        
        setNotifications(filteredNotifications);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
    
    // Set interval to fetch notifications every 5 minutes
    const interval = setInterval(fetchTasks, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [hiddenNotifications]);

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

  // Function to get appropriate notification status label
  const getStatusLabel = (status) => {
    switch(status) {
      case 'approved':
        return 'Task Approved';
      case 'rejected':
        return 'Task Rejected';
      default:
        return 'Task Submitted';
    }
  };

  // Function to handle clearing a notification
  const handleClearNotification = (id, event) => {
    event.stopPropagation(); // Prevent triggering the notification item click
    
    // Add the notification ID to the hidden notifications list
    const updatedHiddenNotifications = [...hiddenNotifications, id];
    setHiddenNotifications(updatedHiddenNotifications);
    
    // Save to localStorage for persistence across page refreshes
    localStorage.setItem('hiddenNotifications', JSON.stringify(updatedHiddenNotifications));
    
    // Filter out the hidden notification from the current list
    setNotifications(notifications.filter(notification => notification.id !== id));
  };

  // Function to mark notification as read (remove highlight)
  const handleReadNotification = (id) => {
    if (!readNotifications.includes(id)) {
      const updatedReadNotifications = [...readNotifications, id];
      setReadNotifications(updatedReadNotifications);
      
      // Save to localStorage for persistence
      localStorage.setItem('readNotifications', JSON.stringify(updatedReadNotifications));
    }
  };

  return (
    <div className="notif-dashboard-container">
      {/* Top Bar with Date, Time, and Notification */}
      <div className="notif-top-bar">
        {/* Left-Aligned Time */}
        <div className="notif-top-bar-left-time">{currentTime}</div>

        {/* Clickable Date with Calendar Popup */}
        <div className="notif-top-bar-date" onClick={() => setShowCalendar(!showCalendar)}>
          {formattedDate}
        </div>

        {showCalendar && (
          <div className="notif-calendar-popup" ref={calendarRef}>
            <DatePicker
              selected={currentDate}
              inline
            />
          </div>
        )}

        {/* Notification Section */}
        <div className="notif-notification-wrapper" ref={notificationRef}>
          <img
            src={notificationIcon}
            alt="Notifications"
            className="notif-notification-icon"
            onClick={() => setShowNotifications(!showNotifications)}
          />
          {notifications.length > 0 && <span className="notif-notification-badge">{notifications.length}</span>}

          {/* Notification Dropdown - Shows when clicked */}
          {showNotifications && (
            <div className="notif-notification-dropdown">
              <div className="notif-notification-header">
                <h3>Task Updates</h3>
                <span className="notif-notification-count">{notifications.length} new</span>
              </div>
              
              {notifications.length > 0 ? (
                <div className="notif-notification-list">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`notif-notification-item ${!readNotifications.includes(notification.id) ? 'notif-notification-unread' : ''}`}
                      onClick={() => handleReadNotification(notification.id)}
                    >
                      <div className="notif-notification-icon-wrapper">
                        <div className={`notif-category-indicator notif-${notification.category.toLowerCase()}`}></div>
                      </div>
                      <div className="notif-notification-content">
                        <div className="notif-notification-title-row">
                          <h4 className="notif-notification-title">
                            {notification.title}
                            <span className={`notif-notification-status notif-${notification.status}`}>
                              {getStatusLabel(notification.status)}
                            </span>
                          </h4>
                          <span className="notif-notification-time">{notification.time}</span>
                        </div>
                        <p className="notif-notification-details">
                          <span className="notif-notification-tech">{notification.tech}</span>
                          <span className="notif-notification-location">{notification.location}</span>
                        </p>
                        {notification.status === 'rejected' && notification.reason && (
                          <p className="notif-notification-reason">
                            <span>Reason: {notification.reason}</span>
                          </p>
                        )}
                      </div>
                      <div 
                        className="notif-notification-clear" 
                        onClick={(e) => handleClearNotification(notification.id, e)}
                        title="Clear notification"
                      >
                        <span>×</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="notif-no-notifications">No new task updates</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;