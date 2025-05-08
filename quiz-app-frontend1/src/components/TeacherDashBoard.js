import React from 'react';
import { useNavigate } from 'react-router-dom';

const TeacherDashboard = () => {
    const navigate = useNavigate();

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <button onClick={() => navigate('/create-exam')}>Create New Exam</button>
        </div>
    );
};

export default TeacherDashboard;