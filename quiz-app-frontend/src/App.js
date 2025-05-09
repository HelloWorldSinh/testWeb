import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

// Component imports
import Login from './components/Login';
import Register from './components/Register';
import StudentDashBoard from './components/StudentDashBoard';
import TeacherDashBoard from './components/TeacherDashBoard';
import Exam from './components/Exam';
import CreateExam from './components/CreateExam';
import Result from './components/Result';
import HomePage from './components/HomePage';
import './App.css';

// Logo (placeholder)
import logo from './logo.svg';

function App() {
  const { user } = useContext(AuthContext);

  // Protected route component
  const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
      return <Navigate to="/" />;
    }

    return children;
  };

  return (
    <Router>
      <div className="app-container">
        <header className="header">
          <nav className="navbar">
            <Link to="/" className="navbar-brand">
              <img src={logo} alt="Quiz Logo" />
              <h1>QUIZZ</h1>
            </Link>
            <ul className="navbar-nav">
              <li className="nav-item">
                <Link to="/" className="nav-link">Trang chủ</Link>
              </li>
              {user ? (
                <>
                  <li className="nav-item">
                    <Link to={user.role === 'student' ? '/student' : '/teacher'} className="nav-link">
                      Bảng điều khiển
                    </Link>
                  </li>
                  <li className="nav-item">
                    <button 
                      onClick={() => {
                        localStorage.removeItem('user');
                        localStorage.removeItem('token');
                        window.location.href = '/';
                      }} 
                      className="btn btn-outline"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className="nav-link">Đăng nhập</Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className="btn btn-primary">Đăng ký</Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </header>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route 
              path="/student" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <StudentDashBoard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/teacher" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <TeacherDashBoard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/exam/:id" 
              element={
                <ProtectedRoute allowedRoles={['student']}>
                  <Exam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-exam" 
              element={
                <ProtectedRoute allowedRoles={['teacher']}>
                  <CreateExam />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/result/:id" 
              element={
                <ProtectedRoute>
                  <Result />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="text-center py-3">
              &copy; {new Date().getFullYear()} QUIZ - Nền tảng thi trắc nghiệm trực tuyến
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;