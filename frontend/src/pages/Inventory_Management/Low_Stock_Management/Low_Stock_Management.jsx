import React, { useState, useEffect, useRef } from 'react';
import './Low_Stock_Management.css';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Pie } from 'react-chartjs-2';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'chart.js/auto';

const Low_Stock_Management = () => {
  const [alerts, setAlerts] = useState([]);
  const [formData, setFormData] = useState({
    itemId: '',
    itemName: '',
    reorderLevel: '',
    currentQuantity: '',
    date: '',
    time: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef(null);

  const fetchData = async () => {
    try {
      const res = await axios.get('http://localhost:4000/api/lowstock');
      setAlerts(res.data);
    } catch (err) {
      toast.error('❌ Failed to fetch low stock data');
    }
  };

  useEffect(() => {
    fetchData();
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleOutsideClick = (e) => {
    if (bellRef.current && !bellRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Restrict negative numbers for reorderLevel and currentQuantity
    if ((name === 'reorderLevel' || name === 'currentQuantity') && value !== '') {
      if (Number(value) < 0) {
        return; // Do nothing if negative
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const setCurrentDateTime = () => {
    const now = new Date();
    setFormData({
      ...formData,
      date: now.toISOString().slice(0, 10),
      time: now.toTimeString().slice(0, 5)
    });
  };

  const validateForm = () => {
    const errors = {};

    const idPattern = /^[MIE]\d{3}$/;
    if (!formData.itemId) {
      errors.itemId = 'Item ID is required';
    } else if (!idPattern.test(formData.itemId)) {
      errors.itemId = 'Item ID must start with M/I/E followed by exactly 3 digits';
    } else {
      const duplicate = alerts.find(alert => alert.itemId === formData.itemId && alert._id !== editingId);
      if (duplicate) {
        errors.itemId = 'Item ID already exists. Must be unique!';
      }
    }

    if (!formData.itemName) errors.itemName = 'Item Name is required';
    if (!formData.reorderLevel) errors.reorderLevel = 'Reorder Level is required';
    else if (Number(formData.reorderLevel) < 0) errors.reorderLevel = 'Reorder Level cannot be negative';
    if (!formData.currentQuantity) errors.currentQuantity = 'Current Quantity is required';
    else if (Number(formData.currentQuantity) < 0) errors.currentQuantity = 'Current Quantity cannot be negative';
    if (!formData.date) errors.date = 'Date is required';
    if (!formData.time) errors.time = 'Time is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('❌ Please fix form errors before submitting!');
      return;
    }
  
    try {
      const now = new Date();
      const dataToSend = {
        ...formData,
        date: now.toISOString().slice(0, 10),
        time: now.toTimeString().slice(0, 5),
      };
  
      if (editingId) {
        await axios.put(`http://localhost:4000/api/lowstock/${editingId}`, dataToSend);
        toast.success('✅ Alert updated!');
      } else {
        await axios.post('http://localhost:4000/api/lowstock', dataToSend);
        toast.success('✅ Alert created and ERP notified!');
      }
  
      fetchData();
      setFormData({ itemId: '', itemName: '', reorderLevel: '', currentQuantity: '', date: '', time: '' });
      setFormErrors({});
      setEditingId(null);
    } catch (err) {
      console.error(err);
      //toast.error('❌ Error saving alert');
    }
  };
  
  const handleEdit = (alert) => {
    setFormData(alert);
    setEditingId(alert._id);
    setFormErrors({});
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this alert?')) {
      try {
        await axios.delete(`http://localhost:4000/api/lowstock/${id}`);
        toast.success('🗑️ Alert deleted!');
        fetchData();
      } catch {
        toast.error('❌ Failed to delete alert');
      }
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('Low Stock Report', 14, 14);
    autoTable(doc, {
      head: [['Item ID', 'Name', 'Reorder Level', 'Current Qty', 'Date', 'Time']],
      body: filteredAlerts.map((a) => [
        a.itemId, a.itemName, a.reorderLevel, a.currentQuantity, a.date, a.time
      ])
    });
    doc.save('LowStockReport.pdf');
  };

  const exportCSV = () => {
    const csv = [
      ['Item ID', 'Item Name', 'Reorder Level', 'Current Qty', 'Date', 'Time'],
      ...filteredAlerts.map((a) => [
        a.itemId, a.itemName, a.reorderLevel, a.currentQuantity, a.date, a.time
      ])
    ].map((row) => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'LowStockReport.csv';
    a.click();
  };

  const filteredAlerts = alerts.filter(
    (alert) =>
      alert.itemName.toLowerCase().includes(search.toLowerCase()) ||
      alert.itemId.toLowerCase().includes(search.toLowerCase())
  );

  const pieChartData = {
    labels: filteredAlerts.map((a) => a.itemName),
    datasets: [
      {
        data: filteredAlerts.map((a) => a.currentQuantity),
        backgroundColor: ['#3498db', '#f4a742', '#D32F2F', '#4CAF50', '#9c27b0']
      }
    ]
  };

  return (
    <div className="low-stock-wrapper">
      <h2>
        📦 Low Stock Management
        <div ref={bellRef} className="bell-wrapper" onClick={() => setDropdownOpen(!dropdownOpen)}>
          <span className="notification-badges">🔔 {alerts.length}</span>
          {dropdownOpen && (
            <div className="dropdown">
              {alerts.length === 0 ? (
                <p>No low stock items</p>
              ) : (
                <ul>
                  {alerts.map((alert) => (
                    <li key={alert._id}>
                      {alert.itemId} - {alert.itemName}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </h2>

      <form onSubmit={handleSubmit} className="low-stock-form">
        <input name="itemId" placeholder="Item ID" value={formData.itemId} onChange={handleChange} />
        {formErrors.itemId && <div className="error-message">{formErrors.itemId}</div>}

        <input name="itemName" placeholder="Item Name" value={formData.itemName} onChange={handleChange} />
        {formErrors.itemName && <div className="error-message">{formErrors.itemName}</div>}

        <input type="number" name="reorderLevel" placeholder="Reorder Level" value={formData.reorderLevel} onChange={handleChange} min="0" />
        {formErrors.reorderLevel && <div className="error-message">{formErrors.reorderLevel}</div>}

        <input type="number" name="currentQuantity" placeholder="Current Quantity" value={formData.currentQuantity} onChange={handleChange} min="0" />
        {formErrors.currentQuantity && <div className="error-message">{formErrors.currentQuantity}</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="date" name="date" value={formData.date} onChange={handleChange} readOnly />
          <input type="time" name="time" value={formData.time} onChange={handleChange} readOnly />
          <button type="button" onClick={setCurrentDateTime} style={{ padding: '8px', fontSize: '12px', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '6px' }}>
            Set Now
          </button>
        </div>
        {formErrors.date && <div className="error-message">{formErrors.date}</div>}
        {formErrors.time && <div className="error-message">{formErrors.time}</div>}

        <button type="submit">{editingId ? 'Update' : 'Add Alert'}</button>
      </form>

      <div className="controls">
        <input className="search" placeholder="Search by Item Name or ID" value={search} onChange={(e) => setSearch(e.target.value)} />
        <div>
          <button className="report-btn" onClick={exportPDF}>📄 Export PDF</button>
          <button className="csv-btn" onClick={exportCSV}>📊 Export CSV</button>
        </div>
      </div>

      <table className="low-stock-table">
        <thead>
          <tr>
            <th>Item ID</th><th>Name</th><th>Reorder Level</th><th>Current Qty</th><th>Date</th><th>Time</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAlerts.map((alert) => (
            <tr key={alert._id}>
              <td>{alert.itemId}</td>
              <td>{alert.itemName}</td>
              <td>{alert.reorderLevel}</td>
              <td>{alert.currentQuantity}</td>
              <td>{alert.date}</td>
              <td>{alert.time}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(alert)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(alert._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="chart-section">
        <h3>📊 Inventory Distribution</h3>
        <Pie data={pieChartData} />
      </div>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default Low_Stock_Management;
