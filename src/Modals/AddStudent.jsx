import React, { useState } from 'react';
import axios from 'axios';
import './AddStudent.css';  // Import CSS for modal styling

const AddStudent = ({ isOpen, onClose, onStudentAdded }) => {
  const [studentId, setStudentId] = useState('');
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const defaultTimeLeft = 60;
    const defaultStatus = 'Active';
  
    const newStudent = {
      studentID: studentId,
      name: name,
      course: course,
      time_left: defaultTimeLeft,
      status: defaultStatus,
    };
  
    try {
      const response = await axios.post('http://localhost:8000/api/students/', newStudent);
      console.log('Student added successfully:', response.data);
      onStudentAdded();
      onClose();
      alert('Student added successfully!');  // Inform user of success
    } catch (error) {
      console.error('Error adding student:', {
        message: error.message,
        response: error.response ? error.response.data : 'No response data',
      });
      alert('Failed to add student. Please try again.');
    }
  };
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Add Student</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="studentId">Student ID</label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="course">Course</label>
            <input
              type="text"
              id="course"
              name="course"
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              required
            />
          </div>
          <button type="submit">Add Student</button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
