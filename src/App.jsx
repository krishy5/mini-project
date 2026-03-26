/**
 * App.jsx - Main Application Component
 * 
 * This is the root component that handles:
 * - Routing between different pages (Home, Login, Dashboards)
 * - Security features (disable dev tools, copy/paste, zoom)
 * - Scroll to top on route change
 */

import './App.css';
import { useEffect } from "react";
import { Routes, Route, useLocation } from 'react-router-dom';

// Import all page components
import Home from './components/Home';
import Login from './components/Login';
import StudentSignup from './components/Student/StudentSignup';
import StudentDashboard from './components/Student/StudentDashboard';
import RecruiterSignup from './components/Recruiter/RecruiterSignup';
import RecruiterLogin from './components/Recruiter/RecruiterLogin';
import RecruiterDashboard from './components/Recruiter/RecruiterDashboard';
import TeacherDashboard from './components/Teacher/TeacherDashboard';

function App() {
  const location = useLocation();

  // Scroll to top whenever route changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Security features - disable dev tools, copy/paste, zoom
  useEffect(() => {
    // Disable zoom by setting viewport meta tag
    const meta = document.createElement('meta');
    meta.name = "viewport";
    meta.content = "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
    document.getElementsByTagName('head')[0].appendChild(meta);

    // Disable text selection, copy, cut, drag, and right-click
    document.addEventListener("selectstart", e => e.preventDefault());
    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("cut", e => e.preventDefault());
    document.addEventListener("dragstart", e => e.preventDefault());
    document.addEventListener("contextmenu", e => e.preventDefault());

    // Block keyboard shortcuts for dev tools and zoom
    const keyBlock = (e) => {
      if (
        e.key === "F12" || // Block F12 (dev tools)
        (e.ctrlKey && e.shiftKey && ["I", "C", "J"].includes(e.key)) || // Block Ctrl+Shift+I/C/J
        (e.ctrlKey && e.key === "U") || // Block Ctrl+U (view source)
        (e.ctrlKey && ["+", "-", "="].includes(e.key)) // Block zoom keys
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener("keydown", keyBlock);
    
    // Cleanup event listener on unmount
    return () => document.removeEventListener("keydown", keyBlock);
  }, []);

  return (
    <>
      {/* Define all application routes */}
      <Routes>
        <Route path="/" element={<Home />} /> {/* Landing page */}
        <Route path="/login" element={<Login />} /> {/* Login page for students/teachers */}
        <Route path="/student/signup" element={<StudentSignup />} /> {/* Student registration */}
        <Route path="/student/dashboard" element={<StudentDashboard />} /> {/* Student dashboard */}
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} /> {/* Teacher dashboard */}
        <Route path="/recruiter/signup" element={<RecruiterSignup />} /> {/* Recruiter registration */}
        <Route path="/recruiter/login" element={<RecruiterLogin />} /> {/* Recruiter login */}
        <Route path="/recruiter/dashboard" element={<RecruiterDashboard />} /> {/* Recruiter dashboard */}
      </Routes>
    </>
  );
}

export default App;
