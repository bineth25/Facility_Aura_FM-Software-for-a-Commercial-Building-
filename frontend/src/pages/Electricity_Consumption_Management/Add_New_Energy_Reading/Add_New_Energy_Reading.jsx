import React, { useState, useEffect } from 'react';
import './Add_New_Energy_Reading.css';

const AddNewEnergyReading = () => {
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    floor: '',
    category: '',
    reading: ''
  });
  const [categoryLimits, setCategoryLimits] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fetch energy category limits
  useEffect(() => {
    const fetchCategoryLimits = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/categoryLimits');
        const data = await response.json();
        setCategoryLimits(data);
      } catch (err) {
        setError('Error fetching category limits.');
      }
    };

    fetchCategoryLimits();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    if (!formData.year || !formData.month || !formData.floor || !formData.category || !formData.reading) {
      setError('All fields are required.');
      return;
    }

    // Check if the year is the current year
    const currentYear = new Date().getFullYear();
    if (parseInt(formData.year) !== currentYear) {
      setError(`Please enter the current year (${currentYear}) for energy details.`);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/energyReadings/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(data.message);
        setError('');
        // Reset the form after successful submission
        setFormData({
          year: '',
          month: '',
          floor: '',
          category: '',
          reading: ''
        });
      } else {
        setError(data.message);
        setSuccessMessage('');
      }
    } catch (err) {
      setError('Error connecting to the server.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="add-energy-reading-container">
      <h1>Energy Management Dashboard</h1>

      <h3 style={{ color: 'blue' }}>Add New Energy Reading</h3>
      <form onSubmit={handleSubmit} className="energy-form">
        <div className="form-group">
          <label htmlFor="year">Year:</label>
          <select
            name="year"
            value={formData.year}
            onChange={handleChange}
            required
          >
            <option value="">Select a year</option>
            {Array.from({ length: 27 }, (_, index) => 2024 + index).map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="month">Month:</label>
          <select
            name="month"
            value={formData.month}
            onChange={handleChange}
            required
          >
            <option value="">Select a month</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <option key={month} value={month}>{month}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="floor">Floor:</label>
          <select
            name="floor"
            value={formData.floor}
            onChange={handleChange}
            required
          >
            <option value="">Select a floor</option>
            {Array.from({ length: 7 }, (_, index) => index + 1).map((floor) => (
              <option key={floor} value={floor}>{floor}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">Category:</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select a category</option>
            <option value="HVAC">HVAC</option>
            <option value="Lighting">Lighting</option>
            <option value="Renewable">Renewable</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="reading">Reading:</label>
          <input
            type="number"
            name="reading"
            value={formData.reading}
            onChange={handleChange}
            min="0"
            required
          />
        </div>

        {error && <div className="error-message">{error}</div>}
        {successMessage && <div className="success-message">{successMessage}</div>}

        <button type="submit" className="submit-btn">Submit</button>
      </form>

      {/* Display Energy Category Limits */}
      <div className="category-limits-container">
        <h3 style={{ color: 'navyblue' }}>Current Energy Category Limits</h3>
        {categoryLimits.map((limit) => (
          <div key={limit.category} className="category-limit">
            <span>{limit.category}</span>
            <span>Max Limit: {limit.maxConsumptionLimit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddNewEnergyReading;
