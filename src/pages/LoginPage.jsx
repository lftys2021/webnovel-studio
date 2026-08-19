// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, resetPassword } from '../api/authApi';
import '../css/Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetForm, setResetForm] = useState({ name: '', phone: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 로그인 제출
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(form);
      alert('로그인 성공!');
      navigate('/dashboard'); // 대시보드로 이동
    } catch (err) {
      alert('로그인에 실패했습니다. 아이디와 비밀번호를 확인하세요.');
    }
  };

  // 비밀번호 초기화 요청
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await resetPassword(resetForm);
      alert(res.message); // "임시 비밀번호가 입력하신 연락처로 발송되었습니다."
      setIsResetModalOpen(false);
    } catch (err) {
      alert('비밀번호 초기화 요청 실패. 입력 정보를 확인하세요.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>📚 웹소설 스튜디오 로그인</h2>
        <form onSubmit={handleLoginSubmit}>
          <div className="form-group">
            <label>아이디</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="아이디를 입력하세요"
              required
            />
          </div>
          <div className="form-group">
            <label>비밀번호</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>

          <button type="submit" className="btn-auth-primary">로그인</button>
        </form>

        <div className="auth-links">
          <button type="button" className="btn-link" onClick={() => setIsResetModalOpen(true)}>
            비밀번호 초기화
          </button>
          <span className="divider">|</span>
          <Link to="/signup" className="btn-link">회원가입</Link>
        </div>
      </div>

      {/* 🔐 비밀번호 초기화 (SMS 문자 발송) 모달 */}
      {isResetModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>🔑 비밀번호 초기화</h3>
            <p className="modal-desc">가입 시 등록한 이름과 휴대폰 번호를 입력하시면, 문자 메시지로 8자리 임시 비밀번호가 발송됩니다.</p>
            <form onSubmit={handleResetSubmit}>
              <div className="form-group">
                <label>이름</label>
                <input
                  type="text"
                  value={resetForm.name}
                  onChange={(e) => setResetForm({ ...resetForm, name: e.target.value })}
                  placeholder="홍길동"
                  required
                />
              </div>
              <div className="form-group">
                <label>연락처</label>
                <input
                  type="tel"
                  value={resetForm.phone}
                  onChange={(e) => setResetForm({ ...resetForm, phone: e.target.value })}
                  placeholder="010-1234-5678"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="button" className="btn-secondary" onClick={() => setIsResetModalOpen(false)}>취소</button>
                <button type="submit" className="btn-primary">임시 비밀번호 발송</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}