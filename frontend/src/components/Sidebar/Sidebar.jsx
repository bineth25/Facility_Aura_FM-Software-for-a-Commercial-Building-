import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState(null); 

  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <img src="/favicon.ico" alt="Logo" className="logo" />
        <h3>FacilityAura</h3>
      </div>

      <h4 className="menu-title">MENU</h4>

      <NavLink to="/home" className="menu-item">
        🏠 Home
      </NavLink>


      {/* Assign Task Dashboard */}
      <div className="menu-item dropdown" onClick={() => toggleDropdown("taskDashboard")}>
        <span className="icon">📋</span> Maintenance & Issues Assigning
        <span className="arrow">{openMenu === "taskDashboard" ? "▲" : "▼"}</span>
      </div>
      {openMenu === "taskDashboard" && (
        <div className="submenu">
        <NavLink to="/Dashboard" className="submenu-item">Dashboard</NavLink>
        <NavLink to="/Tasks" className="submenu-item">Tasks</NavLink>
        <NavLink to="/Done" className="submenu-item">Done</NavLink>
      </div>
      )}

      {/* Electricity Consumption Management */}
      <div className="menu-item dropdown" onClick={() => toggleDropdown("electricityDashboard")}>
        <span className="icon">⚡</span> Electricity Consumption Management
        <span className="arrow">{openMenu === "electricityDashboard" ? "▲" : "▼"}</span>
      </div>
      {openMenu === "electricityDashboard" && (
        <div className="submenu">
          <NavLink to="/Add_New_Energy_Reading" className="submenu-item">📈 Add New Energy Reading</NavLink>
          <NavLink to="/Configure_Limits" className="submenu-item">🔧 Configure Limits</NavLink>
          <NavLink to="/Energy_Consumption_Analysis" className="submenu-item">📊 Energy Consumption Analysis</NavLink>
          <NavLink to="/View_HVAC_Energy_Consumption_details" className="submenu-item">🌡️ View HVAC Energy Consumption details</NavLink>
          <NavLink to="/View_Lighting_Energy_Consumption_details" className="submenu-item">💡 View Lighting Energy Consumption details</NavLink>
          <NavLink to="/View_Solar_Energy_Consumption_Details" className="submenu-item">🌞 View Solar Energy Consumption Details</NavLink>
        </div>
      )}

      {/* Space Management */}
      <div className="menu-item dropdown" onClick={() => toggleDropdown("spaceManagementDashboard")}>
        <span className="icon">🏢</span> Space Management
        <span className="arrow">{openMenu === "spaceManagementDashboard" ? "▲" : "▼"}</span>
      </div>
      {openMenu === "spaceManagementDashboard" && (
        <div className="submenu">
          <NavLink to="/space-utilization" className="submenu-item">📊 Space Utilization Dashboard</NavLink>
          <NavLink to="/floor-plan-overview" className="submenu-item">🏢 Floor Plan Overview</NavLink>
          <NavLink to="/tenant-history" className="submenu-item">👥 Tenant Details</NavLink>
          <NavLink to="/notification" className="submenu-item">🔔 Lease Expiry Notifications</NavLink>

        </div>
      )}

      {/* Inventory Management */}
      <div className="menu-item dropdown" onClick={() => toggleDropdown("inventoryDashboard")}>
        <span className="icon">📦</span> Inventory Management
        <span className="arrow">{openMenu === "inventoryDashboard" ? "▲" : "▼"}</span>
      </div>
      {openMenu === "inventoryDashboard" && (
        <div className="submenu">
          <NavLink to="/Maintainance_Spare_parts" className="submenu-item">🔧 Maintenance and Spare Parts Inventory</NavLink>
          <NavLink to="/IT_Network_Inventory" className="submenu-item">💻 IT & Network Inventory</NavLink>
          <NavLink to="/Emergency_Equipment_Inventory" className="submenu-item">🚨 Safety and Emergency Equipment Inventory</NavLink>
          <NavLink to="/Inventory_issuing_Request" className="submenu-item">🛋️ Inventory Issuing Request Management</NavLink>
          <NavLink to="/Low_Stock_Management" className="submenu-item">📑 Low Stock Management</NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
