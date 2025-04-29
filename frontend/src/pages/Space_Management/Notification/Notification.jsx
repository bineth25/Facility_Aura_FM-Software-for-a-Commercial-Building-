import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Notification.css';

const TenantNotifications = () => {
  const [expiringTenants, setExpiringTenants] = useState([]);
  const [remindDays, setRemindDays] = useState(7); // Default 7 days
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchExpiringLeases();
  }, [remindDays]); // Refresh when remindDays changes

  const fetchExpiringLeases = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tenants');
      const tenants = response.data;

      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + remindDays);

      const filteredTenants = tenants.filter((tenant) => {
        const leaseEndDate = new Date(tenant.leaseEndDate);
        return leaseEndDate >= today && leaseEndDate <= futureDate;
      });

      setExpiringTenants(filteredTenants);

      if (filteredTenants.length > 0) {
        Swal.fire({
          title: 'Lease Expiry Notifications',
          html: filteredTenants.map(tenant =>
            `🔔 <b>${tenant.name}</b> — Lease expires on <b>${new Date(tenant.leaseEndDate).toLocaleDateString()}</b>`
          ).join('<br><br>'),
          icon: 'warning',
          confirmButtonText: 'Okay',
          width: 600,
          timer: 10000,
          timerProgressBar: true,
        });
      }
    } catch (error) {
      console.error('Error fetching expiring leases:', error);
      // Show user-friendly error message
      Swal.fire({
        title: 'Error',
        text: 'Could not load tenant data. Please try again later.',
        icon: 'error',
      });
    }
  };

  const handleRemindDaysChange = (e) => {
    setRemindDays(Number(e.target.value));
  };

  // Fixed handleSendEmail function with proper loading state management
  const handleSendEmail = async (tenant) => {
    // Set loading state for specific tenant
    setLoadingStates(prev => ({ ...prev, [tenant._id]: true }));

    try {
      await axios.post('http://localhost:4000/api/tenants/send-expiry-email', {
        email: tenant.email,
        name: tenant.name,
        leaseEndDate: tenant.leaseEndDate,
      });

      Swal.fire({
        title: '✅ Email Sent!',
        text: `Successfully notified ${tenant.name}.`,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error sending email:', error);

      // More detailed error handling based on backend response
      let errorMessage = 'Could not send email. Please try again later.';

      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'Server is not responding. Please check your connection.';
      }

      Swal.fire({
        title: '❌ Email Failed!',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      // Clear loading state for this tenant
      setLoadingStates(prev => ({ ...prev, [tenant._id]: false }));
    }
  };

  return (
    <div className="notification-container">
      <h1>🔔 Lease Expiry Notifications</h1>

      {/* Reminder Setting Dropdown */}
      <div className="settings-bar">
        <label htmlFor="remindDaysSelect">⏳ Remind me before:</label>
        <select id="remindDaysSelect" value={remindDays} onChange={handleRemindDaysChange}>
          <option value={3}>3 days</option>
          <option value={5}>5 days</option>
          <option value={7}>7 days</option>
          <option value={15}>15 days</option>
          <option value={30}>30 days</option>
        </select>
      </div>

      {expiringTenants.length === 0 ? (
        <p className="no-notifications">🎉 No upcoming lease expirations!</p>
      ) : (
        <div className="notifications-list">
          {expiringTenants.map((tenant) => {
            // Calculate days remaining until lease expiry
            const today = new Date();
            const leaseEndDate = new Date(tenant.leaseEndDate);
            const timeDiff = leaseEndDate.getTime() - today.getTime();
            const daysRemaining = Math.ceil(timeDiff / (1000 * 3600 * 24));
            
            return (
              <div key={tenant._id} className="notification-card">
                <h3>{tenant.name}</h3>
                <p className="expiry-counter">⏱️ <strong>{daysRemaining} {daysRemaining === 1 ? 'day' : 'days'} remaining</strong></p>
                <p><strong>Tenant ID:</strong> &nbsp;&nbsp;{tenant.Tenant_ID}</p>
                <p><strong>Rented Space ID:</strong> &nbsp;&nbsp;{tenant.spaceId}</p>
                <p><strong>Lease End Date:</strong> &nbsp;&nbsp;{new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
                <p><strong>Email:</strong> &nbsp;&nbsp;{tenant.email}</p>
                <p><strong>Phone:</strong> &nbsp;&nbsp;{tenant.phone}</p>

                {/* Notify Button with loading state */}
                <button
                  className="notify-button"
                  onClick={() => handleSendEmail(tenant)}
                  disabled={loadingStates[tenant._id]}
                >
                  {loadingStates[tenant._id] ? 'Sending...' : 'Send Email Notification'}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TenantNotifications;