// src/api/novelApi.js
import axios from 'axios';

// FastAPI 백엔드 기본 서버 주소
const API_BASE_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const novelApi = {
  fetchNovels: async () => {
    const res = await axios.get(`${API_BASE_URL}/novels`);
    return res.data;
  },
};

/* --- 소설(Novel) 관련 API --- */
export const fetchNovels = async () => {
  const response = await api.get('/novels');
  return response.data;
};

export const createNovel = async (novelData) => {
  const response = await api.post('/novels', novelData);
  return response.data;
};

export const updateNovel = async (novelId, novelData) => {
  const response = await api.put(`/novels/${novelId}`, novelData);
  return response.data;
};

/* --- 문서(Document) 및 카테고리 관련 API --- */
export const updateDocContent = async (docId, content) => {
  const response = await api.patch(`/documents/${docId}/content`, { content });
  return response.data;
};

export const updateDocTitle = async (docId, title) => {
  const response = await api.patch(`/documents/${docId}/title`, { title });
  return response.data;
};

export const createCategory = async (novelId, title) => {
  const response = await api.post(`/novels/${novelId}/categories`, { title });
  return response.data;
};

export const createDocument = async (categoryId, title) => {
  const response = await api.post(`/categories/${categoryId}/documents`, { title });
  return response.data;
};

export default novelApi;