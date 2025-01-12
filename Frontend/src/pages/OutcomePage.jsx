import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

const OutcomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    score,
    correctAnswers,
    wrongAnswers,
    attemptedQuestions,
    skippedQuestions
  } = location.state || {};

  const handleWelcomePage = () => {
    navigate("/");
  };
  const handleUserComments = () => {
    navigate("/usercomments");
  };

  return (
    <Container>
      <Header>
        <h2>Quiz Result</h2>
      </Header>

      <Score>
        <h3>Your Score: {score}</h3>
        <p>Correct Answers: {correctAnswers}</p>
        <p>Wrong Answers: {wrongAnswers}</p>
        <p>Attempted Questions: {attemptedQuestions}</p>
        <p>Skipped Questions: {skippedQuestions}</p>
      </Score>

      
      <Button type="button" onClick={handleUserComments}>
         User Comments Page
        </Button>
      <Button onClick={handleWelcomePage}>Welcome Page</Button>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
  text-align: center;
  padding: 20px;
  font-size:20px
`;

const Header = styled.div`
  background-color: rgb(181, 252, 213);
  padding: 20px;
  margin-bottom: 20px;
`;

const Score = styled.div`
  margin: 20px 0;
`;

const Button = styled.button`
  padding: 15px 25px;
  background-color: rgb(36, 128, 49);
  color: white;
  border: none;
  margin-left:20px;
  border-radius: 5px;
  font-size: 20px;
  cursor: pointer;

  &:hover {
    background-color: rgb(3, 80, 31);
  }
`;

export default OutcomePage;
