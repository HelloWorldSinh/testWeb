import React, { useState } from 'react';
import axios from 'axios';

const CreateExam = () => {
    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [examId, setExamId] = useState(null);
    const [question, setQuestion] = useState('');
    const [media, setMedia] = useState(null);
    const [answers, setAnswers] = useState([{ content: '', isCorrect: false }]);
    const [examCode, setExamCode] = useState(''); // Thêm state mới

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
            alert('Exam created');
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    const handleAddAnswer = () => {
        setAnswers([...answers, { content: '', isCorrect: false }]);
    };

    const handleAnswerChange = (index, field, value) => {
        const newAnswers = [...answers];
        newAnswers[index][field] = value;
        setAnswers(newAnswers);
    };

    const handleAddQuestion = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('examId', examId);
        formData.append('content', question);
        formData.append('answers', JSON.stringify(answers));
        if (media) formData.append('media', media);

        try {
            await axios.post('http://localhost:5000/api/exams/questions', formData);
            setQuestion('');
            setMedia(null);
            setAnswers([{ content: '', isCorrect: false }]);
            alert('Question added');
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
                    <h3>Exam Code: {examCode}</h3> {/*Hiển thị mã bài thi*/}<button onClick={() => navigator.clipboard.writeText(examCode)}>Copy Code</button>
                    <form onSubmit={handleAddQuestion}>
                        <input
                            type="text"
                            placeholder="Question content"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                        />
                        <input
                            type="file"
                            accept="image/*,audio/*"
                            onChange={(e) => setMedia(e.target.files[0])}
                        />
                        {answers.map((answer, index) => (
                            <div key={index}>
                                <input
                                    type="text"
                                    placeholder="Answer content"
                                    value={answer.content}
                                    onChange={(e) => handleAnswerChange(index, 'content', e.target.value)}
                                />
                                <label>
                                    Correct:
                                    <input
                                        type="checkbox"
                                        checked={answer.isCorrect}
                                        onChange={(e) => handleAnswerChange(index, 'isCorrect', e.target.checked)}
                                    />
                                </label>
                            </div>
                        ))}
                        <button type="button" onClick={handleAddAnswer}>
                            Add Answer
                        </button>
                        <button type="submit">Add Question</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default CreateExam;