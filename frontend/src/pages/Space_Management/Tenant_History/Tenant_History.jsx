import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tenant_History.css';

const Tenant = () => {
  const [tenants, setTenants] = useState([]); // All tenants
  const [selectedTenant, setSelectedTenant] = useState(null); // Selected tenant for update
  const [tenantData, setTenantData] = useState({
    Tenant_ID: '',
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    other: ''
  });

  // Fetch all tenants from the backend
  useEffect(() => {
    const fetchTenants = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Error fetching tenants:', error);
      }
    };

    fetchTenants();
  }, []);

  // Handle selecting a tenant for update
  const handleTenantSelect = (tenant) => {
    setSelectedTenant(tenant);
    setTenantData({
      Tenant_ID: tenant.Tenant_ID,
      name: tenant.name,
      nic: tenant.nic,
      email: tenant.email,
      phone: tenant.phone,
      address: tenant.address,
      description: tenant.description,
      other: tenant.other || ''
    });
  };

  // Handle updating tenant information
  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4000/api/tenants/updateTenantInfo', {
        tenantId: tenantData.Tenant_ID,
        tenantData: tenantData
      });
      alert('Tenant information updated successfully!');
      setSelectedTenant(null);
      setTenantData({
        Tenant_ID: '',
        name: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        other: ''
      });
      // Refresh the tenant list
      const response = await axios.get('http://localhost:4000/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error updating tenant information:', error);
      alert('Error updating tenant information');
    }
  };

  // Handle deleting a tenant
  const handleDeleteTenant = async (tenantId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tenants/${tenantId}`);
      alert('Tenant deleted successfully!');
      // Refresh the tenant list
      const response = await axios.get('http://localhost:4000/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Error deleting tenant');
    }
  };

  return (
    <div className="tenant-container">
      <h1>Tenant History</h1>

      {/* Tenant List */}
      <div className="tenant-list">
        <h2>All Tenants</h2>
        <ul>
          {tenants.map((tenant) => (
            <li key={tenant._id} className="tenant-item">
              <div>
                <h3>{tenant.name}</h3>
                <p><strong>Tenant ID:</strong> {tenant.Tenant_ID}</p>
                <p><strong>NIC:</strong> {tenant.nic}</p>
                <p><strong>Email:</strong> {tenant.email}</p>
                <p><strong>Phone:</strong> {tenant.phone}</p>
                <p><strong>Address:</strong> {tenant.address}</p>
                <p><strong>Description:</strong> {tenant.description}</p>
                <p><strong>Other:</strong> {tenant.other || 'N/A'}</p>
              </div>
              <div className="tenant-actions">
                <button onClick={() => handleTenantSelect(tenant)}>Edit</button>
                <button onClick={() => handleDeleteTenant(tenant.Tenant_ID)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Tenant Update Form */}
      {selectedTenant && (
        <div className="tenant-update-form">
          <h2>Update Tenant Information</h2>
          <form onSubmit={handleUpdateTenant}>
            <label>
              Tenant ID:
              <input
                type="text"
                value={tenantData.Tenant_ID}
                readOnly
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
            <label>
              Other:
              <input
                type="text"
                value={tenantData.other}
                onChange={(e) => setTenantData({ ...tenantData, other: e.target.value })}
              />
            </label>
            <button type="submit">Update Tenant</button>
            <button type="button" onClick={() => setSelectedTenant(null)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Tenant;