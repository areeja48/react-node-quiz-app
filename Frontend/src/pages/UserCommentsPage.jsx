import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Styled components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 50px;
  padding: 20px;
  background-color: #f4f4f4;
  border-radius: 8px;
  width:100%;
  max-width: 800px;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
`;

const Label = styled.label`
  font-size: 16px;
  margin: 10px 0 5px;
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
`;

const Textarea = styled.textarea`
  width: 95%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
  font-size: 16px;
  resize: vertical;
`;

const Button = styled.button`
  padding: 10px 20px;
  margin: 5px;
  margin-bottom: 10px;
  margin-left:25px;
  font-size: 16px;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #45a049;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
`;

const SuccessMessage = styled.p`
  color: green;
  font-size: 14px;
`;

const UserCommentsPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [usercomments, setUsercomments] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate(); // For navigation to the welcome page

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!username || !email || !usercomments) {
      setError('All fields are required');
      return;
    }
  
    try {
      console.log('Sending request to /auth/comments...');
      // Log payload
      const payload = {
        username,
        email,
        usercomments,
      };
      console.log(payload);
  
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/comments`, payload);
  
      // Check the response
      console.log(response.data);
      
      setUsername('');
      setEmail('');
      setUsercomments('');
      setError('');
      setSuccess('Comment submitted successfully!');
    } catch (err) {
      console.error('Error submitting comment:', err);
      setError('An error occurred while saving the comment');
      setSuccess('');
    }
  };
  

  const handleGoBack = () => {
    navigate('/'); // Use navigate hook to back to welcome page. 
  };

  return (
    <Container>
      <Title>User Comments</Title>

      <form onSubmit={handleSubmit}>
        <div>
          <Label>Username</Label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <Label>Email</Label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <Label>Comments</Label>
          <Textarea
            rows="5"
            placeholder='Thanks for your patience! Please share your suggestions for improving this app'
            value={usercomments}
            onChange={(e) => setUsercomments(e.target.value)}
          />
        </div>

        {error && <ErrorMessage>{error}</ErrorMessage>}
        {success && <SuccessMessage>{success}</SuccessMessage>}

        <Button type="submit">Submit Comment</Button>
        <Button type="button" onClick={handleGoBack}>
         Welcome Page
        </Button>
      </form>
    </Container>
  );
};

export default UserCommentsPage;
