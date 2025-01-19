import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Confetti from "react-confetti";

// Styled Components (same as before)
const ResultsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  font-size: 16px;
  th, td {
    border: 1px solid #ddd;
    padding: 8px;
  }
  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }
  tr:nth-child(even) {
    background-color: #f9f9f9;
  }
  tr:hover {
    background-color: #f1f1f1;
    cursor: pointer;
  }
`;

const ExpandableRow = styled.tr`
  background-color: #f0f0f0;
  font-size: 14px;
  padding: 10px;
  display: ${(props) => (props.isExpanded ? "table-row" : "none")};
`;

const ResultsContainer = styled.div`
  background: #c1f3de;
  text-align: center;
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  font-family: Arial, sans-serif;
  color: rgb(9, 68, 231);
`;

const Section = styled.div`
  background: ${(props) => props.bg || "#f0f2f5"};
  margin: 20px 0;
  padding: 20px;
  border-radius: 8px;
`;

const Button = styled.button`
  margin: 10px;
  padding: 12px 25px;
  font-size: 22px;
  background-color:rgb(247, 177, 208);
  color: rgb(241, 0, 133);
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #fc97fc;
  }
`;

const ErrorMessage = styled.p`
  color: rgb(255, 0, 98);
  font-size: 14px;
`;

const ResultDetails = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: #fafafa;

  p {
    margin: 8px 0;
    font-size: 16px;
  }
`;

const ProfilePicture = styled.img`
  display: block;
  margin: 20px auto;
  width: 200px;
  height: 200px;
  border: 2px solid black;
  border-radius: 50%;
  object-fit: cover;
`;

const ResultPage = () => {
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [celebrate, setCelebrate] = useState(false);
  const [celebrationFinished, setCelebrationFinished] = useState(false);
  const [expandedUser, setExpandedUser] = useState(null);
  const [showResults, setShowResults] = useState(false); 
  const [isHighestScorerFetched, setIsHighestScorerFetched] = useState(false);
  const [highestScorer, setHighestScorer] = useState(null);
  const navigate = useNavigate();

  const fetchAllResults = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/results`);
      setAllResults(response.data.results);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Could not fetch all user results.");
    } finally {
      setLoading(false);
    }
  };

  const fetchHighestScorer = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/highestscorer`);
      setHighestScorer(response.data);
      setError("");
      setIsHighestScorerFetched(true);
      triggerConfetti();
    } catch (err) {
      console.error(err);
      setError("Could not fetch the highest scorer details.");
      setHighestScorer(null);
    } finally {
      setLoading(false);
    }
  };

  const triggerConfetti = () => {
    setCelebrate(true);
    setTimeout(() => {
      setCelebrate(false);
      setCelebrationFinished(true);
      navigate("/auth/admin/AdminDashboard");
    }, 12000);
  };

  const handleRowClick = (resultId) => {
    setExpandedUser((prev) => (prev === resultId ? null : resultId)); 
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/auth/login");
  };

  
  const toggleResultsTable = () => {
    setShowResults((prev) => !prev); // Toggle between show and hide
  };

  useEffect(() => {
    fetchAllResults(); 
  }, []);

  return (
    <ResultsContainer>
      <h2>Results Page</h2>
      {celebrate && <Confetti width={window.innerWidth} height={window.innerHeight} />}
      <Section>
        <Button onClick={fetchHighestScorer} disabled={loading}>
          {loading ? "Loading..." : "Get Highest Scorer"}
        </Button>
        {isHighestScorerFetched && highestScorer && !celebrationFinished && (
          <ResultDetails>
            <p><strong>Username:</strong> {highestScorer.username}</p>
            <ProfilePicture src={highestScorer.profileImage} alt="Profile" />
            <p><strong>Score:</strong> {highestScorer.score}</p>
          </ResultDetails>
        )}
      </Section>
      <Section>
        <Button onClick={toggleResultsTable}>
          {showResults ? "Hide All Results" : "Show All Results"}
        </Button>
      </Section>
      {showResults && (
        <Section>
          <h3>All User Results</h3>
          {loading && <p>Loading...</p>}
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <ResultsTable>
            <thead>
              <tr>
                <th>Result ID</th>
                <th>Username</th>
                <th>Score</th>
                <th>Correct Answers</th>
                <th>Wrong Answers</th>
                <th>Attempted Questions</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {allResults.map(result => (
                <React.Fragment key={result.id}>
                  <tr onClick={() => handleRowClick(result.id)}>
                    <td>{result.id}</td>
                    <td>{result.username}</td>
                    <td>{result.score}</td>
                    <td>{result.correctAnswers}</td>
                    <td>{result.wrongAnswers}</td>
                    <td>{result.attemptedQuestions}</td>
                    <td>{new Date(result.createdAt).toLocaleString()}</td>
                  </tr>
                  <ExpandableRow isExpanded={expandedUser === result.id}>
                    <td colSpan="7">
                      {result.userAnswer ? (
                        <div>
                          <h4>User Answers:</h4>
                          {Object.entries(result.userAnswer).map(([questionId, answer], index) => (
                            <div
                              key={questionId}
                              style={{
                                background: index % 2 === 0 ? "#e0f7fa" : "#f1f8e9",
                                borderRadius: "4px",
                                padding: "5px",
                                margin: "4px 0",
                                fontSize: "14px",
                              }}
                            >
                              <strong>Q{questionId}:</strong> {answer}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p>No answers available</p>
                      )}
                    </td>
                  </ExpandableRow>
                </React.Fragment>
              ))}
            </tbody>
          </ResultsTable>
        </Section>
      )}
      <Section bg="#ece9e9">
        <Button onClick={handleLogout}>Logout</Button>
      </Section>
    </ResultsContainer>
  );
};

export default ResultPage;
