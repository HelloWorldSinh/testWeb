import React, { useState } from 'react';
import axios from 'axios';

const CreateExam = () => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [examId, setExamId] = useState(null);
    const [examCode, setExamCode] = useState('');
    const [questions, setQuestions] = useState([]);

    const getAnswerLabel = (index) => String.fromCharCode(65 + index); // 65 = 'A'

    const handleCreateExam = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/exams/create', {
                title,
                startTime,
                endTime,
            });
            setExamId(res.data._id);
            setExamCode(res.data.code);
            setQuestions([{ content: '', answers: [{ content: '', isCorrect: false }], media: null, isEditing: true }]);
            alert(`Exam created with code: ${res.data.code}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleAddAnswer = (index) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index].answers = [
            ...updatedQuestions[index].answers,
            { content: '', isCorrect: false }
        ];
        setQuestions(updatedQuestions);
    };

    const handleRemoveAnswer = (index, ansIndex) => {
        const updatedQuestions = [...questions];
        if (updatedQuestions[index].answers.length <= 1) {
            alert('At least one answer is required');
            return;
        }
        updatedQuestions[index].answers = updatedQuestions[index].answers.filter((_, i) => i !== ansIndex);
        setQuestions(updatedQuestions);
    };

    const handleAddQuestion = (index) => {
        const currentQuestion = questions[index];
        if (!currentQuestion.content || currentQuestion.answers.some(ans => !ans.content)) {
            alert('Please fill in all fields for the current question');
            return;
        }
        const updatedQuestions = questions.map((q, i) =>
            i === index ? { ...q, isEditing: false } : q
        );
        setQuestions([
            ...updatedQuestions,
            { content: '', answers: [{ content: '', isCorrect: false }], media: null, isEditing: true }
        ]);
    };

    const handleRemoveQuestion = (index) => {
        const updatedQuestions = questions.filter((_, i) => i !== index);
        setQuestions(updatedQuestions);
    };

    const handleEditQuestion = (index) => {
        const updatedQuestions = questions.map((q, i) => ({
            ...q,
            isEditing: i === index
        }));
        setQuestions(updatedQuestions);
    };

    const handleUpdateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        if (field === 'content' || field === 'media') {
            updatedQuestions[index][field] = value;
        } else if (field === 'answers') {
            updatedQuestions[index].answers = value;
        }
        setQuestions(updatedQuestions);
    };

    const handleCompleteExam = async () => {
        if (questions.length === 0) {
            alert('Please add at least one question');
            return;
        }
        try {
            for (const question of questions) {
                if (!question.content || question.answers.some(ans => !ans.content)) {
                    alert('Please fill in all fields for all questions');
                    return;
                }
                const formData = new FormData();
                formData.append('examId', examId);
                formData.append('content', question.content);
                formData.append('answers', JSON.stringify(question.answers));
                if (question.media) formData.append('media', question.media);
                await axios.post('http://localhost:5000/api/exams/questions', formData);
            }
            alert('Exam completed and questions saved');
            setQuestions([]);
            setExamId(null);
            setExamCode('');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Create Exam</h2>
            {!examId ? (
                <form onSubmit={handleCreateExam}>
                    <input
                        type="text"
                        placeholder="Exam title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                    />
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                    />
                    <button type="submit">Create Exam</button>
                </form>
            ) : (
                <div>
                    <h3>Exam Code: {examCode}</h3>
                    {questions.map((question, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: '20px',
                                padding: '10px',
                                border: '1px solid #ccc',
                            }}
                        >
                            <h4>Question {index + 1}</h4>
                            {question.isEditing ? (
                                <div>
                                    <input
                                        type="text"
                                        placeholder="Question content"
                                        value={question.content}
                                        onChange={(e) => handleUpdateQuestion(index, 'content', e.target.value)}
                                        style={{ width: '100%', marginBottom: '10px' }}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*,audio/*"
                                        onChange={(e) => handleUpdateQuestion(index, 'media', e.target.files[0])}
                                        style={{ marginBottom: '10px' }}
                                    />
                                    {question.answers.map((answer, ansIndex) => (
                                        <div
                                            key={ansIndex}
                                            style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}
                                        >
                                            <span style={{ width: '30px' }}>{getAnswerLabel(ansIndex)}.</span>
                                            <input
                                                type="text"
                                                placeholder="Answer content"
                                                value={answer.content}
                                                onChange={(e) => {
                                                    const newAnswers = [...question.answers];
                                                    newAnswers[ansIndex].content = e.target.value;
                                                    handleUpdateQuestion(index, 'answers', newAnswers);
                                                }}
                                                style={{ marginRight: '10px', flex: 1 }}
                                            />
                                            <label style={{ marginRight: '10px' }}>
                                                Correct:
                                                <input
                                                    type="checkbox"
                                                    checked={answer.isCorrect}
                                                    onChange={(e) => {
                                                        const newAnswers = [...question.answers];
                                                        newAnswers[ansIndex].isCorrect = e.target.checked;
                                                        handleUpdateQuestion(index, 'answers', newAnswers);
                                                    }}
                                                />
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveAnswer(index, ansIndex)}
                                                style={{ background: 'red', color: 'white', border: 'none', padding: '5px 10px' }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={() => handleAddAnswer(index)}
                                        style={{ marginRight: '10px' }}
                                    >
                                        Add Answer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleAddQuestion(index)}
                                        style={{ background: 'blue', color: 'white', padding: '5px 10px' }}
                                    >
                                        Add Question
                                    </button>
                                </div>
                            ) : (
                                <div>
                                    <strong>{question.content}</strong>
                                    {question.media && (
                                        <p>Media: {question.media.name || 'File attached'}</p>
                                    )}
                                    <ul style={{ marginTop: '10px' }}>
                                        {question.answers.map((ans, ansIndex) => (
                                            <li
                                                key={ansIndex}
                                                style={{
                                                    color: ans.isCorrect ? 'green' : 'black',
                                                    fontWeight: ans.isCorrect ? 'bold' : 'normal',
                                                }}
                                            >
                                                {getAnswerLabel(ansIndex)}. {ans.content}
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => handleEditQuestion(index)}
                                        style={{ marginRight: '10px', padding: '5px 10px' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleRemoveQuestion(index)}
                                        style={{ background: 'red', color: 'white', padding: '5px 10px' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={handleCompleteExam}
                        style={{ padding: '10px 20px', background: 'green', color: 'white' }}
                    >
                        Complete Exam
                    </button>
                </div>
            )}
        </div>
    );
};

export default CreateExam;