import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Floor_Plan_Overview.css';

const Floor_Plan_Overview = () => {
  const [spaces, setSpaces] = useState([]); // All spaces
  const [filteredSpaces, setFilteredSpaces] = useState([]); // Spaces after filtering by selected floor
  const [selectedFloor, setSelectedFloor] = useState(''); // Selected floor
  const [selectedSpace, setSelectedSpace] = useState(null); // Selected space for tenant allocation
  const [tenantData, setTenantData] = useState({
    Tenant_ID: '',
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    description: ''
  });

  // Fetch all spaces from backend
  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/spaces');
        setSpaces(response.data);  // Set all spaces
        setFilteredSpaces(response.data); // Initially show all spaces
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };

    fetchSpaces();
  }, []);

  // Handle floor selection and filter spaces based on selected floor
  const handleFloorSelect = (event) => {
    const selected = event.target.value;
    setSelectedFloor(selected);

    if (selected === '') {
      // If no floor is selected, show all spaces
      setFilteredSpaces(spaces);
    } else {
      // Filter spaces based on selected floor
      const filtered = spaces.filter((space) => space.floorId === selected);
      setFilteredSpaces(filtered);
    }
  };

  // Handle selecting a space
  const handleSpaceSelect = (space) => {
    setSelectedSpace(space);

    if (space.isAvailable === false && space.tenant) {
      // If the space is occupied, display tenant info
      setTenantData({
        Tenant_ID: space.tenant.Tenant_ID,
        name: space.tenant.name,
        nic: space.tenant.nic,
        email: space.tenant.email,
        phone: space.tenant.phone,
        address: space.tenant.address,
        description: space.tenant.description
      });
    } else {
      // If the space is available, reset tenant data
      setTenantData({
        Tenant_ID: '',
        name: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        description: ''
      });
    }
  };

  // Add tenant to space
  const handleAddTenant = async () => {
    try {
      await axios.post('http://localhost:4000/api/tenants/addTenantToSpace', {
        spaceId: selectedSpace.spaceId,
        tenantData: tenantData
      });
      alert('Tenant added successfully!');
      setSelectedSpace(null);
      setTenantData({
        Tenant_ID: '',
        name: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        description: ''
      });
    } catch (error) {
      console.error('Error adding tenant:', error);
      alert('Error adding tenant');
    }
  };

  // Remove tenant from space
  // Remove tenant from space
const handleRemoveTenant = async () => {
  // Check if the space is available (tenant can only be removed from an occupied space)
  if (selectedSpace.isAvailable) {
    alert('Cannot remove tenant. Space is not occupied.');
    return;
  }

  // Ensure tenant exists before trying to access Tenant_ID
  if (!selectedSpace.tenant || !selectedSpace.tenant.Tenant_ID) {
    alert('No tenant assigned to this space.');
    return;
  }

  try {
    // Send the request to the backend to remove the tenant from the space
    await axios.post('http://localhost:4000/api/tenants/removeTenantFromSpace', {
      spaceId: selectedSpace.spaceId,
      tenantId: selectedSpace.tenant.Tenant_ID // Ensure we are sending the correct tenantId
    });
    alert('Tenant removed successfully!');
    setSelectedSpace(null); // Reset selected space after removal
  } catch (error) {
    console.error('Error removing tenant:', error);
    alert('Error removing tenant');
  }
};


  return (
    <div className="floor-plan-overview">
      <h1>Floor Plan Overview</h1>

      {/* Floor selection dropdown */}
      <div className="floor-selection">
        <label htmlFor="floor">Select Floor:</label>
        <select id="floor" value={selectedFloor} onChange={handleFloorSelect}>
          <option value="">All Floors</option>
          {/* Dynamically populate floor options from spaces */}
          {spaces
            .map((space) => space.floorId) // Extract unique floorIds
            .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
            .map((floorId) => (
              <option key={floorId} value={floorId}>
                Floor {floorId}
              </option>
            ))}
        </select>
      </div>

      {/* Space list based on selected floor */}
      <div className="space-list">
        <h2>Available Spaces</h2>
        <ul>
          {filteredSpaces.map((space) => (
            <li
              key={space._id}
              className={`space-item ${space.isAvailable ? 'available' : 'occupied'}`}
              onClick={() => handleSpaceSelect(space)}
            >
              <h3>{space.spaceId}</h3>
              <p>{space.description}</p>
              <p>Status: {space.isAvailable ? 'Available' : 'Occupied'}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Tenant details section */}
      {selectedSpace && (
        <div className="tenant-details">
          <h2>Tenant Details</h2>
          {selectedSpace.isAvailable ? (
            <>
              <h3>Add Tenant to Space {selectedSpace.spaceId}</h3>
              <form onSubmit={(e) => { e.preventDefault(); handleAddTenant(); }}>
                <label>
                  Tenant ID:
                  <input
                    type="text"
                    value={tenantData.Tenant_ID}
                    onChange={(e) => setTenantData({ ...tenantData, Tenant_ID: e.target.value })}
                  />
                </label>
                <label>
                  Name:
                  <input
                    type="text"
                    value={tenantData.name}
                    onChange={(e) => setTenantData({ ...tenantData, name: e.target.value })}
                  />
                </label>
                <label>
                  NIC:
                  <input
                    type="text"
                    value={tenantData.nic}
                    onChange={(e) => setTenantData({ ...tenantData, nic: e.target.value })}
                  />
                </label>
                <label>
                  Email:
                  <input
                    type="email"
                    value={tenantData.email}
                    onChange={(e) => setTenantData({ ...tenantData, email: e.target.value })}
                  />
                </label>
                <label>
                  Phone:
                  <input
                    type="text"
                    value={tenantData.phone}
                    onChange={(e) => setTenantData({ ...tenantData, phone: e.target.value })}
                  />
                </label>
                <label>
                  Address:
                  <input
                    type="text"
                    value={tenantData.address}
                    onChange={(e) => setTenantData({ ...tenantData, address: e.target.value })}
                  />
                </label>
                <label>
                  Description:
                  <input
                    type="text"
                    value={tenantData.description}
                    onChange={(e) => setTenantData({ ...tenantData, description: e.target.value })}
                  />
                </label>
                <button type="submit">Add Tenant</button>
              </form>
            </>
          ) : (
            <>
              <h3>Tenant Info</h3>
              <p>Name: {selectedSpace.tenant?.name}</p>
              <p>Email: {selectedSpace.tenant?.email}</p>
              <button onClick={handleRemoveTenant}>Remove Tenant</button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Floor_Plan_Overview;
