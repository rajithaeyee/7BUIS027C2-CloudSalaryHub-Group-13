import axios from 'axios';
import type { AuthResponse, SalarySubmission, Stats } from '../types';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const login = (email: string, password: string) =>
  api.post<AuthResponse>('/auth/login', { email, password });

export const signup = (email: string, username: string, password: string) =>
  api.post<AuthResponse>('/auth/signup', { email, username, password });

export const getMe = () => api.get('/auth/me');

// Salaries
export const submitSalary = (data: Omit<SalarySubmission, 'id' | 'status' | 'created_at'>) =>
  api.post('/salaries/', data);

export const getSubmission = (id: string) =>
  api.get<SalarySubmission>(`/salaries/${id}`);

// Search
export const searchSalaries = (params: { company?: string; role?: string; country?: string }) =>
  api.get<SalarySubmission[]>('/search/', { params });

// Stats
export const getStats = (params: { country?: string; role?: string }) =>
  api.get<Stats>('/stats/', { params });

// Vote
export const vote = (submissionId: string, voteType: 'UPVOTE' | 'DOWNVOTE') =>
  api.post('/votes/', { submission_id: submissionId, vote_type: voteType });
