import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Exam = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState([]);

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/exams/${code}`);
                setExam(res.data);
                setAnswers(res.data.questions.map(() => null));
            } catch (error) {
                alert(error.response.data.message);
            }
        };
        fetchExam();
    }, [code]);

    const handleAnswer = (questionIndex, answerIndex) => {
        const newAnswers = [...answers];
        newAnswers[questionIndex] = answerIndex;
        setAnswers(newAnswers);
    };

    const handleSubmit = async () => {
        try {
            const submission = {
                examId: exam._id,
                answers: exam.questions.map((q, i) => ({
                    questionId: q._id,
                    selectedAnswer: answers[i],
                })),
            };
            const res = await axios.post('http://localhost:5000/api/submissions', submission);
            navigate(`/result/${exam._id}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    if (!exam) return <div>Loading...</div>;

    return (
        <div>
            <h2>{exam.title}</h2>
            {exam.questions.map((question, qIndex) => (
                <div key={question._id}>
                    <p>{question.content}</p>
                    {question.media && (
                        <div>
                            {question.media.endsWith('.mp3') ? (
                                <audio controls src={`http://localhost:5000${question.media}`} />
                            ) : (
                                <img src={`http://localhost:5000${question.media}`} alt="question media" />
                            )}
                        </div>
                    )}
                    {question.answers.map((answer, aIndex) => (
                        <div key={aIndex}>
                            <input
                                type="radio"
                                name={`question-${qIndex}`}
                                checked={answers[qIndex] === aIndex}
                                onChange={() => handleAnswer(qIndex, aIndex)}
                            />
                            <span>{answer.content}</span>
                            {answer.media && (
                                <div>
                                    {answer.media.endsWith('.mp3') ? (
                                        <audio controls src={`http://localhost:5000${answer.media}`} />
                                    ) : (
                                        <img src={`http://localhost:5000${answer.media}`} alt="answer media" />
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ))}
            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

export default Exam;