// src/pages/SignupPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../api/authApi';
import '../css/Auth.css';

export default function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    phone: '',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      alert('회원가입이 완료되었습니다! 로그인해 주세요.');
      navigate('/login');
    } catch (err) {
      alert('회원가입 처리 중 오류가 발생했습니다.');
    }
  };

// src/pages/SignupPage.jsx 내 handleSSOLogin 수정
const handleSSOLogin = (provider) => {
  // FastAPI 백엔드 SSO 테스트 엔드포인트로 이동
  window.location.href = `http://127.0.0.1:8000/api/auth/sso/${provider}`;
};

  return (
    <div className="auth-container">
      <div className="auth-card signup-card">
        <h2>📝 회원가입</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input type="text" name="username" value={form.username} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>이름</label>
            <input type="text" name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>연락처</label>
            <input type="tel" name="phone" value={form.phone} onChange={handleChange} placeholder="010-1234-5678" required />
          </div>

          <button type="submit" className="btn-auth-primary">가입하기</button>
        </form>

        <div className="sso-divider">
          <span>또는 소셜 계정으로 간편 가입</span>
        </div>

        {/* 🌐 SSO 소셜 로그인 버튼들 */}
        <div className="sso-buttons">
          <button type="button" className="btn-sso btn-kakao" onClick={() => handleSSOLogin('kakao')}>
            카카오 시작하기
          </button>
          <button type="button" className="btn-sso btn-naver" onClick={() => handleSSOLogin('naver')}>
            네이버 시작하기
          </button>
          <button type="button" className="btn-sso btn-google" onClick={() => handleSSOLogin('google')}>
            구글 시작하기
          </button>
        </div>

        <div className="auth-bottom-text">
          이미 계정이 있으신가요? <Link to="/login">로그인</Link>
        </div>
      </div>
    </div>
  );
}