import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Adjust if it's not the default import
import styled from "styled-components";
import axios from "axios";

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  text-align: center;
  background-color: #f7f7f7;
  border-radius: 10px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Heading = styled.h2`
  font-size: 2rem;
  color: #e41587;
  margin-bottom: 30px;
`;

const StyledButton = styled.button`
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
`;

const ErrorMessage = styled.p`
  color: #ff6b6b;
  font-size: 14px;
  margin-top: 10px;
`;

const LogoutButton = styled(StyledButton)`
  background-color: rgb(107, 187, 252);
  color: #000;

  &:hover {
    background-color: rgb(223, 90, 101);
  }
`;

const UserCommentsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 30px;
  border: 1px solid #ddd; /* Border around the whole table */
`;

const TableHeader = styled.th`
  padding: 10px;
  background-color: #f4f4f4;
  border: 1px solid #ddd; /* Border for header cells */
  text-align: left;
`;

const TableData = styled.td`
  padding: 10px;
  border: 1px solid #ddd; /* Border for data cells */
`;

const UserCommentsButton = styled(StyledButton)`
  background-color: #ffdd57;
  color: #000;

  &:hover {
    background-color: #ffb300;
  }
`;

// AdminDashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);
  const [error, setError] = useState("");
  const [comments, setComments] = useState([]);
  const [showComments, setShowComments] = useState(false); // State to toggle table view

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log("Decoded Token:", decoded);

        if (decoded.role) {
          setRole(decoded.role);
        } else {
          console.error("Role is missing in the token.");
          setError("Invalid token. Please log in again.");
          navigate("/auth/login");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
        setError("Session expired. Please log in again.");
        navigate("/auth/login");
      }
    } else {
      console.log("No token found, redirecting to login...");
      setError("You must log in to access the admin dashboard.");
      navigate("/auth/login");
    }
  }, [navigate]);

  useEffect(() => {
    if (role && role !== "admin") {
      console.log("Unauthorized role:", role, "Redirecting to login...");
      setError("Unauthorized access. Admins only.");
      navigate("/auth/login");
    }
  }, [role, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth/admin");
  };

  const handleAddQuestion = () => navigate("/auth/admin/AddQuestionForm");

  const handleResultPage = () => navigate("/auth/admin/results");

  const handleViewComments = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/admin/usercomments`);
      console.log("Full response:", response); // Log the entire response
  
      // Check if the response contains the 'users' array
      if (response.data && Array.isArray(response.data.users)) {
        setComments(response.data.users); // Set the comments (users array)
        setShowComments(true); // Show the comments
      } else {
        setError("Unexpected response format. Comments should be inside 'users' key.");
      }
    } catch (error) {
      console.error("Error fetching comments:", error);
      setError("Failed to fetch user comments.");
    }
  };

  return (
    <DashboardContainer>
      <Heading>Welcome to Admin Dashboard</Heading>
      {error && <ErrorMessage>{error}</ErrorMessage>}

      <StyledButton onClick={handleAddQuestion}>Add Question</StyledButton>
      <StyledButton onClick={handleResultPage}>View Results</StyledButton>
      <UserCommentsButton onClick={handleViewComments}>View User Comments</UserCommentsButton>
      <LogoutButton onClick={handleLogout}>Logout</LogoutButton>

      {/* Display User Comments as Table */}
      {showComments && comments.length > 0 && (
        <UserCommentsTable>
          <thead>
            <tr>
              <TableHeader>User ID</TableHeader>
              <TableHeader>Username</TableHeader>
              <TableHeader>Email</TableHeader>
              <TableHeader>Comment</TableHeader>
              <TableHeader>Created At</TableHeader>
            </tr>
          </thead>
          <tbody>
            {comments.map((comment) => (
              <tr key={comment.userId}>
                <TableData>{comment.userId}</TableData>
                <TableData>{comment.username}</TableData>
                <TableData>{comment.email}</TableData>
                <TableData>{comment.usercomments}</TableData>
                <TableData>{new Date(comment.createdAt).toLocaleString()}</TableData>
              </tr>
            ))}
          </tbody>
        </UserCommentsTable>
      )}
    </DashboardContainer>
  );
};

export default AdminDashboard;
