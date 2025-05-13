import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ExamList = () => {
    const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/exams/teacher', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                setExams(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || 'Error fetching exams');
                setLoading(false);
            }
        };

        fetchExams();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <h2>My Exams</h2>
            {exams.length === 0 ? (
                <p>No exams found.</p>
            ) : (
                <table>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Code</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {exams.map((exam) => (
                            <tr key={exam._id}>
                                <td>{exam.title}</td>
                                <td>{exam.code}</td>
                                <td>{new Date(exam.startTime).toLocaleString()}</td>
                                <td>{new Date(exam.endTime).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ExamList;