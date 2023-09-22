import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/views/NavBar/NavBar";
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from "./components/views/LoginPage/LoginPage";
import RegisterPage from "./components/views/RegisterPage/RegisterPage";
import Auth from './hoc/auth';

function App() {
  const NewLandingPage = Auth(LandingPage, null)
  const NewLoginPage = Auth(LoginPage, true)
  const NewRegisterPage = Auth(RegisterPage, false)

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route exact path="/" element={<NewLandingPage />} />
        <Route exact path="/login" element={<NewLoginPage />} />
        <Route exact path="/register" element={<NewRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
