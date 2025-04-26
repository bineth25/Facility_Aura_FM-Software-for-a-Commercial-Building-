import React, { useState, useEffect } from 'react';
import './Add_New_Energy_Reading.css'; // Ensure the correct CSS file is imported
import { toast } from 'react-toastify';

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

    // Check if the month is the current month
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[new Date().getMonth()];
    if (formData.month !== currentMonth) {
        setError(`Please enter the current month (${currentMonth}) for energy details.`);
        return;
    }

    // NEW ALERT CHECK ADDED HERE
    const selectedCategoryLimit = categoryLimits.find(
      (limit) => limit.category === formData.category
    );
    if (selectedCategoryLimit) {
      const readingValue = parseFloat(formData.reading);
      if (readingValue > selectedCategoryLimit.maxConsumptionLimit) {
        // alert(
        //   `Warning: The entered reading for ${formData.category} exceeds the maximum allowed limit of ${selectedCategoryLimit.maxConsumptionLimit}.`
        // );
        toast.error(`Warning: The entered reading for ${formData.category} exceeds the maximum allowed limit of ${selectedCategoryLimit.maxConsumptionLimit}.`);
      }
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
            setError(data.message);  // This will handle the "Duplicate entry found" error from the backend
            setSuccessMessage('');
        }
    } catch (err) {
        setError('Error connecting to the server.');
        setSuccessMessage('');
    }
};


  return (
    <div className="energy-reading-wrapper">
      <h1 className="energy-main-title">Energy Management Dashboard</h1>

      <h3 className="energy-subtitle">Add New Energy Reading</h3>
      <form onSubmit={handleSubmit} className="energy-entry-form">
        <div className="energy-form-field">
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

        <div className="energy-form-field">
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

        <div className="energy-form-field">
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

        <div className="energy-form-field">
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
            
          </select>
        </div>

        <div className="energy-form-field">
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

        {error && <div className="energy-error-message">{error}</div>}
        {successMessage && <div className="energy-success-message">{successMessage}</div>}

        <button type="submit" className="energy-submit-button">Submit</button>
      </form>

      {/* Display Energy Category Limits */}
      <div className="energy-limits-section">
        <h3 className="energy-limits-title">Current Energy Category Limits</h3>
        {categoryLimits.map((limit) => (
          <div key={limit.category} className="energy-limit-item">
            <span>{limit.category}</span>
            <span>Max Limit: {limit.maxConsumptionLimit}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddNewEnergyReading;