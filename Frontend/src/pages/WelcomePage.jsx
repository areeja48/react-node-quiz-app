import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Confetti from 'react-confetti'; // Importing react-confetti
import axios from 'axios'; // Importing axios for API calls

// Styled Components
const WelcomeContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  color: #f70c0c;
  text-align: center;
  padding: 20px;
  position: relative; /* Required to position the shapes */
  background: url('your-image-url.jpg') no-repeat center center/cover; /* Image as background */
  background-size: cover;
  background-position: center;

  /* Creating the background shapes */
  &::before, &::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    animation: moveShapes 8s ease-in-out infinite, changeColors 12s ease-in-out infinite;
    opacity: 0.7;  /* Slight opacity for better visibility */
  }

  /* First Ball */
  &::before {
    width: 70px;
    height: 70px;
    background: rgb(255, 38, 0); /* Initial Color: Orange */
    top: 20%;
    left: 10%;
    animation-duration: 12s; /* Different speed for variation */
  }

  /* Second Ball */
  &::after {
    width: 45px;
    height: 45px;
    background: rgb(8, 24, 247); /* Initial Color: Blue */
    top: 60%;
    right: 15%;
    animation-duration: 16s; /* Different speed for variation */
  }

  /* Animation for Moving Shapes */
  @keyframes moveShapes {
    0% {
      transform: translate(0, 0);
    }
    25% {
      transform: translate(300px, 200px);
    }
    50% {
      transform: translate(0, 400px);
    }
    75% {
      transform: translate(-300px, -200px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  /* Animation for Changing Colors */
  @keyframes changeColors {
    0% {
      background-color: rgb(255, 38, 0); /* Initial Color for First Ball */
    }
    25% {
      background-color: rgb(255, 204, 0); /* Yellow */
    }
    50% {
      background-color: rgb(0, 204, 255); /* Light Blue */
    }
    75% {
      background-color: rgb(255, 0, 255); /* Magenta */
    }
    100% {
      background-color: rgb(255, 38, 0); /* Back to Initial Color */
    }
  }

  /* Responsive adjustments */
  @media (max-width: 768px) {
    &::before {
      width: 120px;
      height: 120px;
      top: 10%;
      left: 20%;
      animation-duration: 10s; /* Faster animation */
      background: rgb(97, 16, 248); /* Initial Color: Purple */
    }

    &::after {
      width: 100px;
      height: 100px;
      top: 50%;
      right: 10%;
      animation-duration: 14s; /* Faster animation */
      background: rgb(244, 67, 54); /* Initial Color: Red */
    }
  }

  @media (max-width: 480px) {
    &::before {
      width: 80px;
      height: 80px;
      top: 25%;
      left: 25%;
      background: rgb(255, 193, 7); /* Initial Color: Yellow */
    }

    &::after {
      width: 60px;
      height: 60px;
      top: 65%;
      right: 5%;
      background: rgb(0, 188, 212); /* Initial Color: Cyan */
    }
  }
`;

const WelcomeContent = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100%;
  max-height: 400px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: none;
  border-radius: 8px;

  @media (max-width: 768px) {
    max-width: 100%;
    max-height: 100%;
    padding: 15px;
  }
`;

const WelcomeTitle = styled.h1`
  font-size: 40px;
  margin-bottom: 20px;
  font-weight: bold;
  color: #13100efa;
  animation: scaleColorChange 10s ease-in-out infinite;

  @keyframes scaleColorChange {
    0% {
      transform: scale(1);
      color: #13100efa;
    }
    25% {
      transform: scale(1.3);
      color: #ff5733;
    }
    50% {
      transform: scale(1.6);
      color: rgb(51, 65, 255);
    }
    75% {
      transform: scale(1.3);
      color: #ff33ff;
    }
    100% {
      transform: scale(1);
      color: #1e90ff;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const WelcomeDescription = styled.p`
  font-weight: 400;
  margin-bottom: 30px;
  animation: glow 8.5s ease-in-out infinite alternate;

  @keyframes glow {
    0% {
      color: #ff5733;
    }
    25% {
      color: rgb(97, 16, 248);
      text-shadow: 0 0 5px #33ff57;
    }
    50% {
      color: #ff33ff;
    }
    75% {
      color: rgb(255, 38, 0);
    }
    100% {
      color: #1e90ff;
    }
  }

  @media (max-width: 1920px) {
    font-size: 25px;
  }

  @media (max-width: 768px) {
    font-size: 20px;
  }

  @media (max-width: 340px) {
    font-size: 10px;
  }
`;

const WelcomeButtons = styled.div`
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  justify-content: center;

  @media (max-width: 768px) {
    gap: 10px;
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 15px;
  font-size: 20px;
  width: 300px;
  border-radius: 10px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #2980b9;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    padding: 10px 20px;
  }
`;

const StartQuizButton = styled(Button)`
  background-color: rgb(182, 119, 241);
  color: #000;

  &:hover {
    background-color: rgb(101, 174, 223);
  }
`;

const LoginButton = styled(Button)`
  background-color: #4bac5b;
  color: rgb(0, 0, 0);

  &:hover {
    background-color: #c1c9df;
  }
`;

const AdminButton = styled(Button)`
  background-color: #24bbe0;
  color: rgb(10, 31, 128);

  &:hover {
    background-color: #1cf5d1;
    color: rgb(243, 34, 34);
  }
`;

const HighestScoreButton = styled(Button)`
  background-color: #f1c40f;
  color: #000;

  &:hover {
    background-color: #f39c12;
  }
`;

const HighestScorerInfo = styled.div`
  margin-top: 30px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  background-color: #f9f9f9;
  text-align: center;
  width: 80%; /* Limit the width to avoid stretching */
  max-width: 400px;
  margin-bottom: 40px; /* Add space after the highest scorer section */
`;

const HighestScorerImage = styled.img`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover; /* Ensure the image fits inside the circle */
  margin-bottom: 10px;
`;

const HighestScorerName = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: #333;
`;

const HighestScorerScore = styled.p`
  font-size: 1.2rem;
  color: #555;
`;

// Main Component with fetching logic
const WelcomePage = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [highestScorer, setHighestScorer] = useState(null); // To store highest scorer details
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStartQuiz = () => {
    navigate('/auth/login');
  };

  const handlePracticeQuestions = () => {
    navigate('/PracticeQuestions');
  };

  const handleUserSignup = () => navigate('/auth/signup');

  const handleAdminLogin = () => {
    navigate('/auth/admin');
  };

  const handleFetchHighestScore = async () => {
    setLoading(true);
    setShowConfetti(true); // Show confetti when fetching the highest scorer
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/highestscorer`);
      setHighestScorer(response.data); // Assuming the response contains name, score, and image
      setError('');
      setTimeout(() => {
        setShowConfetti(false); // Hide confetti after 8 seconds
        setHighestScorer(null); // Hide highest scorer's image after confetti
      }, 8000);
    } catch (err) {
      console.error("Error fetching highest scorer:", err);
      setError("Could not fetch the highest scorer details.");
      setHighestScorer(null);
      setTimeout(() => {
        setShowConfetti(false); // Hide confetti after 8 seconds
        setHighestScorer(null); // Hide highest scorer's image after confetti
      }, 8000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WelcomeContainer>
      <WelcomeContent>
        {/* Display Highest Scorer info at the top */}
        {highestScorer && (
          <HighestScorerInfo>
            <HighestScorerImage src={highestScorer.profileImage} alt="Highest Scorer" />
            <HighestScorerName>{highestScorer.username}</HighestScorerName>
            <HighestScorerScore>Score: {highestScorer.score}</HighestScorerScore>
          </HighestScorerInfo>
        )}

        <WelcomeTitle>Welcome to Quiz App</WelcomeTitle>
        <WelcomeDescription>
          Ready to test your knowledge? Let's Practice or start a quiz. Click on New User Signup Button, then Start Quiz Button.
        </WelcomeDescription>
        <WelcomeButtons>
          <StartQuizButton onClick={handlePracticeQuestions}>Practice Questions</StartQuizButton>
          <LoginButton onClick={handleStartQuiz}>Start Quiz</LoginButton>
          <AdminButton onClick={handleAdminLogin}>Admin Login</AdminButton>
          <AdminButton onClick={handleUserSignup}>New User Signup</AdminButton>
          <HighestScoreButton onClick={handleFetchHighestScore}>Fetch Highest Scorer</HighestScoreButton>
        </WelcomeButtons>
      </WelcomeContent>
      {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} />} {/* Confetti effect */}
    </WelcomeContainer>
  );
};

export default WelcomePage;
