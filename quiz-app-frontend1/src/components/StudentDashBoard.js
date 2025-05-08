import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const StudentDashboard = () => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.get(`http://localhost:5000/api/exams/${code}`);
            navigate(`/exam/${res.data.code}`);
        } catch (error) {
            alert(error.response.data.message);
        }
    };

    return (
        <div>
            <h2>Student Dashboard</h2>
            <form onSubmit={handleJoin}>
                <input
                    type="text"
                    placeholder="Enter exam code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                />
                <button type="submit">Join Exam</button>
            </form>
        </div>
    );
};

export default StudentDashboard;