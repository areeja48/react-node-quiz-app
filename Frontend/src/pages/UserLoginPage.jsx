import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Corrected import
import styled from "styled-components"; // Using styled-components for styling

const UserLoginPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(""); // State to hold the logged-in username
  const [profileImage, setProfileImage] = useState(""); // State to hold the user's profile image URL
  const navigate = useNavigate(); // Initialize navigate

  // Handle Login Submit
  const handleSubmit = async () => {
    setError("");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed.");
        return;
      }

      const data = await response.json();
      console.log("Login successful:", data);

      // Decode the token to get user info
      const decodedToken = jwtDecode(data.token); // Decode the token
      setLoggedInUser(decodedToken.username); // Set username from decoded token
      setProfileImage(data.profilePicture); // Set the profile picture URL
      localStorage.setItem("authToken", data.token); // Store token for later use
      localStorage.setItem("username", decodedToken.username); // Store username
      localStorage.setItem("profileImage", data.profileImage); // Store profile picture URL

      // Navigate to the QuizPage
      navigate("/auth/login/QuizPage");
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: Unable to reach the server.");
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("profileImage");
    setLoggedInUser(""); // Clear logged-in username
    setProfileImage(""); // Clear profile image URL
    navigate("/auth/login"); // Redirect to login page
  };

  // Navigate to Admin Login Page
  const navigateToAdminLogin = () => {
    navigate("/auth/admin"); // Redirect to Admin Login page
  };

  // Navigate to Welcome Page
  const navigateToWelcomePage = () => {
    navigate("/"); // Redirect to Admin Login page
  };

  // Navigate to Forget Password Page
  const navigateToForgetPassword = () => {
    navigate("/forgetPassword"); // Redirect to Forget Password page
  };

  return (
    <LoginContainer>
      <h2>User Login</h2>
      <input
        type="text"
        placeholder="Full Name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* Login Button */}
      <Button type="button" onClick={handleSubmit}>
        User Login
      </Button>

      {/* Admin Login Button */}
      <Button type="button" onClick={navigateToAdminLogin}>
        Admin Login
      </Button>

      {error && <ErrorText>{error}</ErrorText>}

      {/* Display logged-in user */}
      {loggedInUser && (
        <WelcomeContainer>
          <h3>Welcome, {loggedInUser}!</h3>
          {/* Display profile image */}
          {profileImage && <ProfileImage src={profileImage} alt="Profile" />}
        </WelcomeContainer>
      )}

      {/* Welcome Page */}
      <Button type="button" onClick={navigateToWelcomePage}>
        Welcome Page
      </Button>

      {/* Forget Password Link */}
      <ForgetPasswordLink onClick={navigateToForgetPassword}>
        Forgot Password?
      </ForgetPasswordLink>
    </LoginContainer>
  );
};

// Styled-components (CSS)
const LoginContainer = styled.div`
  background-color: #f4f4f4;
  padding: 30px;
  border-radius: 8px;
  max-width: 400px;
  margin: 40px auto;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;

  h2 {
    font-size: 2rem;
    margin-bottom: 20px;
    color: #333;
  }

  input {
    padding: 10px;
    margin: 10px 0;
    width: 80%;
    border-radius: 5px;
    border: 1px solid #ccc;
    font-size: 16px;
  }
`;

const Button = styled.button`
  background-color: #83f1da;
  color: rgba(20, 4, 253, 0.959);
  padding: 15px;
  border: 2px solid #000;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-align: center;
  width: 100%;
  max-width: 300px;
  margin-bottom: 25px;

  &:hover {
    background-color: #f867cd;
  }
  &.logout {
    background-color: #f44336; /* Red */
  }

  &.logout:hover {
    background-color: #e53935;
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  font-size: 14px;
`;

const WelcomeContainer = styled.div`
  margin-top: 20px;
`;

const ProfileImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  margin-top: 10px;
`;

const ForgetPasswordLink = styled.p`
  color:rgb(0, 17, 255);
  font-size: 20px;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 15px;

  &:hover {
    color:rgb(179, 0, 75);
  }
`;

export default UserLoginPage;

