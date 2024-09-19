import React, { useState } from 'react';
import axios from 'axios';
import './StudentTransaction.css'; 
import { Typography } from '@mui/joy';

const StudentTransaction = ({ isOpen, onClose, studentID, onTransactionCompleted }) => {
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState(null); 
  const [hoursToAdd, setHoursToAdd] = useState(1); 
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
  
    if (!transactionRef || !studentID || !hoursToAdd) {
      alert('Transaction reference, hours, and student ID are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('reference_number', transactionRef);
    formData.append('student_id', studentID);
    formData.append('hours', hoursToAdd.toString()); 
    if (receiptImage) {
      formData.append('receipt', receiptImage); 
    }
  
    try {
      const response = await axios.post('http://localhost:8000/api/transactions/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      if (response.status === 201) {
        onTransactionCompleted();
        onClose(); 
        alert('Transaction processed successfully!');
      } else {
        alert('Failed to process the transaction.');
      }
    } catch (error) {

      if (error.response && error.response.data && error.response.data.error) {
        alert(`Error: ${error.response.data.error}`); 
      } else {
        alert(`Error processing transaction: ${error.message}`); 
      }
    }
  };
  
  const handleTransactionSubmit = () => {
    processTransaction()
      .then(() => {
        if (props.onTransactionCompleted) {
          props.onTransactionCompleted();
        }
        props.onClose(); 
      })
      .catch((error) => {
        console.error("Error processing transaction:", error);
      });
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>New Transaction</h2>
        {/* Display student ID */}
        <Typography variant="h6" component="div" gutterBottom>
          Student ID: {studentID}
        </Typography>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="transactionRef">Transaction Reference</label>
            <input
              type="text"
              id="transactionRef"
              name="transactionRef"
              value={transactionRef}
              onChange={(e) => setTransactionRef(e.target.value)}
              placeholder="Enter reference"
              required
            />
          </div>
          <div>
            <label htmlFor="hoursToAdd">Hours to Add</label>
            <input
              type="number"
              id="hoursToAdd"
              name="hoursToAdd"
              value={hoursToAdd}
              onChange={(e) => setHoursToAdd(e.target.value)}
              placeholder="Enter hours"
              min="1"
              required
            />
          </div>
          <div>
            <label htmlFor="receiptImage">Upload Receipt Image</label>
            <input
              type="file"
              id="receiptImage"
              name="receiptImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {receiptImage && <img src={receiptImage} alt="Receipt Preview" className="image-preview" />}
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
};

export default StudentTransaction;
