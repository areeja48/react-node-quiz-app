import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const ForgetPasswordPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [step, setStep] = useState(1); // Step 1: Generate OTP, Step 2: Reset Password
  const navigate = useNavigate();

  const handleGenerateOtp = async () => {
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/generateOtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to send OTP.");
        return;
      }

      const data = await response.json();
      setMessage(data.message || "OTP has been sent to your email.");
      setStep(2); // Move to Reset Password step
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: Unable to reach the server.");
    }
  };

  const handleResetPassword = async () => {
    setError("");
    setMessage("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/reset`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, otp, newPassword }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.message || "Failed to reset password.");
        return;
      }

      const data = await response.json();
      setMessage(data.message || "Password has been successfully reset.");
      setStep(1); // Go back to the first step
    } catch (err) {
      console.error("Network error:", err);
      setError("Network error: Unable to reach the server.");
    }
  };

  const navigateToLogin = () => {
    navigate("/auth/login");
  };

  return (
    <ForgetPasswordContainer>
      <h2>{step === 1 ? "Forgot Password" : "Reset Password"}</h2>
      
      {step === 1 && (
        <>
          <Input
            type="username"
            placeholder="Enter your full name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="button" onClick={handleGenerateOtp}>
            Generate OTP
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Input
            type="username"
            placeholder="Enter Full Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Enter New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button type="button" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </>
      )}

      {error && <ErrorText>{error}</ErrorText>}
      {message && <SuccessText>{message}</SuccessText>}

      <BackToLoginLink onClick={navigateToLogin}>Back to Login</BackToLoginLink>
    </ForgetPasswordContainer>
  );
};

// Styled-components (CSS)
const ForgetPasswordContainer = styled.div`
  background-color:rgb(250, 243, 243);
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
`;

const Input = styled.input`
  padding: 10px;
  margin: 10px 0;
  width: 80%;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;

  &:focus {
    border-color: #007bff;
    outline: none;
  }
`;

const Button = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  width: 100%;
  max-width: 300px;
  margin: 10px auto;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorText = styled.p`
  color: #f44336;
  font-size: 14px;
`;

const SuccessText = styled.p`
  color: #4caf50;
  font-size: 14px;
`;

const BackToLoginLink = styled.p`
  color: #007bff;
  font-size: 20px;
  cursor: pointer;
  text-decoration: underline;
  margin-top: 15px;

  &:hover {
    color: #0056b3;
  }
`;

export default ForgetPasswordPage;
