import React, { useState } from 'react';
import './Tasks.css';
import Notification from '../notification/notification.jsx';
import '../notification/notification.css';
import plusIcon from './Assets/plus.png';
import attachIcon from './Assets/attach_icon.png';

function Tasks() {
  const [showForm, setShowForm] = useState(false);
  const [attachedFile, setAttachedFile] = useState(null);
  const [issueTitle, setIssueTitle] = useState('');
  const [technicianName, setTechnicianName] = useState('');
  const [location, setLocation] = useState('');
  const [technicianID, setTechnicianID] = useState('');
  const [description, setDescription] = useState('');
  const [issueTitleError, setIssueTitleError] = useState('');
  const [technicianNameError, setTechnicianNameError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [technicianIDError, setTechnicianIDError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [photoError, setPhotoError] = useState('');
  const [wordCount, setWordCount] = useState(0);

  const openForm = () => setShowForm(true);
  const closeForm = () => setShowForm(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size <= 5 * 1024 * 1024) { // 5MB limit
        setAttachedFile(file.name);
        setPhotoError('');
      } else {
        setAttachedFile(null);
        setPhotoError('File size exceeds 5MB. Please upload a smaller file.');
      }
    }
  };

  const validateTextOnly = (value) => /^[A-Za-z\s]*$/.test(value);
  const validateAlphanumeric = (value) => /^[A-Za-z0-9\s]*$/.test(value);
  const countWords = (value) => value.trim().split(/\s+/).length;

  const handleIssueTitleChange = (event) => {
    const value = event.target.value;
    if (validateTextOnly(value)) {
      setIssueTitle(value);
      setIssueTitleError('');
    } else {
      setIssueTitleError('Only alphabetic characters and spaces are allowed.');
    }
  };

  const handleTechnicianNameChange = (event) => {
    const value = event.target.value;
    if (validateTextOnly(value)) {
      setTechnicianName(value);
      setTechnicianNameError('');
    } else {
      setTechnicianNameError('Only alphabetic characters and spaces are allowed.');
    }
  };

  const handleLocationChange = (event) => {
    const value = event.target.value;
    if (validateAlphanumeric(value)) {
      setLocation(value);
      setLocationError('');
    } else {
      setLocationError('Only alphabetic characters, numbers, and spaces are allowed.');
    }
  };

  const handleTechnicianIDChange = (event) => {
    const value = event.target.value;
    if (validateAlphanumeric(value)) {
      setTechnicianID(value);
      setTechnicianIDError('');
    } else {
      setTechnicianIDError('Only alphabetic characters, numbers, and spaces are allowed.');
    }
  };

  const handleDescriptionChange = (event) => {
    const value = event.target.value;
    const words = countWords(value);
    setWordCount(words);

    if (words <= 20) {
      setDescription(value);
      setDescriptionError('');
    } else {
      setDescriptionError('Description cannot exceed 20 words.');
    }
  };

  return (
    <div className="tasks-container">
      <Notification />
      <button className="assign-task-btn" onClick={openForm}>
        <img src={plusIcon} alt="Plus Icon" className="plus-icon" />
        Assign Task
      </button>

      {showForm && (
        <div className="modal-overlay">
          <div className="task-form">
            <div className="form-header centered-title">
              <h2>Task Assignment</h2>
              <button className="close-btn" onClick={closeForm}>&times;</button>
            </div>

            <form>
              <div className="form-row">
                <div className="form-group">
                  <label>Task ID:</label>
                  <input type="text" />
                </div>
                <div className="form-group">
                  <label>Task Type:</label>
                  <select>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Issue Title:</label>
                  <input type="text" value={issueTitle} onChange={handleIssueTitleChange} />
                  {issueTitleError && <p className="error-message">{issueTitleError}</p>}
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <input type="text" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority:</label>
                  <select>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location:</label>
                  <input type="text" value={location} onChange={handleLocationChange} />
                  {locationError && <p className="error-message">{locationError}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Technician ID:</label>
                  <input type="text" value={technicianID} onChange={handleTechnicianIDChange} />
                  {technicianIDError && <p className="error-message">{technicianIDError}</p>}
                </div>
                <div className="form-group">
                  <label>Technician Name:</label>
                  <input type="text" value={technicianName} onChange={handleTechnicianNameChange} />
                  {technicianNameError && <p className="error-message">{technicianNameError}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Description (Max 20 words):</label>
                  <textarea value={description} onChange={handleDescriptionChange}></textarea>
                  <p className="word-count">Words: {wordCount} / 20</p>
                  {descriptionError && <p className="error-message">{descriptionError}</p>}
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full-width">
                  <label>Photos (Max size: 5MB):</label>
                  <div className="file-upload">
                    <label htmlFor="file-input" className="file-label">
                      <img src={attachIcon} alt="Attach Icon" className="attach-icon" />
                      <span>Attach File</span>
                    </label>
                    <input id="file-input" type="file" className="file-input" onChange={handleFileChange} />
                    {attachedFile && <p className="file-name">{attachedFile}</p>}
                    {photoError && <p className="error-message">{photoError}</p>}
                  </div>
                </div>
              </div>

              <div className="form-buttons single-button">
                <button type="submit" className="assign-btn">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Tasks;
