import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Exam = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [exam, setExam] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [shuffledQuestions, setShuffledQuestions] = useState([]);

    // Hàm trộn mảng (Fisher-Yates shuffle)
    const shuffleArray = (array) => {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    };

    useEffect(() => {
        const fetchExam = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/exams/${code}`);
                let questions = res.data.questions;

                // Thêm chỉ số gốc cho mỗi đáp án
                questions = questions.map(q => ({
                    ...q,
                    answers: q.answers.map((ans, idx) => ({
                        ...ans,
                        originalIndex: idx,
                    })),
                }));

                // Trộn câu hỏi nếu shuffleQuestions = true
                if (res.data.shuffleQuestions) {
                    questions = shuffleArray(questions);
                }

                // Trộn đáp án nếu shuffleAnswers = true
                if (res.data.shuffleAnswers) {
                    questions = questions.map(q => ({
                        ...q,
                        answers: shuffleArray(q.answers),
                    }));
                }

                setExam(res.data);
                setShuffledQuestions(questions);
                setAnswers(questions.map(() => null));
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
            // Map lại chỉ số đáp án theo thứ tự gốc
            const submissionAnswers = shuffledQuestions.map((q, i) => {
                const selectedAnswer = answers[i];
                return {
                    questionId: q._id,
                    selectedAnswer: selectedAnswer === null
                        ? null
                        : exam.shuffleAnswers
                            ? q.answers[selectedAnswer].originalIndex
                            : selectedAnswer,
                };
            });

            const submission = {
                examId: exam._id,
                answers: submissionAnswers,
            };
            await axios.post('http://localhost:5000/api/submissions', submission);
            navigate(`/result/${exam._id}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    if (!exam || !shuffledQuestions.length) return <div>Loading...</div>;

    return (
        <div>
            <h2>{exam.title}</h2>
            {shuffledQuestions.map((question, qIndex) => (
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