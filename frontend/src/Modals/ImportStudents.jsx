import React, { useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';  // Make sure you are importing from 'xlsx' here
import './ImportStudents.css';

const ImportStudents = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleImport = async () => {
    if (!file) {
      alert("Please select a file.");
      return;
    }

    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      let students;

      if (file.name.endsWith('.csv')) {
        // Handle CSV file
        const text = new TextDecoder().decode(data);
        const rows = text.split('\n').map(row => row.split(','));
        const headers = rows[0];
        students = rows.slice(1).map(row => {
          const studentObj = {};
          headers.forEach((header, index) => {
            const value = row[index];
            studentObj[header.trim()] = typeof value === 'string' ? value.trim() : value;
            // Convert 'time_left' and 'is_logged_in' to integers
            if (header.trim() === 'time_left' || header.trim() === 'is_logged_in') {
              studentObj[header.trim()] = parseInt(value, 10);
            }
          });
          return studentObj;
        });
      } else if (file.name.endsWith('.xls') || file.name.endsWith('.xlsx')) {
        // Handle Excel file
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
        const headers = jsonData[0];
        students = jsonData.slice(1).map(row => {
          const studentObj = {};
          headers.forEach((header, index) => {
            const value = row[index];
            studentObj[header.trim()] = typeof value === 'string' ? value.trim() : value;
            // Convert 'time_left' and 'is_logged_in' to integers
            if (header.trim() === 'time_left' || header.trim() === 'is_logged_in') {
              studentObj[header.trim()] = parseInt(value, 10);
            }
          });
          return studentObj;
        });
      } else {
        alert("Unsupported file type. Please upload a CSV or Excel file.");
        return;
      }

      console.log("Parsed students JSON:", JSON.stringify(students, null, 2)); // Debug: Log the JSON

      try {
        const response = await axios.post('http://localhost:8000/api/import-student/', students, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        console.log('File imported successfully:', response.data);
        alert('Students imported successfully!');
      } catch (error) {
        console.error('Error importing file:', error.response ? error.response.data : error);
        alert('Error importing students. Please check the console for details.');
      }
    };

    reader.onerror = (error) => {
      console.error("File reading error:", error);
      alert("Error reading file. Please try again.");
    };

    reader.readAsArrayBuffer(file); // Reading the file as ArrayBuffer
  };

  return (
    <div className='containerImport'>
      <div className='contentImport'>
        <button className='closeImport' onClick={onClose}>
          &times;
        </button>
        <h2>Import Students</h2>
        <div className="file-input">
          <input type="file" id="fileInput" onChange={handleFileChange} />
        </div>
        {fileName && <div className="file-name">Selected File: {fileName}</div>}
        <div className="button-group">
          <button className="import-btn" onClick={handleImport}>Import</button>
        </div>
      </div>
    </div>
  );
};

export default ImportStudents;
