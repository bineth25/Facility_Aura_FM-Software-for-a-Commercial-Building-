import React, { useState } from "react";
import "./Add_New_Energy_Reading.css";

const Add_New_Energy_Reading = () => {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    meterId: "",
    consumption: "",
    source: "HVAC",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.date || !formData.time || !formData.meterId || !formData.consumption) {
      setMessage("⚠️ Please fill in all fields.");
      return;
    }
    setMessage("✅ Energy reading added successfully!");
    console.log("Submitted Data:", formData);
  };

  return (
    <div className="energy-reading-container">
      <h1>Add New Energy Reading</h1>
      <p>Enter the details below to log a new energy consumption reading.</p>

      {message && <div className="message">{message}</div>}

      <form className="energy-reading-form" onSubmit={handleSubmit}>
        <label>Date:</label>
        <input type="date" name="date" value={formData.date} onChange={handleChange} required />

        <label>Time:</label>
        <input type="time" name="time" value={formData.time} onChange={handleChange} required />

        <label>Meter ID:</label>
        <input type="text" name="meterId" value={formData.meterId} onChange={handleChange} placeholder="Enter Meter ID" required />

        <label>Energy Consumption (kWh):</label>
        <input type="number" name="consumption" value={formData.consumption} onChange={handleChange} placeholder="Enter kWh" required />

        <label>Energy Source:</label>
        <select name="source" value={formData.source} onChange={handleChange}>
          <option value="HVAC">HVAC</option>
          <option value="Lighting">Lighting</option>
          <option value="Renewable Energy">Renewable Energy</option>
        </select>

        <button type="submit" className="submit-btn">Submit</button>
      </form>
    </div>
  );
};

export default Add_New_Energy_Reading;
