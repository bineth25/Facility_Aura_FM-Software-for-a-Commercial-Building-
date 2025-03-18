import React, { useState, useEffect } from "react";
import axios from "axios";
import './Tenant_History.css';

const API_URL = "http://localhost:4000/api/spaces"; // Update based on backend

const SpaceManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [formData, setFormData] = useState({
    floorId: "",
    spaceId: "",
    area: "",
    spaceType: "",
    description: "",
    isAvailable: true,
  });
  const [editingSpaceId, setEditingSpaceId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [analysis, setAnalysis] = useState([]);

  // Fetch all spaces
  useEffect(() => {
    fetchSpaces();
    fetchSpaceAnalysis();
  }, []);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(API_URL);
      setSpaces(response.data);
    } catch (error) {
      console.error("Error fetching spaces:", error);
    }
  };

  const fetchSpaceAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching space analysis:", error);
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingSpaceId) {
        await axios.put(`${API_URL}/${editingSpaceId}`, formData);
      } else {
        await axios.post(API_URL, formData);
      }
      fetchSpaces();
      fetchSpaceAnalysis();
      handleClose();
    } catch (error) {
      console.error("Error submitting space:", error);
    }
  };

  // Edit space
  const handleEdit = (space) => {
    setFormData(space);
    setEditingSpaceId(space._id);
    setShowModal(true);
  };

  // Delete space
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this space?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchSpaces();
        fetchSpaceAnalysis();
      } catch (error) {
        console.error("Error deleting space:", error);
      }
    }
  };

  // Close modal & reset form
  const handleClose = () => {
    setShowModal(false);
    setFormData({
      floorId: "",
      spaceId: "",
      area: "",
      spaceType: "",
      description: "",
      isAvailable: true,
    });
    setEditingSpaceId(null);
  };

  return (
    <div className="container">
      <h1>Space Management</h1>
      <button className="add-btn" onClick={() => setShowModal(true)}>+ Add Space</button>

      <table className="space-table">
        <thead>
          <tr>
            <th>Floor ID</th>
            <th>Space ID</th>
            <th>Area</th>
            <th>Type</th>
            <th>Description</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {spaces.map((space) => (
            <tr key={space._id}>
              <td>{space.floorId}</td>
              <td>{space.spaceId}</td>
              <td>{space.area}</td>
              <td>{space.spaceType}</td>
              <td>{space.description}</td>
              <td>{space.isAvailable ? "Yes" : "No"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(space)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(space._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Space Analysis</h2>
      <table className="analysis-table">
        <thead>
          <tr>
            <th>Floor ID</th>
            <th>Total Spaces</th>
            <th>Available</th>
            <th>Occupied</th>
            <th>Available %</th>
            <th>Occupied %</th>
          </tr>
        </thead>
        <tbody>
          {analysis.map((floor) => (
            <tr key={floor.floorId}>
              <td>{floor.floorId}</td>
              <td>{floor.totalSpaces}</td>
              <td>{floor.availableSpaces}</td>
              <td>{floor.occupiedSpaces}</td>
              <td>{floor.availablePercentage.toFixed(2)}%</td>
              <td>{floor.occupiedPercentage.toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>{editingSpaceId ? "Edit Space" : "Add Space"}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="floorId" placeholder="Floor ID" value={formData.floorId} onChange={handleChange} required />
              <input type="text" name="spaceId" placeholder="Space ID" value={formData.spaceId} onChange={handleChange} required />
              <input type="number" name="area" placeholder="Area (sq ft)" value={formData.area} onChange={handleChange} required />
              <input type="text" name="spaceType" placeholder="Space Type" value={formData.spaceType} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange}></textarea>
              <label>
                <input type="checkbox" name="isAvailable" checked={formData.isAvailable} onChange={handleChange} />
                Available
              </label>
              <button type="submit" className="save-btn">{editingSpaceId ? "Update" : "Save"}</button>
              <button type="button" className="close-btn" onClick={handleClose}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceManagement;
