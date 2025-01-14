import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

// Background gradient and layout improvements
const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;`;

const Header = styled.h2`
  color: #444;
  margin-bottom: 25px;
  font-size: 35px;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
`;

const Input = styled.input`
  width: 320px;
  padding: 12px;
  margin: 12px 0;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s ease;

  &:focus {
    outline: none;
    border-color: #6c63ff;
    box-shadow: 0 0 8px rgba(108, 99, 255, 0.5);
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

  &:active {
    transform: translateY(1px);
    box-shadow: none;
  }
`;

const ErrorMessage = styled.p`
  color: #d9534f;
  font-size: 15px;
  margin: 10px 0;
  font-weight: bold;
  background: rgba(217, 83, 79, 0.1);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid rgba(217, 83, 79, 0.3);
`;


const AdminLoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/a/admin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Login failed.");
        return;
      }

      const data = await response.json();
      console.log("Admin login successful:", data);

      localStorage.setItem("authToken", data.token);
      navigate("/auth/admin/AdminDashboard");
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: Unable to reach the server.");
    }
  };

  return (
    <LoginContainer>
      <Header>Admin Login</Header>
      <Input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <Input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleSubmit}>Admin Login</Button>
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button onClick={() => navigate("/auth/login")}>User Login</Button>
      <Button onClick={() => navigate("/")}>Welcome Page</Button>
    </LoginContainer>
  );
};

export default AdminLoginPage;
