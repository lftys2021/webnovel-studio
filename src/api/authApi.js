// src/api/authApi.js
import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const authApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 자동 첨부 인터셉터
authApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. 회원가입
export const signup = async (userData) => {
  const res = await authApi.post('/auth/signup', userData);
  return res.data;
};

// 2. 로그인
export const login = async (credentials) => {
  const res = await authApi.post('/auth/login', credentials);
  if (res.data.access_token) {
    localStorage.setItem('token', res.data.access_token);
    localStorage.setItem('user', JSON.stringify(res.data.user));
  }
  return res.data;
};

// 3. 비밀번호 초기화 (SMS 문자 발송)
export const resetPassword = async (data) => {
  const res = await authApi.post('/auth/reset-password', data);
  return res.data;
};

// 4. 회원정보 수정
export const updateProfile = async (userData) => {
  const res = await authApi.put('/users/me', userData);
  return res.data;
};

// 5. 회원 탈퇴
export const deleteAccount = async () => {
  const res = await authApi.delete('/users/me');
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return res.data;
};

// 6. 로그아웃
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export default authApi;