import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import "./msm_Sidebar.css";

const Sidebar = () => {
  const [openMenu, setOpenMenu] = useState("taskDashboard"); // Start with menu open
  
  const toggleDropdown = (menu) => {
    setOpenMenu(openMenu === menu ? null : menu); // If already open, close it; otherwise, open it
  };
  
  return (
    <aside className="msm_sidebar">
      <div className="msm_sidebar_header">
        <img src="https://via.placeholder.com/50" alt="Logo" className="msm_logo" />
        <h3 className="msm_appTitle">OfficeAura</h3>
      </div>
      
      <h4 className="msm_menu_title">MENU</h4>
      
      {/* Assign Task Dashboard */}
      <div 
        className={`msm_menu_item msm_dropdown ${openMenu === "taskDashboard" ? "msm_menu_item_active" : ""}`}
        onClick={() => toggleDropdown("taskDashboard")}
      >
        <div className="msm_menu_item_content">
          <span className="msm_icon">📋</span> 
          <span className="msm_menu_text">Your Details</span>
        </div>
        <span className="msm_arrow">{openMenu === "taskDashboard" ? "▲" : "▼"}</span>
      </div>
      
      {openMenu === "taskDashboard" && (
        <div className="msm_submenu">
          <NavLink to="/Dashboard" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            Dashboard
          </NavLink>
          <NavLink to="/Tasks" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            Tasks
          </NavLink>
          <NavLink to="/Complete" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            Complete
          </NavLink>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;