import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tenant_History.css';

const Tenant_History = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    other: ''
  });

  useEffect(() => {
    fetchTenants();
  }, []);

  const fetchTenants = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  const handleViewDetails = (tenant) => {
    setSelectedTenant(tenant);
    setUpdatedData({
      name: tenant.name,
      nic: tenant.nic,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      description: tenant.description,
      other: tenant.other
    });
  };

  const handleUpdateTenant = async () => {
    if (!selectedTenant) return;

    try {
      const response = await axios.put('http://localhost:4000/api/tenants/updateTenantInfo', {
        tenantId: selectedTenant.Tenant_ID,
        updatedData
      });
      alert(response.data.message);
      fetchTenants();
      setSelectedTenant(null); // Clear selected tenant after update
    } catch (error) {
      console.error('Error updating tenant:', error);
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/tenants/delete/${tenantId}`);
      alert(response.data.message);
      fetchTenants();
    } catch (error) {
      console.error('Error deleting tenant:', error);
    }
  };

  return (
    <div className="tenant-history">
      <h1>Tenant Management</h1>

      <div className="tenants-list">
        <h2>Tenants List</h2>
        <ul>
          {tenants.map((tenant) => (
            <li key={tenant.Tenant_ID}>
              <p>ID: {tenant.Tenant_ID}</p>
              <p>Name: {tenant.name}</p>
              <button onClick={() => handleViewDetails(tenant)}>View Details</button>
              <button onClick={() => handleDeleteTenant(tenant.Tenant_ID)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedTenant && (
        <div className="tenant-details">
          <h2>Tenant Details</h2>
          <p>ID: {selectedTenant.Tenant_ID}</p>
          <input
            type="text"
            placeholder="Name"
            value={updatedData.name}
            onChange={(e) => setUpdatedData({ ...updatedData, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="NIC"
            value={updatedData.nic}
            onChange={(e) => setUpdatedData({ ...updatedData, nic: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={updatedData.email}
            onChange={(e) => setUpdatedData({ ...updatedData, email: e.target.value })}
          />
          <input
            type="text"
            placeholder="Phone"
            value={updatedData.phone}
            onChange={(e) => setUpdatedData({ ...updatedData, phone: e.target.value })}
          />
          <input
            type="text"
            placeholder="Address"
            value={updatedData.address}
            onChange={(e) => setUpdatedData({ ...updatedData, address: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description"
            value={updatedData.description}
            onChange={(e) => setUpdatedData({ ...updatedData, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="Other"
            value={updatedData.other}
            onChange={(e) => setUpdatedData({ ...updatedData, other: e.target.value })}
          />
          <button onClick={handleUpdateTenant}>Update Tenant</button>
          <button onClick={() => setSelectedTenant(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Tenant_History;