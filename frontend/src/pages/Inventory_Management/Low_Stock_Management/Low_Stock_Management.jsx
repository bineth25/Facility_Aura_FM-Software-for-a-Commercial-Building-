import React, { useState } from "react";
import "./Low_Stock_Management.css";

const Low_Stock_Management = () => {
  // Sample data for low-stock items
  const [lowStockItems, setLowStockItems] = useState([
    { id: 1, name: "Printer Ink", category: "Office Supplies", stock: 3, reorderLevel: 5 },
    { id: 2, name: "Ethernet Cables", category: "IT Equipment", stock: 2, reorderLevel: 4 },
    { id: 3, name: "First Aid Kit", category: "Safety Equipment", stock: 1, reorderLevel: 3 },
    { id: 4, name: "Light Bulbs", category: "Electrical", stock: 4, reorderLevel: 6 },
  ]);

  return (
    <div className="low-stock-container">
      <h1>Low Stock Management</h1>
      
      {/* Stock Alert Section */}
      <div className="stock-alert">
        <p>⚠️ Warning: Some items are running low on stock!</p>
      </div>

      {/* Low Stock Items Table */}
      <div className="low-stock-table">
        <table>
          <thead>
            <tr>
              <th>Item Name</th>
              <th>Category</th>
              <th>Stock Level</th>
              <th>Reorder Level</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {lowStockItems.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td className={item.stock <= item.reorderLevel ? "low-stock" : ""}>{item.stock}</td>
                <td>{item.reorderLevel}</td>
                <td>
                  <button className="reorder-button">Reorder</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Low_Stock_Management;