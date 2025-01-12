import React from "react";
import { Routes, Route } from "react-router-dom";
import WelcomePage from "./pages/WelcomePage";
import UserLoginPage from "./pages/UserLoginPage";
import AdminLoginPage from "./pages/AdminLoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import AddQuestionForm from "./pages/AddQuestionForm";
import SignupPage from "./pages/SignupPage";
import QuizPage from "./pages/QuizPage";
import OutcomePage from "./pages/OutcomePage";
import ProtectedRoute from "./components/ProtectedRoute";
import ResultPage from "./pages/ResultPage";
import PracticeQuestions from "./pages/PracticeQuestions";
import UserCommentsPage from './pages/UserCommentsPage';
import ForgetPassword from "./pages/ForgetPassword";
import "./App.css"; // Global CSS file

const App = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/" element={<WelcomePage />} />
    <Route path="/auth/login" element={<UserLoginPage />} />
    <Route path="/auth/admin" element={<AdminLoginPage />} />
    <Route path="/auth/signup" element={<SignupPage />} />
    <Route path="/PracticeQuestions" element={<PracticeQuestions />} />
    <Route path="/forgetPassword" element={<ForgetPassword />} />
    <Route path="/usercomments" element={<UserCommentsPage />} />
    <Route path="/auth/login/QuizPage" element={<QuizPage />} />
    <Route path="/quiz" element={<QuizPage />} />
    <Route path="/outcome" element={<OutcomePage />} />

    {/* Protected Admin Routes */}
    <Route
      path="/auth/admin/AddQuestionForm"
      element={
        <ProtectedRoute>
          <AddQuestionForm />
        </ProtectedRoute>
      }
    />
    <Route
      path="/auth/admin/results"
      element={
        <ProtectedRoute>
          <ResultPage />
        </ProtectedRoute>
      }
    />
    <Route
      path="/auth/admin/Admindashboard"
      element={
        <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    />
  </Routes>
);

export default App;
