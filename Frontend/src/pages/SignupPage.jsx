import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';

const FormContainer = styled.form`
  background-color: #eff0e1c2;
  border-radius: 15px;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  padding: 40px;
  width: 100%;
  max-width: 515px;
  text-align: center;
  position: relative;
`;

const FormHeader = styled.h1`
  font-size: 28px;
  color: #6a11cb;
  margin-bottom: 20px;
  font-weight: 600;
`;

const InputField = styled.input`
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 15px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2575fc;
    box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
  }
`;

const SelectField = styled.select`
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-sizing: border-box;
  font-size: 15px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #2575fc;
    box-shadow: 0 0 5px rgba(37, 117, 252, 0.5);
  }
`;

const FileButton = styled.input`
  border: none;
  padding: 0;
  &::file-selector-button {
    background-color: #6a11cb;
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 8px 15px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }

  &::file-selector-button:hover {
    background-color: #2575fc;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #6a11cb, #2575fc);
  color: #ffffff;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-top: 15px;
  transition: transform 0.3s ease, background-color 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    background: linear-gradient(135deg, #5a0fb0, #1d64d2);
  }
`;

const SuccessMessage = styled.p`
  color: green;
  margin-top: 10px;
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 12px;
  margin-top: -10px;
`;

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    contactno: '',
    gender: '',
    city: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  // 🎯 Automatically update avatar preview when gender changes
  useEffect(() => {
    if (formData.gender === 'Male') {
      setAvatar('https://res.cloudinary.com/dgves86wu/image/upload/v1737442237/Male_hrnqaz.png');
    } else if (formData.gender === 'Female') {
      setAvatar('https://res.cloudinary.com/dgves86wu/image/upload/v1737442362/Female_qfjp6p.png');
    } else {
      setAvatar('');
    }
  }, [formData.gender]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => {
      const updatedData = { ...prevData, [name]: value };

      // Validate password match
      if (updatedData.password === updatedData.confirmPassword) {
        setPasswordsMatch(true);
      } else {
        setPasswordsMatch(false);
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/register`,
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setSuccessMessage('Signup successful! Redirecting to login...');
      setTimeout(() => navigate('/auth/login'), 2000);
    } catch (err) {
      console.error(err.response?.data?.error || 'Signup failed');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormHeader>Signup Page</FormHeader>
      <InputField
        type="text"
        name="username"
        placeholder="Full Name"
        value={formData.username}
        onChange={handleInputChange}
        required
      />
      <InputField
        type="text"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <InputField
        type="password"
        name="password"
        placeholder="Password"
        value={formData.password}
        onChange={handleInputChange}
        required
      />
      <InputField
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChange={handleInputChange}
        required
      />
      {!passwordsMatch && <ErrorMessage>Passwords do not match!</ErrorMessage>}
      <InputField
        type="text"
        name="contactno"
        placeholder="Contact No"
        value={formData.contactno}
        onChange={handleInputChange}
        required
      />
      <SelectField
        name="gender"
        value={formData.gender}
        onChange={handleInputChange}
        required
      >
        <option value="" disabled>Select Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
      </SelectField>
      <InputField
        type="text"
        name="city"
        placeholder="City"
        value={formData.city}
        onChange={handleInputChange}
        required
      />
      <SubmitButton type="submit" disabled={!passwordsMatch}>Signup</SubmitButton>
      {successMessage && <SuccessMessage>{successMessage}</SuccessMessage>}
      {avatar && (
        <img
          src={avatar}
          alt="Avatar Preview"
          style={{ width: 100, height: 100, borderRadius: '50%', marginTop: '15px' }}
        />
      )}
    </FormContainer>
  );
};
export default SignupPage;
