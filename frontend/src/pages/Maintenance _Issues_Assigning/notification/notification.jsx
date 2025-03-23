import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./notification.css"; // Updated path
import notificationIcon from "./Assets/notification_icon.png"; // Path remains the same

const Notification = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [currentDate] = useState(new Date()); // Remove setCurrentDate to prevent updates
  const [currentTime, setCurrentTime] = useState("");
  const [showCalendar, setShowCalendar] = useState(false);
  const calendarRef = useRef(null);
  const notificationRef = useRef(null);

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

    updateClock(); // Initialize immediately
    const interval = setInterval(updateClock, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval
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

  const notifications = [
    { id: 1, text: "New task has been assigned to you and 2 others.", time: "9 days ago" },
    { id: 2, text: "New task has been assigned to you and 2 others.", time: "9 days ago" }
  ];

  return (
    <div className="dashboard-container">
      {/* Top Bar with Date, Time, and Notification */}
      <div className="top-bar">
        {/* Left-Aligned Time */}
        <div className="top-bar-left-time">{currentTime}</div>

        {/* Clickable Date with Calendar Popup */}
        <div className="top-bar-date" onClick={() => setShowCalendar(!showCalendar)}>
          {formattedDate}
        </div>

        {showCalendar && (
          <div className="calendar-popup" ref={calendarRef}>
            <DatePicker
              selected={currentDate} // Prevent change
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
          {notifications.length > 0 && <span className="notification-badge">{notifications.length}</span>}

          {/* Notification Dropdown - Shows when clicked */}
          {showNotifications && (
            <div className="notification-dropdown">
              {notifications.length > 0 ? (
                <>
                  {notifications.map((notification) => (
                    <div key={notification.id} className="notification-item">
                      <div className="notification-text">
                        <p><strong>Alert</strong> <span className="notification-time">{notification.time}</span></p>
                        <p>{notification.text}</p>
                      </div>
                    </div>
                  ))}
                </>
              ) : (
                <p className="no-notifications">No new notifications</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
