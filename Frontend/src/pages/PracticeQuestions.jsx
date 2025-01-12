import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQuestions } from "../services/api";
import Confetti from "react-confetti";
import styled from "styled-components";

const PracticeQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [isQuestionAnswered, setIsQuestionAnswered] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const { data } = await fetchQuestions();
        if (Array.isArray(data)) {
          const shuffledQuestions = data.sort(() => Math.random() - 0.5).slice(0, 10);
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
    const handleResize = () => setShowConfetti((prev) => prev);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentQuestion = questions[currentQuestionIndex];

  const handleAnswerSubmit = () => {
    if (!selectedAnswer) {
      alert("Please select an answer before submitting!");
      return;
    }

    const isCorrect = selectedAnswer === currentQuestion.correctChoice;
    setFeedback({
      isCorrect,
      correctAnswer: currentQuestion.correctChoice,
    });
    setIsQuestionAnswered(true);

    if (isCorrect) createConfetti();
  };

  const createConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 9000); // Show for 9 seconds
  };

  const handleNextQuestion = () => {
    setSelectedAnswer("");
    setFeedback(null);
    setIsQuestionAnswered(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      alert("You've reached the end of the practice quiz!");
      navigate("/usercomments"); // Navigate to User Comments page
    }
  };

  const handleUserCommentsPage = () => navigate("/usercomments"); // Navigate to User Comments page

  return (
    <QuizContainer>
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 1000,
          }}
        />
      )}

      <h1>Practice Questions</h1>

      {currentQuestion ? (
        <>
          <h2>Question {currentQuestionIndex + 1}</h2>
          <QuestionText>{currentQuestion.questionText}</QuestionText>

          <QuizOptionsFeedbackContainer>
            <OptionsContainer>
              {[currentQuestion.choiceA, currentQuestion.choiceB, currentQuestion.choiceC, currentQuestion.choiceD]
                .filter(Boolean)
                .map((choice, index) => (
                  <label key={index} className="option-label">
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={choice}
                      checked={selectedAnswer === choice}
                      onChange={() => setSelectedAnswer(choice)}
                      disabled={isQuestionAnswered}
                    />
                    {choice}
                  </label>
                ))}
            </OptionsContainer>

            {feedback && (
              <Feedback className={feedback.isCorrect ? "correct" : "incorrect"}>
                {feedback.isCorrect ? (
                  <p>Correct! Great job!</p>
                ) : (
                  <p>
                    Incorrect. The correct answer is: <strong>{feedback.correctAnswer}</strong>
                  </p>
                )}
              </Feedback>
            )}
          </QuizOptionsFeedbackContainer>

          {!isQuestionAnswered ? (
            <Button onClick={handleAnswerSubmit}>Check Your Answer</Button>
          ) : (
            <Button onClick={handleNextQuestion}>Next   Question</Button>
          )}

          <Button onClick={handleUserCommentsPage}> User Comments Page</Button>
        </>
      ) : (
        <p>Loading questions...</p>
      )}
    </QuizContainer>
  );
};

const QuizContainer = styled.div`
  position: relative;
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f1eceb;
  font-family: Arial, sans-serif;
  text-align: center;
  margin-top: 100px;

  h1,
  h2 {
    color: #c44720;
  }

  @media (max-width: 768px) {
    padding: 15px;
    margin-top: 80px;

    h1 {
      font-size: 24px;
    }
    h2 {
      font-size: 20px;
    }
  }

  @media (max-width: 480px) {
    margin-top: 60px;

    h1 {
      font-size: 20px;
    }
    h2 {
      font-size: 18px;
    }
  }
`;

const QuestionText = styled.p`
  font-size: 29px;
  font-weight: 550;

  @media (max-width: 768px) {
    font-size: 22px;
  }

  @media (max-width: 480px) {
    font-size: 18px;
  }
`;

const QuizOptionsFeedbackContainer = styled.div`
  display: flex;
  justify-content: space-between;
  background: #dcedff;
  align-items: flex-start;
  margin-top: 25px;
  text-align: left;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const OptionsContainer = styled.div`
  flex: 1;
  background: #dcedff;
  max-width: 200px;
  min-width: 200px;
  margin-right: 20px;
  margin-top: 40px;
  text-align: left;

  .option-label {
    display: flex;
    align-items: center;
    margin: 10px 0;
    font-size: 20px;
  }

  input {
    margin-right: 10px;
  }

  @media (max-width: 768px) {
    max-width: 100%;
    margin-right: 0;
  }
`;

const Feedback = styled.div`
  flex: 1;
  margin-left: 20px;
  padding: 10px;
  border-radius: 5px;
  font-size: 14px;

  p {
    font-size: 25px;
    font-weight: 300;
  }

  &.correct {
    background-color: #c1fccf;
    color: #155724;
  }

  &.incorrect {
    background-color: #f7d0d2;
    color: #721c24;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 20px;
    max-width: 100%;
    font-size: 18px;
  }
`;

const Button = styled.button`
  padding: 10px 20px;
  margin-top: 20px;
  margin-left: 19px;
  max-width: 250px;
  font-size: 20px;
  cursor: pointer;
  background-color: rgb(85, 95, 224);
  color: #ffffff;
  border: none;
  border-radius: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #6fb653;
    color: #000;
    border-radius: 20px;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

export default PracticeQuestions;
