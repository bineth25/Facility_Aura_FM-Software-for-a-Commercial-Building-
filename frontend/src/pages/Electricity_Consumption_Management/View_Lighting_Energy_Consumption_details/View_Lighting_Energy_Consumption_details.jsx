import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './View_Lighting_Energy_Consumption_details.css';

const ViewLightingEnergyConsumptionDetails = () => {
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

  // Edit state for modal form
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
          params: { category: 'Lighting' } // Filter by Lighting category
        });

        if (response.data.length === 0) {
          setFilteredReadings([]);  // Set empty if no data found
        } else {
          setEnergyReadings(response.data);
          setFilteredReadings(response.data); // Initially display all data
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
      // After deletion, remove the reading from the UI
      setFilteredReadings(filteredReadings.filter((reading) => reading._id !== id));

      // If all readings are deleted, set filteredReadings to an empty array
      if (filteredReadings.length === 1) {
        setFilteredReadings([]);
      }
    } catch (err) {
      setError('Error deleting energy reading');
    }
  };

  const handleUpdate = async () => {
    try {
      const { year, month, floor, category, reading } = formData;
      const response = await axios.put(`http://localhost:4000/api/energyReadings/update/${editingReading._id}`, {
        year, month, floor, category, reading
      });
      // Update the readings in the state after successful update
      setEnergyReadings((prevReadings) => 
        prevReadings.map((reading) => 
          reading._id === editingReading._id ? response.data.energyReading : reading
        )
      );
      // Re-filter the readings after update to ensure filteredReadings reflects the changes
      filterReadings();
      setEditingReading(null); // Close modal after update
      setFormData({ year: '', month: '', floor: '', category: '', reading: '' });
    } catch (err) {
      setError('Error updating energy reading');
    }
  };

  useEffect(() => {
    filterReadings();
  }, [filters, energyReadings]); // Filter every time energyReadings or filters change

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="energy-consumption-container">
      <h1>Lighting Energy Consumption Details</h1>

      {/* Display friendly message when no readings are found */}
      {filteredReadings.length === 0 && !loading && !error && (
        <div className="no-data-message">
          No energy readings found for the HVAC category.
        </div>
      )}

      {/* Filter Section */}
      <div className="filters">
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

      {/* Table Section */}
      <table className="energy-table">
        <thead>
          <tr>
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
                  <span className="exceeded">Exceeded</span>
                ) : (
                  <span className="normal">Normal</span>
                )}
              </td>
              <td>
                <button onClick={() => { 
                  setEditingReading(reading); 
                  setFormData({
                    year: reading.year,
                    month: reading.month,
                    floor: reading.floor,
                    category: reading.category,
                    reading: reading.reading
                  });
                }}>Edit</button>
                <button onClick={() => handleDelete(reading._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for Updating Energy Reading */}
      {editingReading && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Edit Energy Reading</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleUpdate(); }}>
              <label>Year:</label>
              <input 
                type="number" 
                value={formData.year} 
                onChange={(e) => setFormData({ ...formData, year: e.target.value })}
              />

              <label>Month:</label>
              <input 
                type="text" 
                value={formData.month} 
                onChange={(e) => setFormData({ ...formData, month: e.target.value })}
              />

              <label>Floor:</label>
              <input 
                type="number" 
                value={formData.floor} 
                onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
              />

              <label>Category:</label>
              <input 
                type="text" 
                value={formData.category} 
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />

              <label>Reading:</label>
              <input 
                type="number" 
                value={formData.reading} 
                onChange={(e) => setFormData({ ...formData, reading: e.target.value })}
              />

              <button type="submit">Update</button>
              <button onClick={() => setEditingReading(null)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewLightingEnergyConsumptionDetails;
