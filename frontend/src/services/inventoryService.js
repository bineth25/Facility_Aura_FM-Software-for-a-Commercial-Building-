import axios from "axios";

const API_URL = "http://localhost:4000/api/inventory"; // Your backend API

// Safety and Emergency Equipment Functions
const getAllSafetyEquipment = async () => {
  const response = await axios.get(`${API_URL}/safetyEquipment`);
  return response.data;
};

const addSafetyEquipment = async (equipmentData) => {
  const formData = new FormData();
  Object.keys(equipmentData).forEach((key) => formData.append(key, equipmentData[key]));

  const response = await axios.post(`${API_URL}/safetyEquipment`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

const updateSafetyEquipment = async (id, equipmentData) => {
  const response = await axios.put(`${API_URL}/safetyEquipment/${id}`, equipmentData);
  return response.data;
};

const deleteSafetyEquipment = async (id) => {
  const response = await axios.delete(`${API_URL}/safetyEquipment/${id}`);
  return response.data;
};

export default {
  getAllSafetyEquipment,
  addSafetyEquipment,
  updateSafetyEquipment,
  deleteSafetyEquipment,
};