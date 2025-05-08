import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Result = () => {
    const { examId } = useParams();
    const [result, setResult] = useState(null);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/submissions/${examId}`);
                setResult(res.data);
            } catch (error) {
                alert(error.response.data.message);
            }
        };
        fetchResult();
    }, [examId]);

    if (!result) return <div>Loading...</div>;

    return (
        <div>
            <h2>Result</h2>
            <p>Score: {result.submission.score}/{result.exam.questions.length}</p>
            {result.exam.questions.map((question, index) => (
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
                            <span>{answer.content}</span>
                            {answer.isCorrect && <span> (Correct)</span>}
                            {result.submission.answers[index].selectedAnswer === aIndex && (
                                <span> (Your choice)</span>
                            )}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Result;