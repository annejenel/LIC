import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Login.css";
import { Paper, TextField, Box, Button } from "@mui/material"; // Import Paper and TextField from MUI
//eyyy
const Login = () => {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/dashboard");
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height for centering vertically
          backgroundImage: "url('images/background.jpg')",
          backgroundSize: "cover",
        }}
      >
        <img
          src="images/lrac_logo-removebg-preview.png"
          alt="logo"
          style={{
            // objectFit: 'contain',
            position: "absolute",
            top: "30px",
            left: "10%",
            width: "auto", // Maintain original aspect ratio
            height: "50px", // Set desired height

            // Adjust size as needed
          }}
        />
        <Paper
          elevation={4}
          sx={{
            padding: 3,
            maxWidth: 350,
            borderRadius: 2,
            height: 300,
          }}
        >
          <h2 className="loginHeader">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleLogin} fullWidth>
            <strong>Login</strong>
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
