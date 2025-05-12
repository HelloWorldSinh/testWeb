import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role: 'student'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const { name, email, password, password2, role } = formData;

  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async e => {
    e.preventDefault();
    
    if (password !== password2) {
      setError('Mật khẩu không khớp');
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await register(name, email, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Lỗi trong quá trình đăng ký');
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <h1 className="auth-title">Tạo tài khoản</h1>
          <p className="auth-subtitle">Đăng ký để bắt đầu</p>
        </div>
        
        {error && (
          <div className="alert alert-danger">{error}</div>
        )}
        
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              id="name"
              name="name"
              value={name}
              onChange={onChange}
              placeholder="Nhập họ và tên của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email" className="form-label">Địa chỉ Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              name="email"
              value={email}
              onChange={onChange}
              placeholder="Nhập địa chỉ email của bạn"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              onChange={onChange}
              placeholder="Tạo mật khẩu"
              minLength="6"
              required
            />
            <small className="form-text">Mật khẩu phải có ít nhất 6 ký tự</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="password2" className="form-label">Xác nhận mật khẩu</label>
            <input
              type="password"
              className="form-control"
              id="password2"
              name="password2"
              value={password2}
              onChange={onChange}
              placeholder="Xác nhận mật khẩu của bạn"
              minLength="6"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Tôi là:</label>
            <div className="d-flex">
              <div className="form-check mr-2">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="student"
                  value="student"
                  checked={role === 'student'}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="student">
                  Học viên
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="role"
                  id="teacher"
                  value="teacher"
                  checked={role === 'teacher'}
                  onChange={onChange}
                />
                <label className="form-check-label" htmlFor="teacher">
                  Giáo viên
                </label>
              </div>
            </div>
          </div>
          
          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? (
              <span>
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Đang tạo tài khoản...
              </span>
            ) : (
              'Đăng ký'
            )}
          </button>
          
          <div className="mt-3 text-center">
            <small>
              Bằng việc đăng ký, bạn đồng ý với 
              <Link to="/terms" className="auth-link ml-2 mr-2">Điều khoản</Link>
              và
              <Link to="/privacy" className="auth-link ml-2">Chính sách bảo mật</Link>
            </small>
          </div>
        </form>
        
        <div className="auth-footer">
          Đã có tài khoản? <Link to="/login" className="auth-link">Đăng nhập</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;