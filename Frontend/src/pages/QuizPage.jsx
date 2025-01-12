import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { fetchQuestions } from "../services/api";
import tickSound from "../assets/clock-ticking-sound-effect-240503_L7Voi41I.mp3";
import alarmSound from "../assets/race-start-beeps-125125.mp3";
import axios from "axios";
import styled from "styled-components";

const QuizPage = () => {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [time, setTime] = useState(300); // 5 minutes timer
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [profileImage, setProfileImage] = useState("");

  const username = localStorage.getItem("username");
  const email = localStorage.getItem("email");
  const navigate = useNavigate();
  const tickAudioRef = useRef(new Audio(tickSound));
  const alarmAudioRef = useRef(new Audio(alarmSound));

  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      const imageUrl = decoded.profileImage;
      setProfileImage(imageUrl);
    }
  }, []);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data } = await fetchQuestions();
        if (Array.isArray(data)) {
          const shuffledQuestions = shuffleArray(data).slice(0, 15);  // Get only the first 15 questions
          setQuestions(shuffledQuestions);
        } else {
          console.error("Fetched data is not an array");
        }
      } catch (error) {
        console.error("Failed to load questions:", error);
      }
    };
  
    loadQuestions();
  }, []);
  

  useEffect(() => {
    let interval;

    if (isQuizActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
        const tickAudio = tickAudioRef.current;
        tickAudio.pause();
        tickAudio.currentTime = 0;
        tickAudio.play();
      }, 1000);
    } else if (time <= 0) {
      handleSubmit();

      // Play the alarm sound when time is over
      const alarmAudio = alarmAudioRef.current;
      alarmAudio.play();

      // Ensure the alarm stops after 3.5 seconds
      setTimeout(() => {
        alarmAudio.pause();
        alarmAudio.currentTime = 0;
      }, 3500);
    }

    return () => clearInterval(interval);
  }, [isQuizActive, time]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleSubmit = async () => {
    const correctAnswers = {};
    questions.forEach((question) => {
      correctAnswers[question.id] = question.correctChoice;
    });
  
    let score = 0;
    let wrongAnswers = 0;
    let attemptedQuestions = 0;
  
    // Count correct and incorrect answers
    Object.keys(answers).forEach((questionId) => {
      const userAnswer = answers[questionId]?.trim()?.toLowerCase();
      const correctAnswer = correctAnswers[questionId]?.trim()?.toLowerCase();
  
      if (userAnswer === correctAnswer) {
        score += 1;
      } else {
        wrongAnswers += 1;
      }
  
      attemptedQuestions += 1;
    });
  
    const skippedQuestions = questions.length - attemptedQuestions;
  
    try {
      const token = localStorage.getItem("authToken");
      const decoded = jwtDecode(token);
  
      const payload = {
        username: decoded.username,
        score,
        correctAnswers: score, // Use the `score` as the number of correct answers
        wrongAnswers,
        userAnswer: answers,
        attemptedQuestions,
        skippedQuestions,
      };
  
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/submitscore`, payload);
      navigate("/outcome", {
        state: {
          answers,
          score,
          correctAnswers: score, // Consistent with the payload
          wrongAnswers,
          attemptedQuestions,
          skippedQuestions,
        },
      });
    } catch (err) {
      console.error("Failed to submit results:", err);
      alert("Failed to submit your score. Please try again later.");
    }
  };
  

  const handleLogout = () => {
    localStorage.clear();
    setQuestions([]);
    setAnswers({});
    setCurrentQuestionIndex(0);
    setIsQuizActive(false);
    navigate("/auth/login");
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  const toggleQuiz = () => {
    setIsQuizActive((prev) => !prev);
  };

  return (
    <Container>
      <Header>
        <h2>Welcome, {username}</h2>
        {email && <p>Email: {email}</p>}
        {profileImage && <ProfileImage src={profileImage} alt="Profile" />}
      </Header>

      <ClockContainer>
        <ClockText><span>Timer Clock</span></ClockText>
        <DigitalClock>
          <span>{formatTime(time)}</span>
        </DigitalClock>
      </ClockContainer>

      <h1>Quiz</h1>
      <QuestionNumber>
        Question {currentQuestionIndex + 1} of {questions.length || 0}
      </QuestionNumber>

      {currentQuestion ? (
        <Question key={currentQuestion.id}>
          <p>{currentQuestion.questionText}</p>
          {[currentQuestion.choiceA, currentQuestion.choiceB, currentQuestion.choiceC, currentQuestion.choiceD]
            .filter(Boolean)
            .map((choice, index) => (
              <label key={index}>
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  value={choice}
                  checked={answers[currentQuestion.id] === choice}
                  onChange={() => handleAnswerChange(currentQuestion.id, choice)}
                />
                {choice}
              </label>
            ))}
        </Question>
      ) : (
        <p>{questions.length === 0 ? "No questions available" : "Loading question..."}</p>
      )}

      <NavigationButtons>
        {currentQuestionIndex > 0 && (
          <Button onClick={prevQuestion} disabled={!isQuizActive}>
            Previous Question
          </Button>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <Button onClick={nextQuestion} disabled={!isQuizActive}>
            Next Question
          </Button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <Button onClick={handleSubmit} disabled={!isQuizActive}>
            Submit
          </Button>
        )}
      </NavigationButtons>

      <ToggleQuizButton onClick={toggleQuiz}>
        {isQuizActive ? "Stop Quiz" : "Start Quiz"}
      </ToggleQuizButton>

      <LogoutButton onClick={handleLogout}>
        Quit and Logout
      </LogoutButton>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  font-family: Arial, sans-serif;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background-color: rgb(181, 252, 213);
  color: #fff;

  h2 {
    font-size: 24px;
    margin: 0;
    color: rgb(245, 9, 194);
  }

  p {
    font-size: 1rem;
    margin: 0;
  }
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #00b1b0;
  margin-left: 10px;
`;

const ClockContainer = styled.div`
  position: fixed;
  top: 20px;
  
  right: 35px;
  z-index: 1000;
`;
const ClockText = styled.div`
  font-size:20px;
  margin-bottom:10px;
  color: rgb(252, 0, 0);
  font-weight: bold;
`;

const DigitalClock = styled.div`
  background-color: #000;
  padding: 10px 20px;
  border-radius: 8px;
  color:rgb(250, 220, 52);
  font-family: 'Digital-7', monospace;
  font-size: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const QuestionNumber = styled.div`
  font-size: 25px;
  margin: 20px 0;
  text-align: center;
  color: #bd27b0cb;
  font-weight: bolder;
`;

const Question = styled.div`
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  p {
    font-weight: bold;
    font-size: 1.2rem;
    color: #6509fa;
  }

  label {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    font-size: 1.1rem;
    cursor: pointer;

    input[type="radio"] {
      margin-right: 10px;
      cursor: pointer;
    }
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-top: 20px;
`;

const Button = styled.button`
  padding: 12px 25px;
  background-color: rgb(233, 208, 71);
  font-size: 1.1rem;
  color: rgb(236, 63, 63);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;

  &:hover {
    background-color: #c40dca;
    transform: scale(1.02);
  }

  &:disabled {
    background-color: #f8c10a;
    cursor: not-allowed;
    color: #8d75e2;
  }
`;

const ToggleQuizButton = styled.button`
  display: block;
  width: 200px;
  margin: 30px auto;
  padding: 10px;
  background-color: rgb(36, 128, 49);
  font-size: 1.2rem;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: rgb(3, 80, 31);
  }
`;

const LogoutButton = styled.button`
  display: block;
  width: 200px;
  margin: 30px auto;
  padding: 10px;
  background-color: rgb(241, 93, 222);
  font-size: 1.2rem;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #c40dca;
  }
`;

export default QuizPage;
