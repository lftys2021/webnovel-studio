// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateProfile, deleteAccount, logout } from '../api/authApi';
import '../css/Auth.css';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', phone: '', password: '' });

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser((prev) => ({ ...prev, name: parsed.name || '', username: parsed.username || '' }));
    }
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  // 회원정보 수정
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateProfile(user);
      alert('회원정보가 성공적으로 수정되었습니다.');
    } catch (err) {
      alert('회원정보 수정 실패');
    }
  };

  // 회원 탈퇴
  const handleDelete = async () => {
    if (window.confirm('정말로 탈퇴하시겠습니까? 계정 정보가 삭제됩니다.')) {
      try {
        await deleteAccount();
        alert('회원 탈퇴가 완료되었습니다.');
        navigate('/login');
      } catch (err) {
        alert('탈퇴 처리 실패');
      }
    }
  };

  // 로그아웃
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>👤 마이페이지</h2>
        <form onSubmit={handleUpdate}>
          <div className="form-group">
            <label>이름</label>
            <input type="text" name="name" value={user.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>이메일</label>
            <input type="email" name="email" value={user.email || ''} onChange={handleChange} placeholder="새 이메일" />
          </div>
          <div className="form-group">
            <label>연락처</label>
            <input type="tel" name="phone" value={user.phone || ''} onChange={handleChange} placeholder="새 연락처" />
          </div>
          <div className="form-group">
            <label>새 비밀번호 (변경 시 입력)</label>
            <input type="password" name="password" value={user.password || ''} onChange={handleChange} placeholder="********" />
          </div>

          <button type="submit" className="btn-auth-primary">수정사항 저장</button>
        </form>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
          <button type="button" className="btn-secondary" onClick={handleLogout} style={{ padding: '8px 16px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer' }}>
            로그아웃
          </button>
          <button type="button" onClick={handleDelete} style={{ background: 'none', border: 'none', color: '#e03131', cursor: 'pointer', fontSize: '0.875rem' }}>
            회원 탈퇴
          </button>
        </div>
      </div>
    </div>
  );
}