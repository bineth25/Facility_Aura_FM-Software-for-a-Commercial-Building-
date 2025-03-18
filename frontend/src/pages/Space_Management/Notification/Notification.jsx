import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

const Notification = () => {
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [form, setForm] = useState({
    floorId: '',
    spaceId: '',
    area: '',
    spaceType: '',
    description: '',
    isAvailable: true,
    other: '',
  });
  const [searchId, setSearchId] = useState('');

  // Fetch all spaces
  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      console.log("Fetching spaces...");
      const response = await axios.get('http://localhost:4000/api/spaces');
      console.log("API Response:", response);

      if (response.status === 200 && Array.isArray(response.data)) {
        setSpaces(response.data);
      } else {
        console.warn("Warning: API response is not an array", response.data);
        setSpaces([]);
      }
    } catch (error) {
      console.error("Error fetching spaces:", error.response ? error.response.data : error.message);
      setSpaces([]);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Update a space
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedSpace) {
        await axios.put(`http://localhost:4000/api/spaces/${selectedSpace._id}`, form);
      } else {
        await axios.post('http://localhost:4000/api/spaces', form);
      }
      fetchSpaces();
      setSelectedSpace(null);
      setForm({
        floorId: '',
        spaceId: '',
        area: '',
        spaceType: '',
        description: '',
        isAvailable: true,
        other: '',
      });
    } catch (error) {
      console.error('Error saving space:', error);
    }
  };

  // Delete space
  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:4000/api/spaces/${id}`);
      fetchSpaces();
    } catch (error) {
      console.error('Error deleting space:', error);
    }
  };

  // Find space by ID
  const handleFindById = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/spaces/${searchId}`);
      setSelectedSpace(response.data);
    } catch (error) {
      console.error('Error finding space:', error);
    }
  };

  return (
    <div className="dashboard-content">
      <h2 className="title">Space Management</h2>

      {/* Floor Selector */}
      <div className="search-section">
        <input
          type="text"
          placeholder="Enter Space ID"
          value={searchId}
          onChange={(e) => setSearchId(e.target.value)}
        />
        <button onClick={handleFindById}>Search</button>
      </div>

      {/* Form Section */}
      <div className="form-section">
        <h3>{selectedSpace ? "Edit Space" : "Add New Space"}</h3>
        <form onSubmit={handleSubmit}>
          <input type="text" name="floorId" placeholder="Floor ID" value={form.floorId} onChange={handleChange} required />
          <input type="text" name="spaceId" placeholder="Space ID" value={form.spaceId} onChange={handleChange} required />
          <input type="number" name="area" placeholder="Area (sq ft)" value={form.area} onChange={handleChange} required />
          <input type="text" name="spaceType" placeholder="Space Type" value={form.spaceType} onChange={handleChange} required />
          <input type="text" name="description" placeholder="Description" value={form.description} onChange={handleChange} required />
          <input type="text" name="other" placeholder="Other Info" value={form.other} onChange={handleChange} />
          <button type="submit">{selectedSpace ? "Update Space" : "Add Space"}</button>
        </form>
      </div>

      {/* Space List Section */}
      <div className="list-section">
        <h3>All Spaces</h3>
        {Array.isArray(spaces) && spaces.length > 0 ? (
          <ul>
            {spaces.map((space) => (
              <li key={space._id} onClick={() => setSelectedSpace(space)}>
                <strong>Floor:</strong> {space.floorId} | <strong>Type:</strong> {space.spaceType} | <strong>Area:</strong> {space.area} sq ft
                <button onClick={() => setSelectedSpace(space)}>Edit</button>
                <button onClick={() => handleDelete(space._id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No spaces found.</p>
        )}
      </div>

      {/* Space Details Section */}
      {selectedSpace && (
        <div className="details-section">
          <h3>Selected Space Details</h3>
          <p><strong>Floor ID:</strong> {selectedSpace.floorId}</p>
          <p><strong>Space Type:</strong> {selectedSpace.spaceType}</p>
          <p><strong>Area:</strong> {selectedSpace.area} sq ft</p>
          <p><strong>Description:</strong> {selectedSpace.description}</p>
        </div>
      )}
    </div>
  );
};

export default Notification;
