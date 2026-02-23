export interface SalarySubmission {
  id: number;
  company: string | null;
  role: string;
  level: string | null;
  country: string;
  salary: number;
  currency: string;
  anonymize: boolean;
  status: 'PENDING' | 'APPROVED';
  created_at: string;
}

export interface User {
  id: number;
  email: string;
}

export interface AuthResponse {
  token: string;
}

export interface Stats {
  average: number;
  median: number;
  p25: number;
  p75: number;
  count: number;
}

export interface VotePayload {
  submissionId: number;
  voteType: boolean; // true = upvote, false = downvote
}