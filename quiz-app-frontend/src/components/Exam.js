import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../axios';

const Exam = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axiosInstance.get(`/api/exams/${id}`, {
                    headers: {
                        'x-auth-token': token
                    }
                });
                setExam(response.data);
                setQuestions(response.data.questions);
                setTimeLeft(response.data.timeLimit * 60); // Convert minutes to seconds
                setLoading(false);
            } catch (error) {
                setError('Không thể tải bài thi');
                setLoading(false);
            }
        };

        fetchExam();
    }, [id]);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleSubmit();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft]);

    const handleAnswerChange = (questionId, answer) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: answer
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmit = async () => {
        if (submitting) return;
        
        if (Object.keys(answers).length < questions.length) {
            if (!window.confirm('Bạn chưa trả lời hết các câu hỏi. Bạn có chắc chắn muốn nộp bài?')) {
                return;
            }
        }

        setSubmitting(true);        try {
            const token = localStorage.getItem('token');
            const response = await axiosInstance.post(
                '/api/submissions',
                {
                    examId: id,
                    answers: Object.entries(answers).map(([questionId, answer]) => ({
                        questionId,
                        answer
                    }))
                },
                {
                    headers: {
                        'x-auth-token': token
                    }
                }
            );

            navigate(`/result/${response.data._id}`);
        } catch (error) {
            alert('Không thể nộp bài thi');
            setSubmitting(false);
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    if (loading) {
        return (
            <div className="quiz-container">
                <div className="text-center my-5">
                    <p>Đang tải bài thi...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="quiz-container">
                <div className="text-center my-5">
                    <p className="text-danger">{error}</p>
                </div>
            </div>
        );
    }

    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="quiz-container">
            <div className="quiz-header">
                <h1 className="quiz-title">{exam.title}</h1>
                <div className="quiz-meta">
                    <span>Tổng số câu hỏi: {questions.length}</span>
                    <span className="timer" style={{
                        fontWeight: 'bold',
                        color: timeLeft < 60 ? 'var(--danger-color)' : 'inherit'
                    }}>
                        Thời gian còn lại: {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div className="progress mb-4" style={{
                height: '8px',
                backgroundColor: 'var(--gray)',
                borderRadius: 'var(--border-radius)'
            }}>
                <div 
                    className="progress-bar" 
                    style={{
                        width: `${(currentQuestionIndex + 1) / questions.length * 100}%`,
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: 'var(--border-radius)'
                    }}
                ></div>
            </div>

            <div className="question-card">
                <div className="question-number">
                    Câu hỏi {currentQuestionIndex + 1} / {questions.length}
                </div>
                <div className="question-text">{currentQuestion.text}</div>
                <ul className="options-list">
                    {currentQuestion.options.map((option, index) => (
                        <li className="option-item" key={index}>
                            <label 
                                className={`option-label ${answers[currentQuestion._id] === index ? 'selected' : ''}`}
                            >
                                <input
                                    type="radio"
                                    name={`question-${currentQuestion._id}`}
                                    className="option-radio"
                                    checked={answers[currentQuestion._id] === index}
                                    onChange={() => handleAnswerChange(currentQuestion._id, index)}
                                />
                                {option}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="quiz-footer">
                <button 
                    onClick={handlePrevQuestion} 
                    className="btn btn-outline"
                    disabled={currentQuestionIndex === 0}
                >
                    Câu trước
                </button>
                
                <div>
                    {currentQuestionIndex === questions.length - 1 ? (
                        <button 
                            onClick={handleSubmit} 
                            className="btn btn-primary"
                            disabled={submitting}
                        >
                            {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                        </button>
                    ) : (
                        <button 
                            onClick={handleNextQuestion} 
                            className="btn btn-primary"
                        >
                            Câu tiếp theo
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <div className="question-navigation">
                    <div className="d-flex flex-wrap justify-content-center" style={{ gap: '10px' }}>
                        {questions.map((question, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentQuestionIndex(index)}
                                className={`btn ${index === currentQuestionIndex ? 'btn-primary' : 
                                    answers[question._id] !== undefined ? 'btn-outline' : ''}`}
                                style={{
                                    width: '40px',
                                    height: '40px',
                                    padding: '0',
                                    backgroundColor: index === currentQuestionIndex ? 'var(--primary-color)' : 
                                        answers[question._id] !== undefined ? 'var(--light-bg)' : 'white',
                                    color: index === currentQuestionIndex ? 'white' : 
                                        answers[question._id] !== undefined ? 'var(--primary-color)' : 'var(--text-color)',
                                    border: '1px solid var(--gray)'
                                }}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>

                <button 
                    onClick={handleSubmit} 
                    className="btn btn-primary mt-4"
                    style={{ width: '100%' }}
                    disabled={submitting}
                >
                    {submitting ? 'Đang nộp bài...' : 'Nộp bài'}
                </button>
            </div>
        </div>
    );
};

export default Exam;