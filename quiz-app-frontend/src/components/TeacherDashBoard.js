import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../axios';

const TeacherDashBoard = () => {
  const { user } = useContext(AuthContext);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    totalSubmissions: 0,
    averageScore: 0
  });

  useEffect(() => {    const fetchExams = async () => {
      try {
        const res = await axiosInstance.get('/api/exams/teacher');
        setExams(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching exams:', err);
        setLoading(false);
      }
    };    const fetchStats = async () => {
      try {
        const res = await axiosInstance.get('/api/exams/stats');
        setStats(res.data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      }
    };

    fetchExams();
    fetchStats();
  }, []);

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <div className="user-info">
          <div className="user-avatar">
            <img src="https://randomuser.me/api/portraits/men/42.jpg" alt="User" />
          </div>
          <h3>{user?.name}</h3>
          <span className="user-role">Teacher</span>
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
            <Link to="/exams" className="sidebar-link">
              <i className="fas fa-file-alt sidebar-icon"></i>
              My Exams
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/create-exam" className="sidebar-link">
              <i className="fas fa-plus-circle sidebar-icon"></i>
              Create Exam
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/students" className="sidebar-link">
              <i className="fas fa-user-graduate sidebar-icon"></i>
              Students
            </Link>
          </div>
          <div className="sidebar-item">
            <Link to="/analytics" className="sidebar-link">
              <i className="fas fa-chart-bar sidebar-icon"></i>
              Analytics
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
            <h1>Teacher Dashboard</h1>
            <p>Welcome back, {user?.name}. Here's what's happening with your exams.</p>
          </div>
          <Link to="/create-exam" className="btn btn-primary">
            <i className="fas fa-plus mr-2"></i>
            Create New Exam
          </Link>
        </div>

        <div className="stats-container">
          <div className="stats-item">
            <div className="stats-value">{stats.totalExams}</div>
            <div className="stats-label">Total Exams</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.totalStudents}</div>
            <div className="stats-label">Students</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.totalSubmissions}</div>
            <div className="stats-label">Submissions</div>
          </div>
          <div className="stats-item">
            <div className="stats-value">{stats.averageScore}%</div>
            <div className="stats-label">Average Score</div>
          </div>
        </div>

        <div className="card mb-4">
          <div className="card-body">
            <div className="dashboard-header mb-4">
              <h2 className="card-title">Recent Exams</h2>
              <Link to="/exams" className="btn btn-outline">View All</Link>
            </div>
            
            {loading ? (
              <div className="text-center py-3">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Loading exams...
              </div>
            ) : exams.length === 0 ? (
              <div className="text-center py-3">
                <div className="mb-3">
                  <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: 'var(--gray)' }}></i>
                </div>
                <h3 className="mb-2">No exams created yet</h3>
                <p className="mb-3">Create your first exam to get started.</p>
                <Link to="/create-exam" className="btn btn-primary">
                  <i className="fas fa-plus mr-2"></i>
                  Create Exam
                </Link>
              </div>
            ) : (
              <div className="exams-grid">
                {exams.slice(0, 3).map(exam => (
                  <div key={exam._id} className="exam-card">
                    <div className={`exam-status ${exam.status.toLowerCase()}`}>
                      {exam.status}
                    </div>
                    <h3 className="exam-title">{exam.title}</h3>
                    <div className="exam-info">
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
                        Start: {new Date(exam.startDate).toLocaleDateString()}
                      </div>
                      <div className="date-item">
                        <i className="fas fa-calendar-check"></i>
                        End: {new Date(exam.endDate).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="exam-actions">
                      <Link to={`/edit-exam/${exam._id}`} className="btn btn-sm btn-outline">
                        <i className="fas fa-edit mr-1"></i>
                        Edit
                      </Link>
                      <Link to={`/exam-results/${exam._id}`} className="btn btn-sm btn-primary">
                        <i className="fas fa-chart-bar mr-1"></i>
                        Results
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Recent Activity</h2>
                <div className="list-group">
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">Math Quiz Completed</h5>
                        <small>15 students have taken the quiz</small>
                      </div>
                      <span className="badge badge-info">New Results</span>
                    </div>
                  </div>
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">Physics Exam Published</h5>
                        <small>2 days ago</small>
                      </div>
                      <span className="badge badge-success">Published</span>
                    </div>
                  </div>
                  <div className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="mb-1">Chemistry Test Updated</h5>
                        <small>Added 5 new questions</small>
                      </div>
                      <span className="badge badge-secondary">Updated</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-body">
                <h2 className="card-title">Top Performing Students</h2>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Exams</th>
                      <th>Avg. Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>John Smith</td>
                      <td>5</td>
                      <td>95%</td>
                    </tr>
                    <tr>
                      <td>Sarah Johnson</td>
                      <td>4</td>
                      <td>92%</td>
                    </tr>
                    <tr>
                      <td>Michael Brown</td>
                      <td>6</td>
                      <td>88%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div className="card mt-4">
          <div className="card-body">
            <h2 className="card-title">Quick Actions</h2>
            <div className="d-flex flex-wrap">
              <Link to="/create-exam" className="btn btn-primary mr-2 mb-2">
                <i className="fas fa-plus mr-2"></i>
                New Exam
              </Link>
              <Link to="/import-questions" className="btn btn-outline mr-2 mb-2">
                <i className="fas fa-file-import mr-2"></i>
                Import Questions
              </Link>
              <Link to="/invite-students" className="btn btn-outline mr-2 mb-2">
                <i className="fas fa-user-plus mr-2"></i>
                Invite Students
              </Link>
              <Link to="/reports" className="btn btn-outline mb-2">
                <i className="fas fa-download mr-2"></i>
                Export Reports
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TeacherDashBoard;