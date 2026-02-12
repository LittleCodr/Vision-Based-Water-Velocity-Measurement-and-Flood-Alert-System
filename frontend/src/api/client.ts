import axios from 'axios';
import { AlertItem, ApiResponse, DatasetItem, InferenceResult, VelocityLog, VideoItem } from '../types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
const api = axios.create({ baseURL });

export const setAuthToken = (token?: string) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

export const authApi = {
  register: (email: string, password: string, role: string) =>
    api.post('/api/auth/register', { email, password, role }),
  login: (email: string, password: string) => api.post('/api/auth/login', { email, password }),
  me: () => api.get<ApiResponse<{ uid: string; email: string; role: string }>>('/api/auth/me'),
  setRole: (role: string) => api.post('/api/auth/role', { role })
};

export const videoApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/video', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  list: () => api.get<ApiResponse<VideoItem[]>>('/api/videos')
};

export const datasetApi = {
  upload: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/api/upload/dataset', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  list: () => api.get<ApiResponse<DatasetItem[]>>('/api/datasets')
};

export const velocityApi = {
  create: (velocity: number, source: string, timestamp?: string) =>
    api.post('/api/velocity', { velocity, source, timestamp }),
  list: () => api.get<ApiResponse<VelocityLog[]>>('/api/velocity')
};

export const alertsApi = {
  create: (threshold: number, velocity: number, status: string) =>
    api.post('/api/alerts', { threshold, velocity, status }),
  list: () => api.get<ApiResponse<AlertItem[]>>('/api/alerts')
};

export const inferenceApi = {
  velocity: (velocity: number, source: string) =>
    api.post<ApiResponse<InferenceResult>>('/api/inference/velocity', { velocity, source })
};

export default api;
