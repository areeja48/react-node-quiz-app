import axios from 'axios';

const API = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

// Add token to requests (if needed for protected routes)
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Existing API calls
export const login = (credentials) => API.post('/auth/login', credentials);
export const signup = (data) => API.post('/auth/register', data);
export const fetchQuestions = () => API.get('/questions');
export const submitResults = (resultData) => API.post('/results', resultData);
export const fetchResults = () => API.get('/results');

/*
// New function to check answers
export const checkAnswers = (userAnswers) => {
  return API.post('/api/check-answers', { answers: userAnswers });
};
*/