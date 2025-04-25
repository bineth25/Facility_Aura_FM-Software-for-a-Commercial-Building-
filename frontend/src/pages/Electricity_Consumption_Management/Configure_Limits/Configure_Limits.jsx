import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Configure_Limits.css';

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
    Renewable: { min: 2500, max: 4170 } // Solar offset per floor
  };

  if (categoryLimitsValidation[currentCategory]) {
    const { min, max } = categoryLimitsValidation[currentCategory];
    if (value < min || value > max) {
      alert(`${currentCategory} limit must be between ${min} and ${max} kWh/month for a single floor`);
      return;
    }
  }

    if (isUpdate) {
      // Update category limit
      axios.put('http://localhost:4000/api/categoryLimits/update', { category: selectedCategory, maxConsumptionLimit })
        .then(response => {
          alert(response.data.message);
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
          alert(response.data.message);
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
    }
  };

  return (
    <div className="configure-limits-container">
      <h1>Configure Maximum Consumption Limits</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="category">Select Category</label>
          <select id="category" value={category || selectedCategory} onChange={handleCategorySelect}>
            <option value="">Select Category</option>
            <option value="HVAC">HVAC</option>
            <option value="Lighting">Lighting</option>
            <option value="Renewable">Renewable</option>
            
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="maxConsumptionLimit">Max Consumption Limit (kWh)</label>
          <input
            type="number"
            id="maxConsumptionLimit"
            value={maxConsumptionLimit}
            onChange={(e) => setMaxConsumptionLimit(e.target.value)}
            min="0"
            required
          />
        </div>

        <button type="submit" className="submit-button">
          {isUpdate ? 'Update Limit' : 'Set Limit'}
        </button>
      </form>

      <div className="category-limits-list">
        <h2>Existing Category Limits</h2>
        <ul>
          {categoryLimits.map((limit) => (
            <li key={limit.category}>
              <strong>{limit.category}</strong>: {limit.maxConsumptionLimit} kWh
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ConfigureLimits;
