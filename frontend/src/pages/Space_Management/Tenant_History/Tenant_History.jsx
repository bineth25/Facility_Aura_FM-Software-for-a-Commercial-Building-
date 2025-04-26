import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tenant_History.css';

const Tenant = () => {
  const [tenants, setTenants] = useState([]);
  const [selectedTenant, setSelectedTenant] = useState(null);
  const [tenantData, setTenantData] = useState({
    Tenant_ID: '',
    name: '',
    nic: '',
    email: '',
    phone: '',
    address: '',
    description: '',
    leaseStartDate: '',
    leaseEndDate: ''
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateField = (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'Tenant_ID':
        if (!/^[A-Za-z0-9]+$/.test(value)) {
          newErrors.Tenant_ID = 'ID must be alphanumeric';
        } else {
          delete newErrors.Tenant_ID;
        }
        break;
      case 'name':
        if (!/^[A-Za-z\s]+$/.test(value)) {
          newErrors.name = 'Name must contain only letters';
        } else {
          delete newErrors.name;
        }
        break;
      case 'nic':
        if (!/^[A-Za-z0-9]+$/.test(value)) {
          newErrors.nic = 'NIC must be alphanumeric';
        } else if (value.length > 12) {
          newErrors.nic = 'NIC cannot exceed 12 characters';
        } else {
          delete newErrors.nic;
        }
        break;
      case 'email':
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Email is invalid (e.g., example@domain.com)';
        } else if (value.length > 254) {
          newErrors.email = 'Email cannot exceed 254 characters';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        const trimmedValue = value.trim();
        if (!/^\d{10}$/.test(trimmedValue)) {
          newErrors.phone = 'Phone number must be exactly 10 digits and contain only numbers';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'leaseStartDate':
      case 'leaseEndDate':
        const today = new Date().toISOString().split('T')[0];
        if (value < today) {
          newErrors[name] = 'Date cannot be before today';
        } else {
          delete newErrors[name];
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

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
      leaseStartDate: tenant.leaseStartDate,
      leaseEndDate: tenant.leaseEndDate
    });
    setIsModalOpen(true);
  };

  const handleUpdateTenant = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      try {
        await axios.post('http://localhost:4000/api/tenants/updateTenantInfo', {
          tenantId: tenantData.Tenant_ID,
          tenantData: tenantData
        });
        alert('Tenant information updated successfully!');
        setIsModalOpen(false);
        setSelectedTenant(null);
        setTenantData({
          Tenant_ID: '',
          name: '',
          nic: '',
          email: '',
          phone: '',
          address: '',
          description: '',
          leaseStartDate: '',
          leaseEndDate: ''
        });
        const response = await axios.get('http://localhost:4000/api/tenants');
        setTenants(response.data);
      } catch (error) {
        console.error('Error updating tenant information:', error);
        alert('Error updating tenant information');
      }
    } else {
      alert('Please fix the errors before submitting.');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    try {
      await axios.delete(`http://localhost:4000/api/tenants/${tenantId}`);
      confirm('Tenant deleted successfully!');
      const response = await axios.get('http://localhost:4000/api/tenants');
      setTenants(response.data);
    } catch (error) {
      console.error('Error deleting tenant:', error);
      alert('Error deleting tenant');
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTenant(null);
    setTenantData({
      Tenant_ID: '',
      name: '',
      nic: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      leaseStartDate: '',
      leaseEndDate: ''
    });
    setErrors({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
    validateField(name, value);
  };

  return (
    <div className="tenant-containers">
      <h1>All Tenant Details</h1>

      <div className="tenant-list">
        
        <ul>
          {tenants.map((tenant) => (
            <li key={tenant._id} className="tenant-item">
              <div>
                <h3>{tenant.name}</h3>
                <p><strong>Tenant ID:</strong> {tenant.Tenant_ID}</p>
                <p><strong>Space ID:</strong> {tenant.spaceId}</p>
                <p><strong>NIC:</strong> {tenant.nic}</p>
                <p><strong>Email:</strong> {tenant.email}</p>
                <p><strong>Phone:</strong> {tenant.phone}</p>
                <p><strong>Address:</strong> {tenant.address}</p>
                <p><strong>Other Details:</strong> {tenant.description}</p>
                <p><strong>Lease Start Date:</strong> {tenant.leaseStartDate}</p>
                <p><strong>Lease End Date:</strong> {tenant.leaseEndDate}</p>
                
              </div>
              <div className="tenant-actions">
                <button onClick={() => handleTenantSelect(tenant)}>Edit</button>
                <button onClick={() => handleDeleteTenant(tenant.Tenant_ID)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Update Tenant Information</h2>
            <form onSubmit={handleUpdateTenant}>
              <label>
                Tenant ID:
                <input
                  type="text"
                  name="Tenant_ID"
                  value={tenantData.Tenant_ID}
                  readOnly
                />
              </label>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  value={tenantData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <span className="error">{errors.name}</span>}
              </label>
              <label>
                NIC:
                <input
                  type="text"
                  name="nic"
                  value={tenantData.nic}
                  onChange={handleInputChange}
                />
                {errors.nic && <span className="error">{errors.nic}</span>}
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={tenantData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={tenantData.phone}
                  onChange={handleInputChange}
                />
                {errors.phone && <span className="error">{errors.phone}</span>}
              </label>
              <label>
                Address:
                <input
                  type="text"
                  name="address"
                  value={tenantData.address}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Description:
                <input
                  type="text"
                  name="description"
                  value={tenantData.description}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Lease Start Date:
                <input
                  type="date"
                  name="leaseStartDate"
                  value={tenantData.leaseStartDate}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                />
                {errors.leaseStartDate && <span className="error">{errors.leaseStartDate}</span>}
              </label>
              <label>
                Lease End Date:
                <input
                  type="date"
                  name="leaseEndDate"
                  value={tenantData.leaseEndDate}
                  onChange={handleInputChange}
                  min={tenantData.leaseStartDate || new Date().toISOString().split('T')[0]}
                />
                {errors.leaseEndDate && <span className="error">{errors.leaseEndDate}</span>}
              </label>
              <button type="submit">Update Tenant Details</button>
              <button type="button" onClick={closeModal}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tenant;