import React, { useState, useEffect } from 'react';
import './Add_New_Energy_Reading.css';
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

    
    const currentYear = new Date().getFullYear();
    if (parseInt(formData.year) !== currentYear) {
        setError(`Please enter the current year (${currentYear}) for energy details.`);
        return;
    }

   
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const currentMonth = months[new Date().getMonth()];
    if (formData.month !== currentMonth) {
        setError(`Please enter the current month (${currentMonth}) for energy details.`);
        return;
    }

    if (formData.reading.length >= 5) {
      toast.warning(
        "Warning: This reading is unusually high. Please verify.",
        { autoClose: false, closeOnClick: true }
      );
    }

    
    const selectedCategoryLimit = categoryLimits.find(
      (limit) => limit.category === formData.category
    );
    if (selectedCategoryLimit) {
      const readingValue = parseFloat(formData.reading);
      if (readingValue > selectedCategoryLimit.maxConsumptionLimit) {
        toast.warning(
          `Warning: The entered reading for ${formData.category} exceeds the maximum allowed limit of ${selectedCategoryLimit.maxConsumptionLimit}.`,
          {
            autoClose: false, 
            closeOnClick: true, 
          }
        );
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
            setError(data.message);  //"Duplicate entry found" error from the backend
            setSuccessMessage('');
        }
    } catch (err) {
        setError('Error connecting to the server.');
        setSuccessMessage('');
    }
  };

  return (
    <div className="energy-reading-wrapper">
      <div className="energy-header">
        <h1 className="energy-main-title">Energy Management Dashboard</h1>
        <div className="energy-title-underline"></div>
      </div>

      <div className="energy-content-container">
        <div className="energy-form-container">
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
        </div>

        {/* Display Energy Category Limits */}
        <div className="energy-limits-section">
          <h3 className="energy-limits-title">Current Energy Category Limits</h3>
          {categoryLimits.length > 0 ? (
            categoryLimits.map((limit) => (
              <div key={limit.category} className="energy-limit-item">
                <span className="energy-category-name">{limit.category}</span>
                <span className="energy-limit-value">Max Limit: {limit.maxConsumptionLimit}</span>
              </div>
            ))
          ) : (
            <div className="energy-no-limits">No category limits configured</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddNewEnergyReading;