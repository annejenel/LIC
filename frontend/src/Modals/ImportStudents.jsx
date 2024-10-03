import React, { useState } from 'react'
import './ImportStudents.css';

const ImportStudents = ({isOpen, onClose}) => {

    if (!isOpen) return null;
  return (
    <div className='containerImport'>
        <div className='contentImport'>
            <button className='closeImport' onClick={onClose}>
                &times;
            </button>
            <h2>Import Students</h2>
            <div className="file-input">
            <input type="file" id="fileInput" />
        </div>
        <div id="file-name"></div>
        <div className="button-group">
            <button className="import-btn">Import</button>
            <button className="cancel-btn" onClick={onClose}>Cancel</button>
        </div>
        </div>
    </div>
  )
}

export default ImportStudents;