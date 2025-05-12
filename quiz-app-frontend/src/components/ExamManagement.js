import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../axios';

const ExamManagement = () => {
    const { id } = useParams();
    const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'participants', 'results'
    const [exam, setExam] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [exportLoading, setExportLoading] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {            try {
                const examResponse = await axiosInstance.get(`/api/exams/${id}`);
                setExam(examResponse.data);
                
                const submissionsResponse = await axiosInstance.get(`/api/submissions/exam/${id}`);
                setSubmissions(submissionsResponse.data);
                setLoading(false);
            } catch (error) {
                setError('Không thể tải thông tin bài thi');
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    const calculateTimeRemaining = () => {
        if (!exam) return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        
        const now = new Date();
        let targetDate;
        let isExpired = false;
        
        // Nếu bài thi chưa bắt đầu, hiển thị thời gian đến khi bắt đầu
        if (new Date(exam.startDate) > now) {
            targetDate = new Date(exam.startDate);
        } 
        // Nếu bài thi đang diễn ra, hiển thị thời gian đến khi kết thúc
        else if (new Date(exam.endDate) > now) {
            targetDate = new Date(exam.endDate);
        } 
        // Nếu bài thi đã kết thúc
        else {
            isExpired = true;
            return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
        }
        
        const difference = targetDate - now;
        
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        
        return { days, hours, minutes, seconds, isExpired };
    };

    const getExamStatus = () => {
        if (!exam) return 'Không xác định';
        
        const now = new Date();
        const startDate = new Date(exam.startDate);
        const endDate = new Date(exam.endDate);
        
        if (now < startDate) {
            return 'Sắp diễn ra';
        } else if (now >= startDate && now <= endDate) {
            return 'Đang diễn ra';
        } else {
            return 'Đã kết thúc';
        }
    };

    const calculateAverageScore = () => {
        if (!submissions || submissions.length === 0) return 0;
        
        const totalScore = submissions.reduce((acc, submission) => acc + submission.score, 0);
        return (totalScore / submissions.length).toFixed(2);
    };

    const exportToCSV = async () => {
        setExportLoading(true);
        
        try {
            // Format data
            const csvHeader = 'Tên học sinh,Điểm số,Thời gian làm bài,Ngày nộp\n';
            const csvRows = submissions.map(submission => {
                const submittedAt = new Date(submission.submittedAt).toLocaleString();
                const timeSpent = `${Math.floor(submission.timeSpent / 60)}:${(submission.timeSpent % 60).toString().padStart(2, '0')}`;
                return `${submission.student.username},${submission.score}/${exam.totalPoints},${timeSpent},${submittedAt}`;
            });
            
            const csvContent = csvHeader + csvRows.join('\n');
            
            // Create Blob and download
            const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.setAttribute('href', url);
            link.setAttribute('download', `${exam.title}_ket_qua.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            alert('Không thể xuất kết quả. Vui lòng thử lại.');
        } finally {
            setExportLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="dashboard-content">
                <div className="text-center my-5">
                    <p>Đang tải thông tin bài thi...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-content">
                <div className="alert alert-danger">
                    {error}
                </div>
            </div>
        );
    }

    const timeRemaining = calculateTimeRemaining();
    const examStatus = getExamStatus();

    return (
        <div className="dashboard">
            <div className="sidebar">
                <h3 className="mb-4">Quản lý bài thi</h3>
                <ul className="sidebar-menu">
                    <li className="sidebar-item">
                        <button 
                            className={`sidebar-link ${activeTab === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveTab('overview')}
                        >
                            <i className="sidebar-icon fas fa-info-circle"></i>
                            Tổng quan
                        </button>
                    </li>
                    <li className="sidebar-item">
                        <button 
                            className={`sidebar-link ${activeTab === 'participants' ? 'active' : ''}`}
                            onClick={() => setActiveTab('participants')}
                        >
                            <i className="sidebar-icon fas fa-users"></i>
                            Người tham gia
                        </button>
                    </li>
                    <li className="sidebar-item">
                        <button 
                            className={`sidebar-link ${activeTab === 'results' ? 'active' : ''}`}
                            onClick={() => setActiveTab('results')}
                        >
                            <i className="sidebar-icon fas fa-chart-bar"></i>
                            Kết quả
                        </button>
                    </li>
                </ul>

                <div className="mt-4">
                    <Link to="/teacher" className="btn btn-outline" style={{ width: '100%' }}>
                        <i className="fas fa-arrow-left"></i> Quay lại
                    </Link>
                </div>
            </div>

            <div className="dashboard-content">
                {/* Tab Tổng quan */}
                {activeTab === 'overview' && (
                    <div className="exam-overview">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>{exam.title}</h2>
                            <span className={`badge ${
                                examStatus === 'Đang diễn ra' ? 'badge-success' : 
                                examStatus === 'Sắp diễn ra' ? 'badge-info' : 'badge-secondary'
                            }`} style={{
                                padding: '8px 12px',
                                borderRadius: 'var(--border-radius)',
                                backgroundColor: examStatus === 'Đang diễn ra' ? '#28a745' : 
                                                 examStatus === 'Sắp diễn ra' ? '#17a2b8' : '#6c757d',
                                color: 'white'
                            }}>
                                {examStatus}
                            </span>
                        </div>
                        
                        {/* Thông tin cơ bản */}
                        <div className="row">
                            <div className="col-md-8">
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h4 className="card-title">Thông tin bài thi</h4>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Mã bài thi:</span>
                                                <strong>{exam.code}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Thời gian làm bài:</span>
                                                <strong>{exam.timeLimit} phút</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Số câu hỏi:</span>
                                                <strong>{exam.questions.length}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Điểm tổng:</span>
                                                <strong>{exam.totalPoints}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Bắt đầu:</span>
                                                <strong>{new Date(exam.startDate).toLocaleString()}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Kết thúc:</span>
                                                <strong>{new Date(exam.endDate).toLocaleString()}</strong>
                                            </li>
                                        </ul>
                                        
                                        {exam.description && (
                                            <div className="mt-3">
                                                <h5>Mô tả:</h5>
                                                <p>{exam.description}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="col-md-4">
                                {/* Counter box */}
                                <div className="card mb-4">
                                    <div className="card-body text-center">
                                        <h4 className="card-title">
                                            {new Date() < new Date(exam.startDate) ? 'Bắt đầu trong:' : 
                                             new Date() < new Date(exam.endDate) ? 'Kết thúc trong:' : 
                                             'Đã kết thúc'}
                                        </h4>
                                        
                                        {!timeRemaining.isExpired && (
                                            <div className="countdown-container">
                                                <div className="countdown-item">
                                                    <div className="countdown-value">{timeRemaining.days}</div>
                                                    <div className="countdown-label">Ngày</div>
                                                </div>
                                                <div className="countdown-item">
                                                    <div className="countdown-value">{timeRemaining.hours}</div>
                                                    <div className="countdown-label">Giờ</div>
                                                </div>
                                                <div className="countdown-item">
                                                    <div className="countdown-value">{timeRemaining.minutes}</div>
                                                    <div className="countdown-label">Phút</div>
                                                </div>
                                                <div className="countdown-item">
                                                    <div className="countdown-value">{timeRemaining.seconds}</div>
                                                    <div className="countdown-label">Giây</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {/* Stats card */}
                                <div className="card mb-4">
                                    <div className="card-body">
                                        <h4 className="card-title">Thống kê nhanh</h4>
                                        <ul className="list-group list-group-flush">
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Số người tham gia:</span>
                                                <strong>{submissions.length}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Điểm trung bình:</span>
                                                <strong>{calculateAverageScore()}</strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Điểm cao nhất:</span>
                                                <strong>
                                                    {submissions.length > 0 
                                                        ? Math.max(...submissions.map(s => s.score)) 
                                                        : 'N/A'}
                                                </strong>
                                            </li>
                                            <li className="list-group-item d-flex justify-content-between">
                                                <span>Điểm thấp nhất:</span>
                                                <strong>
                                                    {submissions.length > 0 
                                                        ? Math.min(...submissions.map(s => s.score)) 
                                                        : 'N/A'}
                                                </strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Người tham gia */}
                {activeTab === 'participants' && (
                    <div className="exam-participants">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Người tham gia - {exam.title}</h2>
                            <span>{submissions.length} người tham gia</span>
                        </div>
                        
                        {submissions.length === 0 ? (
                            <div className="alert alert-info">
                                Chưa có học sinh nào tham gia bài thi này.
                            </div>
                        ) : (
                            <div className="card">
                                <div className="card-body">
                                    <div className="table-responsive">
                                        <table className="table table-hover">
                                            <thead>
                                                <tr>
                                                    <th>#</th>
                                                    <th>Tên học sinh</th>
                                                    <th>Email</th>
                                                    <th>Thời gian nộp bài</th>
                                                    <th>Thời gian làm bài</th>
                                                    <th>Điểm số</th>
                                                    <th>Hành động</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {submissions.map((submission, index) => (
                                                    <tr key={submission._id}>
                                                        <td>{index + 1}</td>
                                                        <td>{submission.student.username}</td>
                                                        <td>{submission.student.email}</td>
                                                        <td>{new Date(submission.submittedAt).toLocaleString()}</td>
                                                        <td>
                                                            {Math.floor(submission.timeSpent / 60)}:
                                                            {(submission.timeSpent % 60).toString().padStart(2, '0')}
                                                        </td>
                                                        <td>
                                                            <strong>{submission.score}/{exam.totalPoints}</strong>
                                                        </td>
                                                        <td>
                                                            <Link to={`/result/${submission._id}`} className="btn btn-sm btn-primary">
                                                                <i className="fas fa-eye"></i> Chi tiết
                                                            </Link>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Tab Kết quả */}
                {activeTab === 'results' && (
                    <div className="exam-results">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h2>Kết quả - {exam.title}</h2>
                            <button 
                                className="btn btn-primary" 
                                onClick={exportToCSV}
                                disabled={exportLoading || submissions.length === 0}
                            >
                                {exportLoading ? (
                                    <span><i className="fas fa-spinner fa-spin"></i> Đang xuất...</span>
                                ) : (
                                    <span><i className="fas fa-download"></i> Xuất kết quả (CSV)</span>
                                )}
                            </button>
                        </div>
                        
                        {submissions.length === 0 ? (
                            <div className="alert alert-info">
                                Chưa có dữ liệu kết quả để hiển thị.
                            </div>
                        ) : (
                            <>
                                <div className="row mb-4">
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h4 className="card-title">Thống kê điểm</h4>
                                                <div className="stats-container">
                                                    <div className="stats-item">
                                                        <div className="stats-value">{calculateAverageScore()}</div>
                                                        <div className="stats-label">Điểm trung bình</div>
                                                    </div>
                                                    <div className="stats-item">
                                                        <div className="stats-value">
                                                            {Math.max(...submissions.map(s => s.score))}
                                                        </div>
                                                        <div className="stats-label">Điểm cao nhất</div>
                                                    </div>
                                                    <div className="stats-item">
                                                        <div className="stats-value">
                                                            {Math.min(...submissions.map(s => s.score))}
                                                        </div>
                                                        <div className="stats-label">Điểm thấp nhất</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="col-md-6">
                                        <div className="card">
                                            <div className="card-body">
                                                <h4 className="card-title">Phân bố điểm</h4>
                                                <div className="score-distribution">
                                                    {[
                                                        { range: '0-20%', count: submissions.filter(s => s.score / exam.totalPoints <= 0.2).length },
                                                        { range: '21-40%', count: submissions.filter(s => s.score / exam.totalPoints > 0.2 && s.score / exam.totalPoints <= 0.4).length },
                                                        { range: '41-60%', count: submissions.filter(s => s.score / exam.totalPoints > 0.4 && s.score / exam.totalPoints <= 0.6).length },
                                                        { range: '61-80%', count: submissions.filter(s => s.score / exam.totalPoints > 0.6 && s.score / exam.totalPoints <= 0.8).length },
                                                        { range: '81-100%', count: submissions.filter(s => s.score / exam.totalPoints > 0.8).length }
                                                    ].map((item, index) => (
                                                        <div key={index} className="distribution-item">
                                                            <div className="distribution-label">{item.range}</div>
                                                            <div className="distribution-bar-container">
                                                                <div 
                                                                    className="distribution-bar" 
                                                                    style={{ 
                                                                        width: `${(item.count / submissions.length) * 100}%`,
                                                                        backgroundColor: index === 0 ? '#dc3545' : 
                                                                                          index === 1 ? '#ffc107' : 
                                                                                          index === 2 ? '#17a2b8' : 
                                                                                          index === 3 ? '#28a745' : '#20c997'
                                                                    }}
                                                                ></div>
                                                            </div>
                                                            <div className="distribution-count">{item.count}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="card">
                                    <div className="card-body">
                                        <h4 className="card-title">Chi tiết từng câu hỏi</h4>
                                        <div className="table-responsive">
                                            <table className="table">
                                                <thead>
                                                    <tr>
                                                        <th>Câu hỏi</th>
                                                        <th>Loại câu hỏi</th>
                                                        <th>Điểm</th>
                                                        <th>Số người trả lời đúng</th>
                                                        <th>Tỷ lệ đúng</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exam.questions.map((question, index) => {
                                                        const correctCount = submissions.filter(sub => {
                                                            const answer = sub.answers.find(a => a.questionId === question._id);
                                                            return answer && answer.isCorrect;
                                                        }).length;
                                                        
                                                        const correctRate = submissions.length > 0 
                                                            ? (correctCount / submissions.length * 100).toFixed(1) 
                                                            : 0;
                                                            
                                                        return (
                                                            <tr key={question._id}>
                                                                <td>
                                                                    <div className="question-text">
                                                                        <strong>Câu {index + 1}:</strong> {question.text}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    {question.answerType === 'single' ? 'Một đáp án' : 
                                                                     question.answerType === 'multiple' ? 'Nhiều đáp án' : 
                                                                     'Tự luận'}
                                                                </td>
                                                                <td>{question.points}</td>
                                                                <td>{correctCount}/{submissions.length}</td>
                                                                <td>
                                                                    <div className="progress">
                                                                        <div 
                                                                            className="progress-bar" 
                                                                            role="progressbar" 
                                                                            style={{ 
                                                                                width: `${correctRate}%`,
                                                                                backgroundColor: correctRate < 30 ? '#dc3545' :
                                                                                                  correctRate < 60 ? '#ffc107' : '#28a745'
                                                                            }}
                                                                            aria-valuenow={correctRate}
                                                                            aria-valuemin="0"
                                                                            aria-valuemax="100"
                                                                        >
                                                                            {correctRate}%
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamManagement;