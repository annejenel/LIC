import React from 'react';
import BarChart from './BarChart';
import LineChart from './LineChart';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import axios from 'axios';

const PreviousLineChart = () => {
    const [semester, setSemester] = React.useState('');
    const [year, setYear] = React.useState('');
    const [chartType, setChartType] = React.useState('line'); // New state for chart type
    const [open, setOpen] = React.useState(false);
    const [chartData, setChartData] = React.useState(null);

    const handleChange = (event) => {
        setSemester(event.target.value);
    };

    const handleYearChange = (event) => {
        setYear(event.target.value);
    };

    const handleChartTypeChange = (event) => {
        setChartType(event.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.get('/previous-count/', {
                params: { semester, year },
            });
            setChartData(response.data);  // Assume response contains the data for the charts
            setOpen(false);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{backgroundColor:'#8C383E'}} >Select</Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Enter Past Records</DialogTitle>
                <DialogContent>
                    <DialogContentText>Year</DialogContentText>
                    <TextField
                        autoFocus
                        required
                        margin="dense"
                        id="year"
                        name="year"
                        label="YYYY-YYYY"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={year}
                        onChange={handleYearChange}
                    />
                    <InputLabel id="semester-label">Semester</InputLabel>
                    <Select
                        labelId="semester-label"
                        id="semester"
                        value={semester}
                        onChange={handleChange}
                        label="Semester"
                        sx={{ width: '200px' }}
                    >
                        <MenuItem value=""><em>None</em></MenuItem>
                        <MenuItem value="firstsem">First semester</MenuItem>
                        <MenuItem value="secondsem">Second semester</MenuItem>
                        <MenuItem value="midyear">Midyear</MenuItem>
                    </Select>
                    
                    {/* Dropdown for selecting chart type */}
                    <InputLabel id="chart-type-label">Chart Type</InputLabel>
                    <Select
                        labelId="chart-type-label"
                        id="chart-type"
                        value={chartType}
                        onChange={handleChartTypeChange}
                        label="Chart Type"
                        sx={{ width: '200px', marginTop: '20px' }}
                    >
                        <MenuItem value="line">Line Chart</MenuItem>
                        <MenuItem value="bar">Bar Chart</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Set</Button>
                </DialogActions>
            </Dialog>
            
            <div>
                {chartData && (
                    chartType === 'line' ? (
                        <LineChart data={chartData} />
                    ) : (
                        <BarChart data={chartData} />
                    )
                )}
            </div>
        </div>
    );
};

export default PreviousLineChart;