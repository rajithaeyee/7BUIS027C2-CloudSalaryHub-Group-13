CREATE SCHEMA IF NOT EXISTS identity;
CREATE SCHEMA IF NOT EXISTS salary;
CREATE SCHEMA IF NOT EXISTS community;

-- =====================
-- IDENTITY SCHEMA
-- =====================
CREATE TABLE identity.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON identity.users(email);

-- =====================
-- SALARY SCHEMA
-- =====================
CREATE TYPE salary.submission_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

CREATE TABLE salary.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    level VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    city VARCHAR(100),
    salary_amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'LKR',
    experience_years INTEGER NOT NULL,
    anonymize BOOLEAN NOT NULL DEFAULT FALSE,
    status salary.submission_status NOT NULL DEFAULT 'PENDING',
    vote_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_submissions_status ON salary.submissions(status);
CREATE INDEX idx_submissions_country ON salary.submissions(country);
CREATE INDEX idx_submissions_company ON salary.submissions(company);
CREATE INDEX idx_submissions_role ON salary.submissions(role);

-- =====================
-- COMMUNITY SCHEMA
-- =====================
CREATE TYPE community.vote_type AS ENUM ('UPVOTE', 'DOWNVOTE');

CREATE TABLE community.votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    submission_id UUID NOT NULL,
    vote_type community.vote_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_submission_vote UNIQUE (user_id, submission_id)
);

CREATE INDEX idx_votes_user ON community.votes(user_id);
CREATE INDEX idx_votes_submission ON community.votes(submission_id);

CREATE TABLE community.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    submission_id UUID NOT NULL,
    reason VARCHAR(500) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_user_submission_report UNIQUE (user_id, submission_id)
);

CREATE INDEX idx_reports_user ON community.reports(user_id);
CREATE INDEX idx_reports_submission ON community.reports(submission_id);
