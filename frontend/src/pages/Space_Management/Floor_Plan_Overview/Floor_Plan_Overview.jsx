import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Floor_Plan_Overview.css";

const Floor_Plan_Overview = () => {
  const [floors, setFloors] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);

  // Fetch Floors
  useEffect(() => {
    axios.get("http://localhost:4000/api/floors")
      .then(response => {
        setFloors(response.data);
        if (response.data.length > 0) {
          setSelectedFloor(response.data[0]._id);
        }
      })
      .catch(error => console.error("Error fetching floors:", error));
  }, []);

  // Fetch Spaces when Floor is Selected
  useEffect(() => {
    if (selectedFloor) {
      axios.get(`http://localhost:4000/api/spaces/${selectedFloor}`)
        .then(response => {
          setSpaces(response.data);
        })
        .catch(error => console.error("Error fetching spaces:", error));
    }
  }, [selectedFloor]);

  return (
    <div className="dashboard-content">
      <h2 className="title">Facilities Management</h2>

      {/* Floor Selector */}
      <div className="floor-selector">
        <label>Select Floor: </label>
        <select onChange={(e) => setSelectedFloor(e.target.value)}>
          {floors.map(floor => (
            <option key={floor._id} value={floor._id}>{floor.name}</option>
          ))}
        </select>
      </div>

      {/* Layout for Floor Plan & Tenant Info */}
      <div className="main-container">
        {/* Floor Plan Section */}
        <div className="floor-plan-box">
          <div className="floor-map">
            {spaces.length > 0 ? (
              spaces.map(space => (
                <div
                  key={space._id}
                  className="space"
                  style={{
                    left: `${space.position.x}px`,
                    top: `${space.position.y}px`,
                    width: `${space.position.width}px`,
                    height: `${space.position.height}px`
                  }}
                  onClick={() => setSelectedSpace(space)}
                >
                  {space.name}
                </div>
              ))
            ) : (
              <p className="no-space-message">
                No spaces found for this floor.
              </p>
            )}
          </div>
        </div>

        {/* Tenant Information */}
        <div className="tenant-info-box">
          <h3 className="tenant-title">Allocating Tenants Information</h3>
          <div className="tenant-image-box"></div>
          {selectedSpace ? (
            <>
              <p><strong>Tenant ID:</strong> {selectedSpace.tenantId}</p>
              <p><strong>Tenant Name:</strong> {selectedSpace.tenantName}</p>
              <p><strong>NIC:</strong> {selectedSpace.nic}</p>
              <p><strong>Email:</strong> {selectedSpace.email}</p>
              <p><strong>Contact No:</strong> {selectedSpace.contact}</p>
              <p><strong>Lease Duration:</strong> {selectedSpace.leaseDuration}</p>
            </>
          ) : (
            <p className="click-space-message">Click a space to view tenant details.</p>
          )}
        </div>
      </div>

      {/* Space Details Section */}
      <div className="space-details-box">
        <div className="space-box"></div>
        {selectedSpace ? (
          <>
            <p><strong>Space ID:</strong> {selectedSpace._id}</p>
            <p><strong>Floor:</strong> {selectedFloor}</p>
            <p><strong>Area:</strong> {selectedSpace.position.width * selectedSpace.position.height} sq ft</p>
            <p><strong>Width:</strong> {selectedSpace.position.width}px</p>
            <p><strong>Height:</strong> {selectedSpace.position.height}px</p>
            <p><strong>Allocation Tenant ID:</strong> {selectedSpace.tenantId}</p>
            <p><strong>Lease Duration:</strong> {selectedSpace.leaseDuration}</p>
          </>
        ) : (
          <p className="click-space-message">Click a space to view details.</p>
        )}
      </div>
    </div>
  );
};

export default Floor_Plan_Overview;
