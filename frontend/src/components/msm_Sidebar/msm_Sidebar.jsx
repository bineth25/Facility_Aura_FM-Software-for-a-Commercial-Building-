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
        <img src="../public/favicon.ico" alt="Logo" className="msm_logo" />
        <h3 className="msm_appTitle">FacilityAura</h3>
      </div>
      
      <div className="msm_sidebar_divider"></div>
      
      <h4 className="msm_menu_title">MENU</h4>
      
      {/* Your Details Dashboard */}
      <div 
        className={`msm_menu_item msm_dropdown ${openMenu === "taskDashboard" ? "msm_menu_item_active" : ""}`}
        onClick={() => toggleDropdown("taskDashboard")}
      >
        <div className="msm_menu_item_content">
          <span className="msm_icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
          </span>
          <span className="msm_menu_text">Your Details</span>
        </div>
        <span className={`msm_arrow ${openMenu === "taskDashboard" ? "msm_arrow_up" : ""}`}>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
      
      {openMenu === "taskDashboard" && (
        <div className="msm_submenu">
          <NavLink to="/Dashboard" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            <span className="msm_submenu_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </span>
            Dashboard
          </NavLink>
          <NavLink to="/Tasks" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            <span className="msm_submenu_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </span>
            Tasks
          </NavLink>
          <NavLink to="/Complete" className={({isActive}) => 
            isActive ? "msm_submenu_item msm_submenu_item_active" : "msm_submenu_item"
          }>
            <span className="msm_submenu_icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
            </span>
            Complete
          </NavLink>
        </div>
      )}
      
      {/* You can add more menu items here following the same pattern */}
      
      <div className="msm_sidebar_footer">
        <p className="msm_copyright">© 2025 OfficeAura</p>
      </div>
    </aside>
  );
};

export default Sidebar;