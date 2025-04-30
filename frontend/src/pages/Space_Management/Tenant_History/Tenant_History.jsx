import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
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
        if (!/^[Vv0-9]+$/.test(value)) {
          newErrors.nic = 'NIC must be add "V" or "v" followed by numbers';
        } else if (value.length > 12 || value.length < 10) {
          newErrors.nic = 'NIC cannot exceed 12 characters or be less than 10 characters';
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
          newErrors.phone = 'Phone number must be exactly 10 digits and contain only numbers and no spaces';
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
    setTenantData({ ...tenant });
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
        Swal.fire('Success', 'Tenant information updated successfully!', 'success');
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
        Swal.fire('Error', 'Error updating tenant information.', 'error');
      }
    } else {
      Swal.fire('Validation Error', 'Please fix the errors before submitting.', 'warning');
    }
  };

  const handleDeleteTenant = async (tenantId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:4000/api/tenants/${tenantId}`);
          Swal.fire('Deleted!', 'Tenant has been deleted.', 'success');
          const response = await axios.get('http://localhost:4000/api/tenants');
          setTenants(response.data);
        } catch (error) {
          console.error('Error deleting tenant:', error);
          Swal.fire('Error', 'Error deleting tenant', 'error');
        }
      }
    });
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
                <p><strong>Tenant ID:</strong> &nbsp;&nbsp;{tenant.Tenant_ID}</p>
                <p><strong>Rented Space ID:</strong> &nbsp;&nbsp;{tenant.spaceId}</p>
                <p><strong>NIC:</strong> &nbsp;&nbsp;{tenant.nic}</p>
                <p><strong>Email:</strong> &nbsp;&nbsp;{tenant.email}</p>
                <p><strong>Phone:</strong> &nbsp;&nbsp;{tenant.phone}</p>
                <p><strong>Address:</strong> &nbsp;&nbsp;{tenant.address}</p>
                <p><strong>Other Lease Details:</strong> &nbsp;&nbsp;{tenant.description}</p>
                <p><strong>Lease Start Date:</strong>&nbsp;&nbsp;{new Date(tenant.leaseStartDate).toLocaleDateString()}</p>
                <p><strong>Lease End Date:</strong> &nbsp;&nbsp;{new Date(tenant.leaseEndDate).toLocaleDateString()}</p>
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
  <div className="modal-overlays" onClick={closeModal}>
    <div className="modal-contentd" onClick={(e) => e.stopPropagation()}>
      <h2>Update Tenant Information</h2>
      <form onSubmit={handleUpdateTenant}>
        {['Tenant_ID', 'name', 'nic', 'email', 'phone', 'address', 'description', 'leaseStartDate', 'leaseEndDate'].map((field) => (
          <label key={field}>
            {field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:
            <input
              type={field.includes('Date') ? 'date' : 'text'}
              name={field}
              value={tenantData[field]}
              onChange={handleInputChange}
              readOnly={field === 'Tenant_ID' || field === 'leaseStartDate'}
              min={field.includes('Date') ? (field === 'leaseEndDate' ? tenantData.leaseStartDate || new Date().toISOString().split('T')[0] : undefined) : undefined}
            />
            {errors[field] && <span className="error">{errors[field]}</span>}
          </label>
        ))}
        
        <div className="button-group">
          <button type="submit">Update</button>
          <button type="button" onClick={closeModal}>Cancel</button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default Tenant;
