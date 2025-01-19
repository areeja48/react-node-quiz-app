import React, { useState } from "react";
import axios from "axios";
import styled from "styled-components";

// Styled Components
const Heading = styled.h2`
  margin-left: 90px;
  margin-bottom: 25px;
  font-size: 2.2rem;
  color:rgb(1, 17, 7);
  font-weight: bold;
  letter-spacing: 0.8px;
`;

const Label = styled.label`
  font-weight: bold;
  font-size: 1.5rem;
  color: #34495e;
  margin-bottom: 10px;
  display: block;
`;

const Input = styled.input`
  padding: 16px;
  font-size: 1.125rem;
  border-radius: 8px;
  border: 1.5px solid #d1d5db;
  background-color: #f9fbfd;
  width: 100%;
  margin-bottom: 20px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #3498db;
    background-color: #ffffff;
    box-shadow: 0 0 8px rgba(52, 152, 219, 0.4);
  }
`;

const SubmitButton = styled.button`
  padding: 14px 24px;
  background-color: #1abc9c;
  color: white;
  font-size: 1.125rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease, transform 0.2s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #16a085;
    transform: translateY(-3px);
  }

  &:disabled {
    background-color: #bdc3c7;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const AddQuestionForm = () => {
  const [formData, setFormData] = useState({
    questionText: "",
    choiceA: "",
    choiceB: "",
    choiceC: "",
    choiceD: "",
    correctChoice: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/questions`, formData);
      if (response.status === 200) {
        alert("Question added successfully!");
        setFormData({
          questionText: "",
          choiceA: "",
          choiceB: "",
          choiceC: "",
          choiceD: "",
          correctChoice: "",
        });
      }
    } catch (error) {
      console.error("Error adding question:", error);
      alert("Failed to add question.");
    }
  };

  return (
    <div>
      <Heading>Add New Question</Heading>
      <form onSubmit={handleSubmit}>
        <Label>Question</Label>
        <Input
          type="text"
          name="questionText"
          placeholder="Enter your question"
          value={formData.questionText}
          onChange={handleInputChange}
          required
        />

        <Label>Choice A</Label>
        <Input
          type="text"
          name="choiceA"
          placeholder="Choice A"
          value={formData.choiceA}
          onChange={handleInputChange}
          required
        />

        <Label>Choice B</Label>
        <Input
          type="text"
          name="choiceB"
          placeholder="Choice B"
          value={formData.choiceB}
          onChange={handleInputChange}
          required
        />

        <Label>Choice C</Label>
        <Input
          type="text"
          name="choiceC"
          placeholder="Choice C"
          value={formData.choiceC}
          onChange={handleInputChange}
          required
        />

        <Label>Choice D</Label>
        <Input
          type="text"
          name="choiceD"
          placeholder="Choice D"
          value={formData.choiceD}
          onChange={handleInputChange}
          required
        />

        <Label>Correct Choice</Label>
        <Input
          type="text"
          name="correctChoice"
          placeholder="Enter correct choice (A, B, C, or D)"
          value={formData.correctChoice}
          onChange={handleInputChange}
          required
        />

        <SubmitButton type="submit">Add Question</SubmitButton>
      </form>
    </div>
  );
};

export default AddQuestionForm;
