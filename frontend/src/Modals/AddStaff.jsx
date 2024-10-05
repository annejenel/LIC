import React, { useState } from 'react';
import './AddStaff.css';

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [name, setName] = useState('');
  const [staffID, setStaffID] = useState('');
  const defaultPassword = 'default password';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = { name, staffID, password: defaultPassword }; 
    onAddStaff(newStaff);
    setName('');
    setStaffID('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="add-staff-modal-overlay">
      <div className="add-staff-modal">
        <button className="add-staff-modal-close" onClick={onClose}>&times;</button>
        <h2>Add Staff</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Staff ID:</label>
            <input
              type="text"
              value={staffID}
              onChange={(e) => setStaffID(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="text" 
              value={defaultPassword} 
              readOnly 
              required
            />
          </div>
          <button type="submit">Add Staff</button>
        </form>
      </div>
    </div>
  );
};

export default AddStaffModal;