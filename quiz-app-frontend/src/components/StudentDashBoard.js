import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../axios';

const StudentDashBoard = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    completedExams: 0,
    upcomingExams: 0,
    averageScore: 0,
    highestScore: 0
  });

  useEffect(() => {    const fetchExams = async () => {
      try {
        const res = await axiosInstance.get('/api/exams/available');
        setExams(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setLoading(false);
      }
    };    const fetchSubmissions = async () => {
      try {
        const res = await axiosInstance.get('/api/submissions/student');
        setSubmissions(res.data);
      } catch (err) {
        console.error('Error fetching submissions:', err);
      }
    };    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/api/submissions/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchExams();
    fetchSubmissions();
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <img src="https://randomuser.me/api/portraits/women/28.jpg" alt="User" />
          </div>
          <h3>{user?.name}</h3>
          <span className="user-role">Student</span>
        </div>

        <div className="sidebar-menu">
          <h4 className="mb-3">Dashboard</h4>
          <div className="sidebar-item">
            <button className="sidebar-link active">
              <i className="fas fa-th-large sidebar-icon"></i>
              Overview
            </button>
          </div>
          <div className="sidebar-item">
            <Link to="/available-exams" className="sidebar-link">
              <i className="fas fa-clipboard-list sidebar-icon"></i>
              Available Exams
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/my-submissions" className="sidebar-link">
              <i className="fas fa-check-circle sidebar-icon"></i>
              My Submissions
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/results" className="sidebar-link">
              <i className="fas fa-chart-line sidebar-icon"></i>
              Results & Progress
            </Link>
          </div>
        </div>

        <div className="sidebar-menu">
          <h4 className="mb-3">Account</h4>
          <div className="sidebar-item">
            <Link to="/profile" className="sidebar-link">
              <i className="fas fa-user-circle sidebar-icon"></i>
              Profile
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/settings" className="sidebar-link">
              <i className="fas fa-cog sidebar-icon"></i>
              Settings
            </Link>
          </div>
          <div className="sidebar-item">
            <button className="sidebar-link">
              <i className="fas fa-sign-out-alt sidebar-icon"></i>
              Logout
            </button>
          </div>
        </div>
      </aside>

      <main className="dashboard-content">
        <div className="dashboard-header">
          <div>
            <h1>Student Dashboard</h1>
            <p>Welcome back, {user?.name}. Here's your learning progress.</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stats-item">
            <div className="stats-value">{stats.completedExams}</div>
            <div className="stats-label">Completed Exams</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.upcomingExams}</div>
            <div className="stats-label">Upcoming Exams</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.averageScore}%</div>
            <div className="stats-label">Average Score</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.highestScore}%</div>
            <div className="stats-label">Highest Score</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="dashboard-header mb-4">
              <h2 className="card-title">Available Exams</h2>
              <Link to="/available-exams" className="btn btn-outline">View All</Link>
            </div>
            
            {loading ? (
              <div className="text-center py-3">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading exams...
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-3">
                <div className="mb-3">
                  <i className="fas fa-book-open" style={{ fontSize: '3rem', color: 'var(--gray)' }}></i>
                </div>
                <h3 className="mb-2">No exams available</h3>
                <p>There are no exams available for you at the moment.</p>
              </div>
            ) : (
              <div className="exams-grid">
                {exams.slice(0, 3).map(exam => (
                  <div key={exam._id} className="exam-card">
                    <div className="exam-status active">
                      Active
                    </div>
                    <h3 className="exam-title">{exam.title}</h3>
                    <div className="exam-info">
                      <div className="info-item">
                        <i className="fas fa-user"></i>
                        {exam.teacher.name}
                      </div>
                      <div className="info-item">
                        <i className="fas fa-question-circle"></i>
                        {exam.questionCount} Questions
                      </div>
                      <div className="info-item">
                        <i className="fas fa-clock"></i>
                        {exam.duration} mins
                      </div>
                    </div>
                    <p className="exam-description">{exam.description}</p>
                    <div className="exam-dates">
                      <div className="date-item">
                        <i className="fas fa-calendar-alt"></i>
                        Due: {new Date(exam.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="exam-actions">
                      <Link to={`/take-exam/${exam._id}`} className="btn btn-primary">
                        <i className="fas fa-pen-alt mr-1"></i>
                        Take Exam
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="dashboard-header mb-4">
              <h2 className="card-title">Recent Results</h2>
              <Link to="/results" className="btn btn-outline">View All</Link>
            </div>
            
            {submissions.length === 0 ? (
              <div className="text-center py-3">
                <div className="mb-3">
                  <i className="fas fa-chart-bar" style={{ fontSize: '3rem', color: 'var(--gray)' }}></i>
                </div>
                <h3 className="mb-2">No results yet</h3>
                <p>Take an exam to see your results here.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Exam</th>
                    <th>Date</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.slice(0, 3).map(submission => (
                    <tr key={submission._id}>
                      <td>{submission.exam.title}</td>
                      <td>{new Date(submission.submittedAt).toLocaleDateString()}</td>
                      <td>
                        <strong>{submission.score}%</strong>
                      </td>
                      <td>
                        {submission.score >= 70 ? (
                          <span className="badge badge-success">Passed</span>
                        ) : (
                          <span className="badge badge-secondary">Failed</span>
                        )}
                      </td>
                      <td>
                        <Link to={`/result/${submission._id}`} className="btn btn-sm btn-outline">
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <h2 className="card-title mb-4">Your Progress</h2>
            <div className="score-distribution">
              <h4 className="mb-3">Subject Performance</h4>
              <div className="distribution-item">
                <div className="distribution-label">Math</div>
                <div className="distribution-bar-container">
                  <div className="distribution-bar" style={{ width: '85%' }}></div>
                </div>
                <div className="distribution-count">85%</div>
              </div>
              <div className="distribution-item">
                <div className="distribution-label">Science</div>
                <div className="distribution-bar-container">
                  <div className="distribution-bar" style={{ width: '72%' }}></div>
                </div>
                <div className="distribution-count">72%</div>
              </div>
              <div className="distribution-item">
                <div className="distribution-label">English</div>
                <div className="distribution-bar-container">
                  <div className="distribution-bar" style={{ width: '90%' }}></div>
                </div>
                <div className="distribution-count">90%</div>
              </div>
              <div className="distribution-item">
                <div className="distribution-label">History</div>
                <div className="distribution-bar-container">
                  <div className="distribution-bar" style={{ width: '65%' }}></div>
                </div>
                <div className="distribution-count">65%</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashBoard;