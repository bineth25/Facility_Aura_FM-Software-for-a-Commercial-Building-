import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import './More_ Space _Details.css';

const API_URL = "http://localhost:4000/api/spaces"; 

const SpaceManagement = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]); 
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
  const [errors, setErrors] = useState({});
  const [selectedFloorId, setSelectedFloorId] = useState(""); 

  // Space types for the dropdown menu
  const spaceTypes = ["Office", "Meeting Room", "Shops", "Storage", "Other"];

  // Fetch all spaces
  useEffect(() => {
    fetchSpaces();
    fetchSpaceAnalysis();
  }, []);

  // Update filtered spaces when spaces or selectedFloorId changes
  useEffect(() => {
    if (selectedFloorId) {
      const filtered = spaces.filter((space) => space.floorId === selectedFloorId);
      setFilteredSpaces(filtered);
    } else {
      setFilteredSpaces(spaces); 
    }
  }, [selectedFloorId, spaces]);

  const fetchSpaces = async () => {
    try {
      const response = await axios.get(API_URL);
      setSpaces(response.data);
      setFilteredSpaces(response.data); 
    } catch (error) {
      console.error("Error fetching spaces:", error);
      Swal.fire('Error', 'Failed to fetch spaces!', 'error');
    }
  };

  const fetchSpaceAnalysis = async () => {
    try {
      const response = await axios.get(`${API_URL}/analysis`);
      setAnalysis(response.data);
    } catch (error) {
      console.error("Error fetching space analysis:", error);
      Swal.fire('Error', 'Failed to fetch space analysis!', 'error');
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

  // Validate form data
  const validateForm = () => {
    const newErrors = {};

    if (!formData.floorId) newErrors.floorId = "Floor ID is required";
    if (!formData.spaceId) newErrors.spaceId = "Space ID is required";
    if (!formData.area || formData.area <= 0) newErrors.area = "Area must be a positive number";
    if (!formData.spaceType) newErrors.spaceType = "Space type is required";

    // Check if spaceId already exists (only when adding a new space, not editing)
    if (!editingSpaceId && spaces.some(space => space.spaceId === formData.spaceId)) {
      newErrors.spaceId = "Space ID already exists";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submit (Add / Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editingSpaceId) {
        await axios.put(`${API_URL}/${editingSpaceId}`, formData);
        Swal.fire('Success', 'Space updated successfully!', 'success');
      } else {
        await axios.post(API_URL, formData);
        Swal.fire('Success', 'Space added successfully!', 'success');
      }
      fetchSpaces();
      fetchSpaceAnalysis();
      handleClose();
    } catch (error) {
      console.error("Error submitting space:", error);
      Swal.fire('Error', 'Failed to submit space!', 'error');
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
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You want to delete this space?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        Swal.fire('Deleted!', 'Space deleted successfully.', 'success');
        fetchSpaces();
        fetchSpaceAnalysis();
      } catch (error) {
        console.error("Error deleting space:", error);
        Swal.fire('Error', 'Failed to delete space!', 'error');
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
    setErrors({});
  };

  // Handle floor filter change
  const handleFloorFilterChange = (e) => {
    setSelectedFloorId(e.target.value);
  };

  // Generate report for space analysis
  // Download as PDF
  const generateReportPDF = () => {
    try {
      const doc = new jsPDF();
      doc.text("Space Analysis Report", 20, 20);
  
      const tableData = analysis.map((floor) => [
        floor.floorId,
        floor.totalSpaces,
        floor.availableSpaces,
        floor.occupiedSpaces,
        floor.availablePercentage.toFixed(2) + "%",
        floor.occupiedPercentage.toFixed(2) + "%"
      ]);
  
      autoTable(doc, {  // 👈 Call autoTable(doc, {...})
        head: [["Floor ID", "Total Spaces", "Available", "Occupied", "Available %", "Occupied %"]],
        body: tableData,
      });
  
      doc.save("space_analysis_report.pdf");
      Swal.fire('Report Generated', 'Space analysis PDF downloaded.', 'success');
    } catch (error) {
      console.error("Error generating PDF:", error);
      Swal.fire('Error', 'Failed to generate PDF.', 'error');
    }
  };
  
  
// Download as SVG
const generateReportSVG = () => {
  try {
    const svgContent = `
      <svg xmlns="http://www.w3.org/2000/svg" width="800" height="600">
        <style>
          text { font-family: Arial, sans-serif; font-size: 16px; }
        </style>
        <text x="20" y="40">Space Analysis Report</text>
        ${analysis.map((floor, index) => `
          <text x="20" y="${80 + index * 30}">
            Floor: ${floor.floorId} | Total: ${floor.totalSpaces} | Available: ${floor.availableSpaces} | Occupied: ${floor.occupiedSpaces} | Avl%: ${floor.availablePercentage.toFixed(2)} | Occ%: ${floor.occupiedPercentage.toFixed(2)}
          </text>
        `).join('')}
      </svg>
    `;

    const blob = new Blob([svgContent], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "space_analysis_report.svg");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    Swal.fire('Report Generated', 'Space analysis SVG downloaded.', 'success');
  } catch (error) {
    console.error("Error generating SVG:", error);
    Swal.fire('Error', 'Failed to generate SVG.', 'error');
  }
};



  // Get unique floor IDs for the filter dropdown
  const uniqueFloorIds = [...new Set(spaces.map((space) => space.floorId))];

  

  return (
    <div className="containers">
      <h1>Space Management</h1>
      <button className="add-btn" onClick={() => setShowModal(true)}>
        + Add New Space
      </button>

      {/* Filter by Floor ID */}
      <div className="filter-section">
        <label htmlFor="floorFilter">Filter by Floor: </label>
        <select
          id="floorFilter"
          value={selectedFloorId}
          onChange={handleFloorFilterChange}
        >
          <option value="">All Floors</option>
          {uniqueFloorIds.map((floorId) => (
            <option key={floorId} value={floorId}>
              {floorId}
            </option>
          ))}
        </select>
      </div>

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
          {filteredSpaces.map((space) => (
            <tr key={space._id}>
              <td>{space.floorId}</td>
              <td>{space.spaceId}</td>
              <td>{space.area} sq ft</td>
              <td>{space.spaceType}</td>
              <td>{space.description}</td>
              <td>{space.isAvailable ? "Yes" : "No"}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(space)}>
                  Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(space._id)}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h1>Space Analysis</h1>
      <div className="report-options">
  <button className="report-btnss" onClick={generateReportPDF}>
    Download PDF
  </button>
  <button className="report-btnss" onClick={generateReportSVG}>
    Download SVG
  </button>
</div>
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
        <div className="modals">
          <div className="modal-contents">
            <h2>{editingSpaceId ? "Edit Space" : "Add Space"}</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="floorId"
                placeholder="Floor ID"
                value={formData.floorId}
                onChange={handleChange}
                required
                disabled={editingSpaceId !== null} // Disable floorId when editing
              />
              {errors.floorId && <span className="error">{errors.floorId}</span>}

              <input
                type="text"
                name="spaceId"
                placeholder="Space ID"
                value={formData.spaceId}
                onChange={handleChange}
                required
                disabled={editingSpaceId !== null} // Disable spaceId when editing
              />
              {errors.spaceId && <span className="error">{errors.spaceId}</span>}

              <input
                type="number"
                name="area"
                placeholder="Area (sq ft)"
                value={formData.area}
                onChange={handleChange}
                required
              />
              {errors.area && <span className="error">{errors.area}</span>}

              <select
                name="spaceType"
                value={formData.spaceType}
                onChange={handleChange}
                required
              >
                <option value="">Select Space Type</option>
                {spaceTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {errors.spaceType && <span className="error">{errors.spaceType}</span>}
              <textarea
                name="description"
                placeholder="Space Description"
                value={formData.description}
                onChange={handleChange}
              ></textarea>

              <label>Available
                <input
                
                  type="checkbox"
                  name="isAvailable"
                  checked={formData.isAvailable}
                  onChange={handleChange}
                />
             
              </label>

              <button type="submit" className="save-btn">
                {editingSpaceId ? "Update" : "Add"}
              </button>
              <button type="button" className="close-bt" onClick={handleClose}>
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SpaceManagement;