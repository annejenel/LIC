import axios from "axios";
import { useNavigate } from "react-router-dom";
import { getCookie } from '../utils/utils';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve the token from local storage
      const csrfToken = getCookie("csrftoken"); // Get CSRF token

      await axios.post(
        "http://localhost:8000/api/logout/",
      {},
      {
        headers: {
          Authorization: `Token ${token}`, // Include the token in the Authorization header
          "X-CSRFToken": csrfToken,
      },
    }
  ); 

  if (Response.status === 200) {
    localStorage.removeItem("token"); // Remove the token from local storage
    navigate("/login");
  } else {
    console.error("Logout failed:", response.data);
  }
    
    } catch (error) {
      if (error.response) {
        console.error("Logout failed:", error.response.data);
      } else {
        console.error("Logout error:", error.message);
      }
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;