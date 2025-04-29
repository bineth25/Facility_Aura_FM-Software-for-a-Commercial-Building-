import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Configure_Limits.css';
import { toast } from 'react-toastify';

const ConfigureLimits = () => {
  const [categoryLimits, setCategoryLimits] = useState([]);
  const [category, setCategory] = useState('');
  const [maxConsumptionLimit, setMaxConsumptionLimit] = useState('');
  const [isUpdate, setIsUpdate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    // Fetch existing category limits when the component mounts
    axios.get('http://localhost:4000/api/categoryLimits')
      .then(response => {
        setCategoryLimits(response.data);
      })
      .catch(error => {
        console.error('Error fetching category limits:', error);
      });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add validation for category limits
    const currentCategory = isUpdate ? selectedCategory : category;
    const value = Number(maxConsumptionLimit);

    // Define fair limits based on floor-wise recommendations
    const categoryLimitsValidation = {
      HVAC: { min: 8300, max: 10000 },
      Lighting: { min: 1250, max: 2100 },
      Renewable: { min: 2500, max: 4170 } 
    };

    if (categoryLimitsValidation[currentCategory]) {
      const { min, max } = categoryLimitsValidation[currentCategory];
      if (value < min || value > max) {
        toast.error(`${currentCategory} limit must be between ${min} and ${max} kWh/month for a single floor`, {
          position: "top-right",
          autoClose: false,
          closeOnClick: true,
          
        });
        return;
      }
    }

    if (isUpdate) {
      // Update category limit
      axios.put('http://localhost:4000/api/categoryLimits/update', { category: selectedCategory, maxConsumptionLimit })
        .then(response => {
          toast.success(response.data.message, {
            autoClose: false, 
            closeOnClick: true, 
          });
          setCategoryLimits(categoryLimits.map(limit => 
            limit.category === selectedCategory ? { ...limit, maxConsumptionLimit } : limit
          ));
        })
        .catch(error => {
          alert('Error updating category limit');
        });
    } else {
      // Set new category limit
      axios.post('http://localhost:4000/api/categoryLimits/set', { category, maxConsumptionLimit })
        .then(response => {
          toast.success(response.data.message, {
            autoClose: false, 
            closeOnClick: true, 
          });
          setCategoryLimits([...categoryLimits, response.data.categoryLimit]);
        })
        .catch(error => {
          alert('Error setting category limit');
        });
    }

    // Reset form
    setCategory('');
    setMaxConsumptionLimit('');
    setIsUpdate(false);
    setSelectedCategory('');
  };

  const handleCategorySelect = (e) => {
    const selectedLimit = categoryLimits.find(limit => limit.category === e.target.value);
    if (selectedLimit) {
      setSelectedCategory(selectedLimit.category);
      setMaxConsumptionLimit(selectedLimit.maxConsumptionLimit);
      setIsUpdate(true);
    } else {
      setCategory(e.target.value);
      setMaxConsumptionLimit('');
      setIsUpdate(false);
    }
  };

  return (
    <div className="fa-configure-limits-container">
      <h1 className="fa-section-title">Configure Maximum Consumption Limits</h1>
      <div className="fa-limits-content">
        <form onSubmit={handleSubmit} className="fa-limits-form">
          <div className="fa-form-group">
            <label htmlFor="category" className="fa-form-label">Select Category</label>
            <select 
              id="category" 
              className="fa-form-select"
              value={category || selectedCategory} 
              onChange={handleCategorySelect}
            >
              <option value="">Select Category</option>
              <option value="HVAC">HVAC</option>
              <option value="Lighting">Lighting</option>
              <option value="Renewable">Renewable</option>
            </select>
          </div>

          <div className="fa-form-group">
            <label htmlFor="maxConsumptionLimit" className="fa-form-label">Max Consumption Limit (kWh)</label>
            <input
              type="number"
              id="maxConsumptionLimit"
              className="fa-form-input"
              value={maxConsumptionLimit}
              onChange={(e) => setMaxConsumptionLimit(e.target.value)}
              min="0"
              required
            />
          </div>

          <button type="submit" className="fa-submit-button">
            {isUpdate ? 'Update Limit' : 'Set Limit'}
          </button>
        </form>

        <div className="fa-limits-display">
          <h2 className="fa-subsection-title">Existing Category Limits</h2>
          <div className="fa-limits-list">
            {categoryLimits.map((limit) => (
              <div key={limit.category} className="fa-limit-item">
                <div className="fa-limit-category">{limit.category}</div>
                <div className="fa-limit-value">{limit.maxConsumptionLimit} kWh</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigureLimits;
