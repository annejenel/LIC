import React, { useState } from 'react';
import './AddStaff.css';

const AddStaffModal = ({ isOpen, onClose, onAddStaff }) => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const defaultPassword = 'default password';

  const handleSubmit = (e) => {
    e.preventDefault();
    const newStaff = { username, name, password: defaultPassword }; 
    onAddStaff(newStaff);
    setUsername('');
    setName('');
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
          <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            
          </div>
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