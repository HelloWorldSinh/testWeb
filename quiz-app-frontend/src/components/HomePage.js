import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Học tập thông minh với <span className="highlight">Quiz App</span></h1>
            <p className="hero-description">
              Nền tảng thi trắc nghiệm trực tuyến hiện đại dành cho giáo viên và học sinh.
              Tạo, chia sẻ và làm bài kiểm tra một cách đơn giản, nhanh chóng.
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary btn-lg">
                <i className="fas fa-user-plus mr-2"></i>
                Bắt đầu ngay
              </Link>
              <Link to="/login" className="btn btn-outline btn-lg ml-3">
                <i className="fas fa-sign-in-alt mr-2"></i>
                Đăng nhập
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section">
        <div className="container">
          <h2 className="section-title text-center">Tại sao chọn <span className="highlight">TRẮC NGHIỆM</span>?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-bolt"></i>
              </div>
              <h3 className="feature-title">Dễ dàng tạo bài</h3>
              <p>Tạo bài kiểm tra chuyên nghiệp trong vài phút với giao diện trực quan.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-pie"></i>
              </div>
              <h3 className="feature-title">Phân tích chi tiết</h3>
              <p>Theo dõi kết quả học tập với báo cáo chi tiết và trực quan.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3 className="feature-title">Tương thích mọi thiết bị</h3>
              <p>Học sinh có thể làm bài trên mọi thiết bị, mọi lúc, mọi nơi.</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-lock"></i>
              </div>
              <h3 className="feature-title">An toàn bảo mật</h3>
              <p>Hệ thống bảo mật cao, bảo vệ dữ liệu và ngăn chặn gian lận.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="for-teachers">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h2 className="section-title">Dành cho Giáo viên</h2>
              <p className="mb-4">Công cụ mạnh mẽ cho việc giảng dạy và đánh giá:</p>
              <ul className="feature-list">
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Tạo đề thi đa dạng với nhiều loại câu hỏi khác nhau
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Thiết lập thời gian làm bài và thời hạn nộp bài
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Phân tích kết quả học tập của học sinh
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Xuất kết quả thành file để lưu trữ
                </li>
              </ul>
              <Link to="/register?role=teacher" className="btn btn-primary mt-3">
                Bắt đầu giảng dạy
              </Link>
            </div>
            <div className="col-md-6">
              <div className="image-wrapper">
                <img src="https://source.unsplash.com/random/600x400/?teacher" alt="Giáo viên" className="img-fluid rounded shadow" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="for-students bg-light">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 order-md-2">
              <h2 className="section-title">Dành cho Học sinh</h2>
              <p className="mb-4">Nâng cao trải nghiệm học tập của bạn:</p>
              <ul className="feature-list">
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Làm bài kiểm tra mọi lúc, mọi nơi trên mọi thiết bị
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Nhận phản hồi ngay lập tức sau khi làm bài
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Xem lại các bài đã làm để theo dõi tiến độ
                </li>
                <li>
                  <i className="fas fa-check-circle text-success mr-2"></i>
                  Tập trung vào các phần kiến thức cần cải thiện
                </li>
              </ul>
              <Link to="/register?role=student" className="btn btn-primary mt-3">
                Bắt đầu học tập
              </Link>
            </div>
            <div className="col-md-6 order-md-1">
              <div className="image-wrapper">
                <img src="https://source.unsplash.com/random/600x400/?student" alt="Học sinh" className="img-fluid rounded shadow" />
              </div>
            </div>
          </div>
        </div>
      </section>

     

      <section className="cta-section">
        <div className="container text-center">
          <h2 className="mb-4">Sẵn sàng nâng cao chất lượng dạy và học?</h2>
          <p className="mb-4">Tham gia cùng hàng nghìn giáo viên và học sinh đang sử dụng TRẮC NGHIỆM mỗi ngày.</p>
          <Link to="/register" className="btn btn-primary btn-lg">
            Tạo tài khoản miễn phí ngay
          </Link>
        </div>
      </section>

      <style jsx>{`
        .home-container {
          overflow-x: hidden;
        }
        
        .hero-section {
          background: linear-gradient(135deg, #4568dc, #b06ab3);
          color: white;
          padding: 80px 0;
          position: relative;
        }
        
        .hero-content {
          max-width: 600px;
          margin: 0 auto;
          text-align: center;
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          margin-bottom: 1.5rem;
        }
        
        .hero-description {
          font-size: 1.2rem;
          margin-bottom: 2rem;
          opacity: 0.9;
        }
        
        .highlight {
          color: #ffd700;
        }
        
        .features-section {
          padding: 80px 0;
        }
        
        .section-title {
          font-size: 2.2rem;
          margin-bottom: 3rem;
          position: relative;
        }
        
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          grid-gap: 30px;
        }
        
        .feature-card {
          background: #fff;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        
        .feature-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        .feature-icon {
          font-size: 2.5rem;
          color: #4568dc;
          margin-bottom: 20px;
        }
        
        .for-teachers, .for-students {
          padding: 80px 0;
        }
        
        .for-students {
          background-color: #f8f9fa;
        }
        
        .feature-list {
          list-style: none;
          padding: 0;
        }
        
        .feature-list li {
          margin-bottom: 15px;
          font-size: 1.1rem;
        }
        
        .image-wrapper {
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 15px 30px rgba(0,0,0,0.1);
        }
        
        .testimonial-section {
          padding: 80px 0;
          background-color: #f1f5fe;
        }
        
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          grid-gap: 30px;
          margin-top: 50px;
        }
        
        .testimonial-card {
          background: white;
          border-radius: 10px;
          padding: 30px;
          box-shadow: 0 5px 15px rgba(0,0,0,0.05);
        }
        
        .testimonial-content {
          font-style: italic;
          margin-bottom: 20px;
        }
        
        .testimonial-author {
          display: flex;
          align-items: center;
        }
        
        .avatar {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 15px;
        }
        
        .avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .cta-section {
          padding: 80px 0;
          background: linear-gradient(135deg, #4568dc, #b06ab3);
          color: white;
        }
      `}</style>
    </div>
  );
};

export default HomePage;