import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper, TextField, Box, Button, Snackbar, Alert } from "@mui/material";
import axios from "axios";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ username: false, password: false });
  const [openSnackbar, setOpenSnackbar] = useState(false); // State for snackbar visibility
  const [snackbarMessage, setSnackbarMessage] = useState(""); // State for snackbar message

  const handleLogin = async () => {
    if (!username || !password) {
      setError({
        username: !username,
        password: !password,
      });
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/login/", {
        username,
        password,
      });

      if (response.data.status === "success") {
        navigate("/dashboard");
      } else {
        // Show custom error message in the Snackbar
        setSnackbarMessage("Invalid credentials. Please try again.");
        setOpenSnackbar(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setSnackbarMessage("Invalid credentials. Please try again.");
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: "url('images/background.jpg')",
        backgroundSize: "cover",
      }}
    >
      <img
        src="images/lrac_logo-removebg-preview.png"
        alt="logo"
        style={{
          position: "absolute",
          top: "30px",
          left: "10%",
          height: "50px",
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
          <span style={{ color: "#FFD404" }}>LIC</span>{" "}
          <span style={{ color: "#A83332" }}>Connect</span>
        </h2>

        <TextField
          id="username"
          label="Username"
          variant="outlined"
          value={username}
          fullWidth
          onChange={(e) => {
            setUsername(e.target.value);
            setError((prev) => ({ ...prev, username: false }));
          }}
          sx={{ mb: 2 }}
          required
          error={error.username}
          helperText={error.username && "Username is required"}
        />

        <TextField
          id="password"
          label="Password"
          type="password"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
            setError((prev) => ({ ...prev, password: false }));
          }}
          required
          error={error.password}
          helperText={error.password && "Password is required"}
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

      {/* Custom Snackbar for error messages */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} // Snackbar closes automatically after 3 seconds
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // Position of the Snackbar
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity="error"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Login;