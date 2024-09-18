import React, { useState } from 'react';
import axios from 'axios';
import './StudentTransaction.css'; // Import the CSS

const StudentTransaction = ({ isOpen, onClose, studentID, onTransactionCompleted }) => {
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState(null); // State for image
  const [hoursToAdd, setHoursToAdd] = useState(1); // New state for hours
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(URL.createObjectURL(file)); // Preview the image
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    if (!transactionRef || !studentID || !hoursToAdd) {
      setError('Transaction reference, hours, and student ID are required.');
      return;
    }
  
    const formData = new FormData();
    formData.append('reference_number', transactionRef);
    formData.append('student_id', studentID);
    formData.append('hours', hoursToAdd.toString()); // Convert hoursToAdd to string before appending
    if (receiptImage) {
      formData.append('receipt', receiptImage); // Append the image
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
        setError('Failed to process the transaction.');
      }
    } catch (error) {
      setError('Error processing transaction: ' + error.message);
    }
  };
  
  // Ensure you are calling the callback after the transaction completes
const handleTransactionSubmit = () => {
    // Assuming transaction processing logic goes here
    processTransaction()
      .then(() => {
        if (props.onTransactionCompleted) {
          props.onTransactionCompleted(); // Call the callback when transaction is done
        }
        props.onClose(); // Close the modal
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
        <h2>Add Time to Student</h2>
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
