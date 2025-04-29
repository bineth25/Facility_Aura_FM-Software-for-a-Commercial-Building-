import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import defaultImage from "../../../assets/images/spare-part.jpeg";
import "./Maintainance_Spare_Parts.css";

const Maintainance_Spare_Parts = () => {
  const [imagePreview, setImagePreview] = useState(defaultImage);
  const [searchTerm, setSearchTerm] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [inventory, setInventory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const stockLocations = [
    "Warehouse 001",
    "Warehouse 002",
    "Warehouse 003",
    "Warehouse 004",
    "Warehouse 005"
  ];

  const [formData, setFormData] = useState({
    item_ID: "",
    name: "",
    category: "",
    quantity: "",
    stockLocation: stockLocations[0],
    description: "",
    reorderLevel: "",
    status: "Available",
    addedDate: "",
    image: null,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("maintainanceInventory")) || [];
    setInventory(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("maintainanceInventory", JSON.stringify(inventory));
  }, [inventory]);

  const generateItemId = () => {
    if (isEditing) return formData.item_ID;
    
    const lastItem = inventory.reduce((prev, current) => 
      (parseInt(prev.item_ID?.substring(1)) > parseInt(current.item_ID?.substring(1)) ? prev : current), 
      { item_ID: "M000" }
    );
    
    const lastNumber = parseInt(lastItem.item_ID.substring(1)) || 0;
    const nextNumber = lastNumber + 1;
    return `M${nextNumber.toString().padStart(3, '0')}`;
  };

  useEffect(() => {
    if (!isEditing) {
      setFormData(prev => ({
        ...prev,
        item_ID: generateItemId()
      }));
    }
  }, [inventory, isEditing]);

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name]);
  };

  const validateField = (name, value) => {
    let error = "";
    const today = new Date();

    switch (name) {
      case "item_ID":
        if (!/^[A-Z][0-9]{3}$/.test(value)) {
          error = "Item ID must be 1 uppercase letter + 3 digits (e.g., M001)";
        }
        break;
      case "name":
      case "category":
        if (!/^[a-zA-Z ]+$/.test(value)) error = "Only letters allowed.";
        break;
      case "quantity":
      case "reorderLevel":
        if (!value || isNaN(value) || Number(value) <= 0) error = "Must be greater than 0.";
        break;
      case "stockLocation":
        if (!value.trim()) error = "Stock Location is required.";
        break;
      case "addedDate":
        if (!value) error = "Date is required.";
        else if (new Date(value) < today.setHours(0, 0, 0, 0)) error = "Date can't be in the past.";
        break;
      case "description":
        if (!value.trim()) error = "Description is required.";
        else if (value.trim().split(/\s+/).length > 10) error = "Max 10 words.";
        break;
      default:
        break;
    }

    setFormErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  };

  const isFormValid = () => {
    const newErrors = {};
    Object.entries(formData).forEach(([key, val]) => {
      if (key !== "image") {
        const err = validateField(key, val);
        if (err) newErrors[key] = err;
      }
    });
    setFormErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error("All fields are required and must be valid.");
      return false;
    }
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(defaultImage);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isFormValid()) return;

    const newItem = { ...formData, image: formData.image || defaultImage };

    if (isEditing) {
      setInventory((prev) =>
        prev.map((item) => (item.item_ID === formData.item_ID ? newItem : item))
      );
      toast.success("Item updated successfully");
      setIsEditing(false);
    } else {
      const duplicate = inventory.find((item) => item.item_ID === formData.item_ID);
      if (duplicate) {
        toast.error("Item ID already exists!");
        return;
      }
      setInventory((prev) => [...prev, newItem]);
      toast.success("Item added successfully");
    }

    setFormData({
      item_ID: generateItemId(),
      name: "",
      category: "",
      quantity: "",
      stockLocation: stockLocations[0],
      description: "",
      reorderLevel: "",
      status: "Available",
      addedDate: "",
      image: null,
    });
    setTouched({});
    setImagePreview(defaultImage);
    setFormErrors({});
  };

  const handleEdit = (id) => {
    const item = inventory.find((item) => item.item_ID === id);
    if (item) {
      setFormData({ ...item });
      setImagePreview(item.image || defaultImage);
      setIsEditing(true);
    }
  };

  const handleDelete = (id) => {
    setInventory((prev) => prev.filter((item) => item.item_ID !== id));
    toast.info("Item deleted");
    setIsEditing(false);
  };

  const generateReport = () => {
    if (inventory.length === 0) return toast.warn("No data to export.");
    const doc = new jsPDF();
    doc.text("Maintainance Spare Parts Inventory Report", 20, 10);
    const headers = ["Item ID", "Name", "Category", "Qty", "Location", "Reorder", "Status", "Date", "Desc"];
    const data = inventory.map((item) => [
      item.item_ID,
      item.name,
      item.category,
      item.quantity,
      item.stockLocation,
      item.reorderLevel,
      item.status,
      item.addedDate,
      item.description
    ]);
    doc.autoTable({ startY: 20, head: [headers], body: data });
    doc.save("Maintainance_Spare_Parts_Report.pdf");
  };

  const exportCSV = () => {
    const csvRows = [
      ["Item ID", "Name", "Category", "Quantity", "Stock Location", "Reorder Level", "Status", "Added Date", "Description"],
      ...inventory.map((item) => [
        item.item_ID,
        item.name,
        item.category,
        item.quantity,
        item.stockLocation,
        item.reorderLevel,
        item.status,
        item.addedDate,
        item.description
      ])
    ];
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "Maintainance_Spare_Parts.csv");
    document.body.appendChild(link);
    link.click();
  };

  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.item_ID.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="it-network-container">
      <ToastContainer position="top-right" autoClose={2000} />
      <h2>Maintainance Spare Parts Inventory</h2>

      <div className="topic-image-container">
        <img src={defaultImage} alt="Spare Parts" className="topic-image" />
      </div>

      <form className="it-network-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div>
            <input
              type="text"
              name="item_ID"
              placeholder="Item ID"
              value={formData.item_ID}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={true}
              className={formErrors.item_ID && touched.item_ID ? "input-error" : ""}
            />
            {formErrors.item_ID && touched.item_ID && (
              <span className="field-error">{formErrors.item_ID}</span>
            )}
          </div>
          
          {["name", "category", "quantity", "reorderLevel", "addedDate"].map((field, i) => (
            <div key={i}>
              <input
                type={["quantity", "reorderLevel"].includes(field) ? "number" : field === "addedDate" ? "date" : "text"}
                name={field}
                placeholder={field.replace(/([A-Z])/g, " $1")}
                value={formData[field]}
                onChange={handleChange}
                onBlur={handleBlur}
                className={formErrors[field] && touched[field] ? "input-error" : ""}
              />
              {formErrors[field] && touched[field] && (
                <span className="field-error">{formErrors[field]}</span>
              )}
            </div>
          ))}
          
          <div>
            <select 
              name="stockLocation" 
              value={formData.stockLocation} 
              onChange={handleChange}
              className={formErrors.stockLocation && touched.stockLocation ? "input-error" : ""}
            >
              {stockLocations.map((location, index) => (
                <option key={index} value={location}>{location}</option>
              ))}
            </select>
            {formErrors.stockLocation && touched.stockLocation && (
              <span className="field-error">{formErrors.stockLocation}</span>
            )}
          </div>
          
          <select name="status" value={formData.status} onChange={handleChange}>
            <option>Available</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>
          
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <div className="description-container">
          <label>Description:</label>
          <textarea
            name="description"
            className={`description-field ${formErrors.description && touched.description ? "input-error" : ""}`}
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter spare part details..."
          />
          {formErrors.description && touched.description && (
            <span className="field-error">{formErrors.description}</span>
          )}
        </div>

        <div className="button-group">
          <button type="submit">{isEditing ? "Update" : "Add Item"}</button>
        </div>
      </form>

      <div className="search-bar-wrapper">
        <input
          className="search-bar"
          type="text"
          placeholder="Search by Item ID or Name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3>Maintainance Inventory List</h3>
      <div className="table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Item ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Stock Location</th>
              <th>Reorder Level</th>
              <th>Status</th>
              <th>Added Date</th>
              <th>Description</th>
              <th>Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map((item) => (
              <tr key={item.item_ID}>
                <td>{item.item_ID}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity}</td>
                <td>{item.stockLocation}</td>
                <td>{item.reorderLevel}</td>
                <td>{item.status}</td>
                <td>{item.addedDate}</td>
                <td>{item.description}</td>
                <td><img src={item.image || defaultImage} alt={item.name} className="table-image" /></td>
                <td>
                  <button onClick={() => handleEdit(item.item_ID)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(item.item_ID)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="centered-buttons">
        <button type="button" className="report-btn" onClick={generateReport}>Generate PDF</button>
        <button type="button" className="report-btn" onClick={exportCSV}>Export CSV</button>
      </div>

      <div className="inventory-chart">
        <h3>Inventory Quantity Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={inventory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="quantity" fill="#579B96" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Maintainance_Spare_Parts;