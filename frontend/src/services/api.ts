import axios from 'axios';
import type { AuthResponse, SalarySubmission, Stats } from '../types';

const api = axios.create({
  baseURL: '/api', // will be proxied to BFF
});

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const submitSalary = (data: Omit<SalarySubmission, 'id' | 'status' | 'created_at'>) =>
  api.post('/submissions', data);

export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const signup = (email: string, password: string) =>
  api.post('/auth/signup', { email, password });

export const searchSalaries = (params: { company?: string; role?: string; country?: string }) =>
  api.get<SalarySubmission[]>('/search', { params });

export const getStats = (params: { country?: string; role?: string }) =>
  api.get<Stats>('/stats', { params });

export const vote = (submissionId: number, voteType: boolean) =>
  api.post('/votes', { submissionId, voteType });

export const getSubmission = (id: number) =>
  api.get<SalarySubmission>(`/submissions/${id}`); // we may add this endpoint later