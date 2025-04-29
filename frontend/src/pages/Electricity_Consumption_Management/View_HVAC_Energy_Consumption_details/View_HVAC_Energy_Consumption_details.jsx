import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './View_HVAC_Energy_Consumption_details.css';
import { toast } from 'react-toastify';

const ViewHVACEnergyConsumptionDetails = () => {
  const [energyReadings, setEnergyReadings] = useState([]);
  const [filteredReadings, setFilteredReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    year: '',
    month: '',
    floor: '',
    status: ''
  });

  const [editingReading, setEditingReading] = useState(null);
  const [formData, setFormData] = useState({
    year: '',
    month: '',
    floor: '',
    category: '',
    reading: ''
  });

  useEffect(() => {
    const fetchEnergyData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/energyReadings', {
          params: { category: 'HVAC' }
        });

        if (response.data.length === 0) {
          setFilteredReadings([]);
        } else {
          setEnergyReadings(response.data);
          setFilteredReadings(response.data);
        }
      } catch (err) {
        setError('Error fetching energy data');
      } finally {
        setLoading(false);
      }
    };

    fetchEnergyData();
  }, []);

  const filterReadings = () => {
    const { year, month, floor, status } = filters;
    let filtered = energyReadings;

    if (year) {
      filtered = filtered.filter((reading) => reading.year === parseInt(year));
    }
    if (month) {
      filtered = filtered.filter((reading) => reading.month === month);
    }
    if (floor) {
      filtered = filtered.filter((reading) => reading.floor === parseInt(floor));
    }
    if (status) {
      filtered = filtered.filter((reading) =>
        status === 'Exceeded' ? reading.isExceeded : !reading.isExceeded
      );
    }

    setFilteredReadings(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [name]: value };
      return updatedFilters;
    });
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/energyReadings/delete/${id}`);
      setFilteredReadings(filteredReadings.filter((reading) => reading._id !== id));

      if (filteredReadings.length === 1) {
        setFilteredReadings([]);
      }
    } catch (err) {
      setError('Error deleting energy reading');
    }

    toast.success('Reading has been deleted successfully!', {
      autoClose: false,
      closeOnClick: true
    });
  };

  const handleUpdate = async () => {

    const { year, month, floor, category, reading } = formData;
    //Duplicate Checking
  const duplicate = energyReadings.find((entry) =>
    entry._id !== editingReading._id && 
    entry.year === parseInt(year) &&
    entry.month === month &&
    entry.floor === parseInt(floor) &&
    entry.category === category
  );

  if (duplicate) {
    toast.error('Duplicate entry detected! An entry with the same Year, Month, Floor, and Category already exists.', {
      autoClose: false,
      closeOnClick: true
    });
    return; // stop the update
  }

  const readingValue = parseFloat(reading);
  if (readingValue >= 10000) {
    toast.warning(
      "Warning: A reading of 10,000 or higher may be unusually high. Please verify.",
      { autoClose: false, closeOnClick: true }
    );
  }
  
    try {
      
      const response = await axios.put(`http://localhost:4000/api/energyReadings/update/${editingReading._id}`, {
        year, month, floor, category, reading
      });

      setEnergyReadings((prevReadings) =>
        prevReadings.map((reading) =>
          reading._id === editingReading._id ? response.data.energyReading : reading
        )
      );

      filterReadings();
      setEditingReading(null);
      setFormData({ year: '', month: '', floor: '', category: '', reading: '' });
    } catch (err) {
      setError('Error updating energy reading');
    }

    toast.success('Reading has been updated successfully!', {
      autoClose: false,
      closeOnClick: true
    });
  };

  useEffect(() => {
    filterReadings();
  }, [filters, energyReadings]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="hvac_energy-consumption-container">
      <h1 className="hvac_energy-title">HVAC Energy Consumption Details</h1>

      {filteredReadings.length === 0 && !loading && !error && (
        <div className="hvac_energy-no-data-message">
          No energy readings found for the HVAC category.
        </div>
      )}

      <div className="hvac_energy-filters">
        <label>
          Year:
          <select name="year" value={filters.year} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from({ length: 27 }, (_, index) => 2024 + index).map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </label>

        <label>
          Month:
          <select name="month" value={filters.month} onChange={handleFilterChange}>
            <option value="">All</option>
            {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </label>

        <label>
          Floor:
          <select name="floor" value={filters.floor} onChange={handleFilterChange}>
            <option value="">All</option>
            {Array.from({ length: 7 }, (_, index) => index + 1).map((floor) => (
              <option key={floor} value={floor}>
                {floor}
              </option>
            ))}
          </select>
        </label>

        <label>
          Status:
          <select name="status" value={filters.status} onChange={handleFilterChange}>
            <option value="">All</option>
            <option value="Exceeded">Exceeded</option>
            <option value="Normal">Normal</option>
          </select>
        </label>
      </div>

      <table className="hvac_energy-table">
        <thead>
          <tr className="hvac_energy-header-row">
            <th>Year</th>
            <th>Month</th>
            <th>Floor</th>
            <th>Category</th>
            <th>Reading</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredReadings.map((reading) => (
            <tr key={reading._id}>
              <td>{reading.year}</td>
              <td>{reading.month}</td>
              <td>{reading.floor}</td>
              <td>{reading.category}</td>
              <td>{reading.reading}</td>
              <td>
                {reading.isExceeded ? (
                  <span className="hvac_energy-exceeded">Exceeded</span>
                ) : (
                  <span className="hvac_energy-normal">Normal</span>
                )}
              </td>
              <td>
                <button 
                  className="hvac_energy-edit-button" 
                  onClick={() => {
                    setEditingReading(reading);
                    setFormData({
                      year: reading.year,
                      month: reading.month,
                      floor: reading.floor,
                      category: reading.category,
                      reading: reading.reading
                    });
                  }}
                >
                  Edit
                </button>
                <button 
                  className="hvac_energy-delete-button" 
                  onClick={() => handleDelete(reading._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingReading && (
        <div className="hvac_energy-modal-backdrop">
          <div className="hvac_energy-modal">
            <h2>Edit Energy Reading</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <label>Year:</label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              >
                {Array.from({ length: 27 }, (_, index) => 2024 + index).map((year) => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              <label>Month:</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              >
                {['January', 'February', 'March', 'April', 'May', 'June', 'July',
                  'August', 'September', 'October', 'November', 'December'].map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>

              <label>Floor:</label>
              <select
                value={formData.floor}
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              >
                {Array.from({ length: 7 }, (_, index) => index + 1).map((floor) => (
                  <option key={floor} value={floor}>{floor}</option>
                ))}
              </select>

              <label>Category:</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="HVAC">HVAC</option>
                <option value="Lighting">Lighting</option>
                <option value="Renewable">Renewable</option>
              </select>

              <label>Reading (kWh):</label>
              <input
                type="number"
                value={formData.reading}
                onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
              />

              <div className="hvac_energy-button-container">
                <button className="hvac_energy-button" type="submit">Update</button>
                <button className="hvac_energy-button cancel" onClick={() => setEditingReading(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewHVACEnergyConsumptionDetails;