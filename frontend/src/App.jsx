import React from 'react'
import {Route, Routes} from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'

// Importing Pages
import Floor_Plan_Overview  from './pages/Space_Management/Floor_Plan_Overview/Floor_Plan_Overview'
import Notification from './pages/Space_Management/Notification/Notification'
import Space_Allocation from './pages/Space_Management/Space_Allocation/Space_Allocation'
import Tenant_History from './pages/Space_Management/Tenant_History/Tenant_History'
import Space_Utilization_Dashboard from './pages/Space_Management/Space_Utilization_Dashboard/Space_Utilization_Dashboard'

import Emergency_Equipment_Inventory from './pages/Inventory_Management/Emergency_Equipment_Inventory/Emergency_Equipment_Inventory'
import Inventory_issuing_Request from './pages/Inventory_Management/Inventory_issuing_Request/Inventory_issuing_Request'
import IT_Network_Inventory from './pages/Inventory_Management/IT_Network_Inventory/IT_Network_Inventory'
import Low_Stock_Management from './pages/Inventory_Management/Low_Stock_Management/Low_Stock_Management'
import Maintainance_Spare_parts from './pages/Inventory_Management/Maintainance_Spare_parts/Maintainance_Spare_parts'


import Add_New_Energy_Reading from './pages/Electricity_Consumption_Management/Add_New_Energy_Reading/Add_New_Energy_Reading'
import Configure_Limits from './pages/Electricity_Consumption_Management/Configure_Limits/Configure_Limits'
import Energy_Consumption_Analysis from './pages/Electricity_Consumption_Management/Energy_Consumption_Analysis/Energy_Consumption_Analysis' 
import View_HVAC_Energy_Consumption_details from './pages/Electricity_Consumption_Management/View_HVAC_Energy_Consumption_details/View_HVAC_Energy_Consumption_details'
import View_Lighting_Energy_Consumption_details from './pages/Electricity_Consumption_Management/View_Lighting_Energy_Consumption_details/View_Lighting_Energy_Consumption_details' 
import View_Solar_Energy_Consumption_Details from './pages/Electricity_Consumption_Management/View_Solar_Energy_Consumption_Details/View_Solar_Energy_Consumption_Details'

import Dashboard from "./pages/Maintenance _Issues_Assigning/Dashboard/Dashboard"
import Tasks from "./pages/Maintenance _Issues_Assigning/Tasks/Tasks"
import Approval_tasks from './pages/Maintenance _Issues_Assigning/Approval_tasks/Approval_tasks'
import In_Progress from './pages/Maintenance _Issues_Assigning/In_Progress/In_Progress'
import Notifications from './pages/Maintenance _Issues_Assigning/Notifications/Notifications'
import Review_compled_tasks from './pages/Maintenance _Issues_Assigning/Review_compled_tasks/Review_compled_tasks'



const App = () => {
  return (
    
      <div className="app-container">
        <Sidebar />
        <div className="main-content">
          <Navbar />
          <div className="dashboard-content">
            <Routes>
              <Route path="/space-utilization" element={<Space_Utilization_Dashboard/>} />
              <Route path="/floor-plan-overview" element={<Floor_Plan_Overview />} />
              <Route path="/space-allocation" element={<Space_Allocation />} />
              <Route path="/notification" element={<Notification />} />
              <Route path="/tenant-history" element={<Tenant_History />} />

              <Route path="/Emergency_Equipment_Inventory" element={<Emergency_Equipment_Inventory/>} />
              <Route path="/Inventory_issuing_Request" element={<Inventory_issuing_Request />} />
              <Route path="/IT_Network_Inventory" element={<IT_Network_Inventory />} />
              <Route path="/Low_Stock_Management" element={<Low_Stock_Management />} />
              <Route path="/Maintainance_Spare_parts" element={<Maintainance_Spare_parts />} />
              

              <Route path="/Add_New_Energy_Reading" element={<Add_New_Energy_Reading/>} />
              <Route path="/Configure_Limits" element={<Configure_Limits />} />
              <Route path="/Energy_Consumption_Analysis" element={<Energy_Consumption_Analysis />} />
              <Route path="/View_HVAC_Energy_Consumption_details" element={<View_HVAC_Energy_Consumption_details />} />
              <Route path="/View_Lighting_Energy_Consumption_details" element={<View_Lighting_Energy_Consumption_details />} />
              <Route path="/View_Solar_Energy_Consumption_Details" element={<View_Solar_Energy_Consumption_Details />} />

              <Route path="/Dashboard" element={<Dashboard/>}/>
              <Route path="/Tasks" element={<Tasks/>}/>
              <Route path="/Approval_tasks" element={<Approval_tasks/>} />
              <Route path="/In_Progress" element={<In_Progress />} />
              <Route path="/Notifications" element={<Notifications />} />
              <Route path="/Review_compled_tasks" element={<Review_compled_tasks />} />
            </Routes>
          </div>
          
        </div>
      </div>
  
    
  )
}

export default App
