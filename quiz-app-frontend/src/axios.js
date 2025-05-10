import axios from 'axios';

const instance = axios.create({
    baseURL: 'http://localhost:5001',
});

// Thêm interceptor để thêm token vào header Authorization
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
