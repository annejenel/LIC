import React, { useState } from 'react'
import './AddNewSem.css';
const AddNewSem = ({ isOpen, onClose}) => {
    // const [year, setYear] = useState('');
    // const [sem, setSem] = useState('');
    // const [error, setError] = useState('');
    if (!isOpen) return null;
    
  return (
    <div className='containerNewSem'>
        <div className='contentNewSem'>
            <button className='modal-close' onClick={onClose}>
                &times;
            </button>
            <h2>New Semester</h2>
            <form>
                <div>
                    <label htmlFor="year">
                        <input type="text" placeholder='e.g. 2024-2025'/>
                    </label>
                </div>
                <div>
                    <label htmlFor="Semester">
                    <select name="semester" id="sem">
                        <option value="firstsem">First Semester</option>
                        <option value="secondsem">Second Semester</option>
                        <option value="midyear">Midyear</option>
                    </select>
                    </label>
                </div>
                <button type='submit'>Add new semester</button>
            </form>
        </div>
    </div>
  )
}

export default AddNewSem;