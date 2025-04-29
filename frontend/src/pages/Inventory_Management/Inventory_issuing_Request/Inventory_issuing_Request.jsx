import React, { useState, useEffect } from "react";
import "./Inventory_issuing_Request.css";
import bannerImage from "../../../assets/images/Inventory_Issuing.png";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const InventoryIssuingRequest = () => {
  const [requests, setRequests] = useState([]);
  const [lastRequestNumber, setLastRequestNumber] = useState(0);
  const [formData, setFormData] = useState({
    requestId: "",
    itemId: "",
    requestedBy: "",
    quantity: "",
    reason: "",
    currentStockQuantity: "",
    restQuantity: "",
    status: "Pending",
    issuedAt: "",
  });
  const [errors, setErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [lowStockWarning, setLowStockWarning] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const storedRequests = localStorage.getItem("inventoryRequests");
    if (storedRequests) {
      const parsed = JSON.parse(storedRequests);
      setRequests(parsed);

      const lastReq = parsed.reduce((max, req) => {
        const num = parseInt(req.requestId.replace("R", ""));
        return num > max ? num : max;
      }, 0);
      setLastRequestNumber(lastReq);

      const lowStock = parsed.filter(r => r.currentStockQuantity > 0 && r.restQuantity <= r.currentStockQuantity * 0.5);
      setLowStockCount(lowStock.length);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("inventoryRequests", JSON.stringify(requests));
    const lowStock = requests.filter(r => r.currentStockQuantity > 0 && r.restQuantity <= r.currentStockQuantity * 0.5);
    setLowStockCount(lowStock.length);
  }, [requests]);

  const lowStockItems = requests.filter(r => r.currentStockQuantity > 0 && r.restQuantity <= r.currentStockQuantity * 0.5);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const validateField = (name, value) => {
    let error = "";
    if (name === "itemId") {
      if (!/^[MIE]\d{3}$/.test(value)) {
        error = "Item ID must start with M, I, or E followed by 3 digits (e.g., M001,E001,I001).";
      }
    } else if (name === "currentStockQuantity") {
      if (!value || isNaN(value) || parseInt(value) <= 0) {
        error = "Current quantity must be greater than 0.";
      }
    } else if (name === "quantity") {
      const quantity = parseInt(value);
      const currentStock = parseInt(formData.currentStockQuantity);
      if (value === "" || isNaN(quantity) || quantity < 0) {
        error = "Issued quantity must be 0 or greater.";
      } else if (!isNaN(currentStock) && quantity > currentStock) {
        error = "Issued quantity cannot be greater than current quantity.";
      }
    } else if (["requestedBy", "reason"].includes(name)) {
      if (!value.trim()) {
        error = `${name.replace(/([A-Z])/g, " $1")} is required.`;
      }
    } else if (name === "issuedAt") {
      if (!value.trim()) {
        error = "Issued Date is required.";
      }
    }
    return error;
  };

  const validateAllFields = () => {
    const newErrors = {};
    Object.keys(formData).forEach((field) => {
      if (field === "requestId") return;
      const error = validateField(field, formData[field]);
      if (error) newErrors[field] = error;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };

    if (["quantity", "currentStockQuantity"].includes(name)) {
      const q = parseInt(name === "quantity" ? value : formData.quantity) || 0;
      const c = parseInt(name === "currentStockQuantity" ? value : formData.currentStockQuantity) || 0;
      updated.restQuantity = Math.max(c - q, 0);

      if (c > 0 && updated.restQuantity <= c * 0.5) {
        setLowStockWarning(true);
      } else {
        setLowStockWarning(false);
      }
    }

    setFormData(updated);
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateAllFields()) return;

    if (isEditing) {
      const updatedRequests = requests.map((r) =>
        r.requestId === formData.requestId ? formData : r
      );
      setRequests(updatedRequests);
      setIsEditing(false);
      toast.success("✅ Request Updated");
    } else {
      const nextRequestId = `R${String(lastRequestNumber + 1).padStart(3, "0")}`;
      const newRequest = { ...formData, requestId: nextRequestId };
      setRequests([...requests, newRequest]);
      setLastRequestNumber(prev => prev + 1);
      toast.success("✅ Request Added");
    }

    setFormData({
      requestId: "",
      itemId: "",
      requestedBy: "",
      quantity: "",
      reason: "",
      currentStockQuantity: "",
      restQuantity: "",
      status: "Pending",
      issuedAt: "",
    });
    setErrors({});
    setLowStockWarning(false);
  };

  const handleEdit = (id) => {
    const req = requests.find((r) => r.requestId === id);
    if (req) {
      setFormData({ ...req });
      setIsEditing(true);

      if (req.currentStockQuantity > 0 && req.restQuantity <= req.currentStockQuantity * 0.5) {
        setLowStockWarning(true);
      } else {
        setLowStockWarning(false);
      }
    }
  };

  const handleDelete = (id) => {
    const updated = requests.filter((r) => r.requestId !== id);
    setRequests(updated);
    toast.info("🗑 Request Deleted");
  };

  const generateReport = () => {
    if (filteredRequests.length === 0) {
      toast.warn("⚠ No data to export!");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Inventory Issuing Request Report", 14, 20);

    const columns = [
      "Request ID", "Item ID", "Requested By", "Current Qty",
      "Issued Qty", "Remaining Qty", "Reason", "Status", "Issued Date"
    ];

    const rows = filteredRequests.map((r) => [
      r.requestId,
      r.itemId,
      r.requestedBy,
      r.currentStockQuantity,
      r.quantity,
      r.restQuantity,
      r.reason,
      r.status,
      r.issuedAt
    ]);

    doc.autoTable({
      head: [columns],
      body: rows,
      startY: 30,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [2, 115, 104] },
    });

    doc.save("Inventory_Issuing_Report.pdf");
    toast.success("📄 Report Downloaded");
  };

  const exportCSV = () => {
    if (filteredRequests.length === 0) {
      toast.warn("⚠ No data to export!");
      return;
    }

    const headers = [
      "Request ID", "Item ID", "Requested By", "Current Qty",
      "Issued Qty", "Remaining Qty", "Reason", "Status", "Issued Date"
    ];
    const rows = filteredRequests.map((r) => [
      r.requestId,
      r.itemId,
      r.requestedBy,
      r.currentStockQuantity,
      r.quantity,
      r.restQuantity,
      r.reason,
      r.status,
      r.issuedAt
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "inventory_issuing_requests.csv";
    link.click();
  };

  const filteredRequests = requests.filter((r) =>
    r.requestId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const chartData = {
    labels: filteredRequests.map((r) => r.itemId),
    datasets: [
      {
        label: "Issued Quantity",
        data: filteredRequests.map((r) => parseInt(r.quantity)),
        backgroundColor: "#028b74",
      },
    ],
  };

  return (
    <div className="inventory-container">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="header-with-bell">
        <h2>Inventory Issuing Request Management</h2>
        <div className="bell-container" onClick={toggleDropdown}>
          <i className="bell-icon">🔔</i>
          {lowStockCount > 0 && <span className="notification-count">{lowStockCount}</span>}
          {showDropdown && (
            <div className="dropdown">
              {lowStockItems.length > 0 ? (
                lowStockItems.map((item, index) => (
                  <div key={index} className="dropdown-item">
                    {item.itemId} - {item.restQuantity}/{item.currentStockQuantity} left
                  </div>
                ))
              ) : (
                <div className="dropdown-item">No low stock items</div>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="banner-container">
  <img src={bannerImage} alt="Inventory Management Banner" className="banner-image" />
</div>

      {/* Form, Table, Chart starts here */}
      {lowStockWarning && (
        <div className="low-stock-warning">
          ⚠️ Remaining Quantity is less than 50% of Current Stock!
        </div>
      )}

      <form className="request-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          {[
            { name: "requestId", placeholder: "Request ID" },
            { name: "itemId", placeholder: "Item ID" },
            { name: "requestedBy", placeholder: "Requested By" },
            { name: "currentStockQuantity", placeholder: "Current Quantity", type: "number" },
            { name: "quantity", placeholder: "Issued Quantity", type: "number" },
            { name: "restQuantity", placeholder: "Remaining Quantity", type: "number", readOnly: true },
            { name: "reason", placeholder: "Issuing Reason" },
            { name: "issuedAt", type: "date" },
          ].map((field, index) => (
            <div key={index}>
              <input
                name={field.name}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={formData[field.name]}
                onChange={handleChange}
                readOnly={field.readOnly || field.name === "requestId"}
              />
              {errors[field.name] && <p className="error">{errors[field.name]}</p>}
            </div>
          ))}
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="button-group">
          <button type="submit">{isEditing ? "Update Request" : "Add Request"}</button>
          <button type="button" className="generate-btn" onClick={generateReport}>Generate Report</button>
          <button type="button" className="generate-btn" onClick={exportCSV}>Export CSV</button>
        </div>
      </form>

      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by Request ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <h3>All Issuing Requests</h3>
      <div className="table-wrapper">
        <table className="request-table">
          <thead>
            <tr>
              <th>Request ID</th>
              <th>Item ID</th>
              <th>Requested By</th>
              <th>Current Qty</th>
              <th>Issued Qty</th>
              <th>Rest Qty</th>
              <th>Reason</th>
              <th>Status</th>
              <th>Issued Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequests.map((req) => (
              <tr key={req.requestId}>
                <td>{req.requestId}</td>
                <td>{req.itemId}</td>
                <td>{req.requestedBy}</td>
                <td>{req.currentStockQuantity}</td>
                <td>{req.quantity}</td>
                <td>{req.restQuantity}</td>
                <td>{req.reason}</td>
                <td>{req.status}</td>
                <td>{req.issuedAt}</td>
                <td className="action-buttons">
                  <button className="edit-btn" onClick={() => handleEdit(req.requestId)}>Edit</button>
                  <button className="delete-btn" onClick={() => handleDelete(req.requestId)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3>Issued Quantity Analysis</h3>
      <div className="chart-container">
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          }}
        />
      </div>
    </div>
  );
};

export default InventoryIssuingRequest;
