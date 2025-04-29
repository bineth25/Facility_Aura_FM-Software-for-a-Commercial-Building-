import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Floor_Plan_Overview.css';

const Floor_Plan_Overview = () => {
  const [spaces, setSpaces] = useState([]);
  const [filteredSpaces, setFilteredSpaces] = useState([]);
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [selectedSpace, setSelectedSpace] = useState(null);
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
  const [showTenantModal, setShowTenantModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [tenantIdExists, setTenantIdExists] = useState(false); 

  // Fetch all spaces from backend
  const fetchSpaces = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/spaces');
      setSpaces(response.data);

      if (response.data.length > 0) {
        const defaultFloor = response.data[0].floorId;
        setSelectedFloor(defaultFloor);
        setFilteredSpaces(response.data.filter((space) => space.floorId === defaultFloor));
      }
    } catch (error) {
      console.error('Error fetching spaces:', error);
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, []);

  // Handle floor selection and filter spaces based on selected floor
  const handleFloorSelect = (event) => {
    const selected = event.target.value;
    setSelectedFloor(selected);

    const filtered = spaces.filter((space) => space.floorId === selected);
    setFilteredSpaces(filtered);
  };

  // Add this function to generate tenant ID
const generateTenantId = () => {
  const randomNum = Math.floor(100 + Math.random() * 900); // Generates number between 100-999
  return `T${randomNum}`;
};

  // Handle selecting a space
  const handleSpaceSelect = (space) => {
    setSelectedSpace(space);
    setShowTenantModal(false);
    setErrors({});
    setTenantIdExists(false);
    // Reset tenant data with new generated ID when space is selected
    setTenantData({
      Tenant_ID: generateTenantId(),
      name: '',
      nic: '',
      email: '',
      phone: '',
      address: '',
      description: '',
      leaseStartDate: '',
      leaseEndDate: ''
    });
  };

  const checkTenantIdExists = async (tenantId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/tenants/checkTenantId/${tenantId}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking Tenant ID:', error);
      Swal.fire('Error', 'Error checking Tenant ID.', 'error');
      return false;
    }
  };
  

  // Validate tenant form fields in real-time
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

  // Handle input changes and validate in real-time
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTenantData({ ...tenantData, [name]: value });
    validateField(name, value);

    // Reset tenantIdExists when Tenant_ID is changed
    if (name === 'Tenant_ID') {
      setTenantIdExists(false);
    }
  };

  // Add tenant to space
  const handleAddTenant = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0) {
      Swal.fire('Validation Error', 'Please fix the errors before submitting.', 'warning');
      return;
    }
  
    try {
      const tenantWithSpaceData = {
        ...tenantData,
        spaceId: selectedSpace.spaceId
      };
  
      await axios.post('http://localhost:4000/api/tenants/addTenantToSpace', {
        spaceId: selectedSpace.spaceId,
        tenantData: tenantWithSpaceData,
        tenantId: tenantData.Tenant_ID,
      });
  
      Swal.fire('Success', 'Tenant added successfully!', 'success');
      setShowTenantModal(false);
      setSelectedSpace(null);
      setTenantData({
        Tenant_ID: generateTenantId(),
        name: '',
        nic: '',
        email: '',
        phone: '',
        address: '',
        description: '',
        leaseStartDate: '',
        leaseEndDate: ''
      });
  
      await fetchSpaces();
    } catch (error) {
      console.error('Error adding tenant:', error);
      Swal.fire('Error', 'Error adding tenant.', 'error');
    }
  };
  

  // Toggle space availability
  const handleToggleAvailability = async () => {
    if (!selectedSpace) return;
  
    try {
      await axios.put(`http://localhost:4000/api/spaces/availability/${selectedSpace.spaceId}`, {
        isAvailable: true,
      });
      Swal.fire('Success', 'Space availability updated successfully!', 'success');
      await fetchSpaces();
    } catch (error) {
      console.error('Error updating space availability:', error);
      Swal.fire('Error', 'Error updating space availability.', 'error');
    }
  };
  

  return (
    <div className="floor-plan-overview">
      <h1>Floor Plan Visualization & Space Allocation</h1>

      {/* Floor selection dropdown */}
      <div className="floor-selection">
        <label htmlFor="floor">Select Floor:</label>
        <select id="floor" value={selectedFloor || ''} onChange={handleFloorSelect}>
          {spaces
            .map((space) => space.floorId)
            .filter((value, index, self) => self.indexOf(value) === index)
            .map((floorId) => (
              <option key={floorId} value={floorId}>
                Floor {floorId}
              </option>
            ))}
        </select>
      </div>

      {/* Space list based on selected floor */}
      <div className='mains'>
        <div className="space-list">
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

        {/* Space details section */}
        {selectedSpace && (
          <div className="space-details">
            <h2>Space Details</h2>
            <p><span className="info-label">Space ID:</span> <span className="info-value">{selectedSpace.spaceId}</span></p>
            <p><span className="info-label">Floor ID:</span> <span className="info-value">{selectedSpace.floorId}</span></p>
            <p><span className="info-label">Area:</span> <span className="info-value">{selectedSpace.area} sq ft</span></p>
            <p><span className="info-label">Type:</span> <span className="info-value">{selectedSpace.spaceType}</span></p>
            <p><span className="info-label">Description:</span> <span className="info-value">{selectedSpace.description}</span></p>
            <p><span className="info-label">Status:</span> <span className="info-value">{selectedSpace.isAvailable ? 'Available' : 'Occupied'}</span></p>

            {/* Button to open tenant assignment modal */}
            {selectedSpace.isAvailable && (
              <button className="assign-tenant-button" onClick={() => setShowTenantModal(true)}>
                Assign Tenant
              </button>
            )}

            {!selectedSpace.isAvailable && (
              <button className="assign-tenant-button" onClick={handleToggleAvailability}>
                Remove Tenant 
              </button>
            )}
          </div>
        )}
      </div>

      {/* Tenant assignment modal */}
      {showTenantModal && (
        <div className="tenant-modalss">
          <div className="tenant-modalss-content">
            <h3>Assign Tenant to Space {selectedSpace.spaceId}</h3>
            <form onSubmit={handleAddTenant}>
              <label>Tenant ID:</label>
              <input
                type="text"
                name="Tenant_ID"
                value={tenantData.Tenant_ID}
                readOnly 
                className="read-only-input" 
              />
              <p className="info-text">(Auto-generated Tenant ID)</p>

              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={tenantData.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="error-message">{errors.name}</span>}

              <div className='test_row'>
              <label>NIC:</label>
              <input
                type="text"
                name="nic"
                value={tenantData.nic}
                onChange={handleInputChange}
              />
              {errors.nic && <span className="error-message">{errors.nic}</span>}

              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={tenantData.phone}
                onChange={handleInputChange}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>

              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={tenantData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error-message">{errors.email}</span>}


              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={tenantData.address}
                onChange={handleInputChange}
              />
                <div className='test_row'>
              <label>Lease Start Date:</label>
              <input
                type="date"
                name="leaseStartDate"
                value={tenantData.leaseStartDate}
                onChange={handleInputChange}
                min={new Date().toISOString().split('T')[0]}
              />
              {errors.leaseStartDate && <span className="error-message">{errors.leaseStartDate}</span>}

              <label>Lease End Date:</label>
              <input
                type="date"
                name="leaseEndDate"
                value={tenantData.leaseEndDate}
                onChange={handleInputChange}
                min={tenantData.leaseStartDate || new Date().toISOString().split('T')[0]}
              />
              {errors.leaseEndDate && <span className="error-message">{errors.leaseEndDate}</span>}
              </div>

              <label>Lease Description: </label>
              <input
                type="text"
                name="description"
                value={tenantData.description}
                onChange={handleInputChange}
              />

              <div className='buttons-row'>
                <button type="submit">Assign Tenant</button>
                <button type="button" onClick={() => setShowTenantModal(false)}>Cancel</button>
              </div>
              
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Floor_Plan_Overview;