export interface SalarySubmission {
  id: string;            // UUID
  company: string | null;
  role: string;
  level: string | null;
  country: string;
  city?: string | null;   // optional
  salary_amount: number;  // backend field name
  currency: string;
  experience_years: number;
  anonymize: boolean;
  status: 'PENDING' | 'APPROVED';
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user_id: string;
  username: string;
}

export interface Stats {
  average: number | null;
  median: number | null;
  p25: number | null;
  p75: number | null;
  count: number;
}

export interface VotePayload {
  submission_id: string;
  vote_type: 'UPVOTE' | 'DOWNVOTE';
}