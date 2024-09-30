import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate hook
import "./Login.css";
import { Paper, TextField, Box, Button } from "@mui/material"; // Import Paper and TextField from MUI
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      if (response.data.status === "success") {
        navigate("/dashboard"); // Redirect on successful login
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Invalid credentials");
    }
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
          <h2 className="loginHeader" style={{ fontWeight: "bolder" }}>
            <span style={{ color: "#e4e811" }}>LIC</span>{" "}
            <span style={{ color: "#A83332" }}>Connect</span>
          </h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            value={username}
            fullWidth
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            sx={{ mb: 2 }}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            fullWidth
            sx={{
              backgroundColor: "#A83332",
            }}
          >
            <strong>Login</strong>
          </Button>
        </Paper>
      </Box>
    </>
  );
};

export default Login;
