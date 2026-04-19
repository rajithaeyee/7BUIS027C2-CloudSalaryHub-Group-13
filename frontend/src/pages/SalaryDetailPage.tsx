import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSubmission, vote } from "../services/api";
import type { SalarySubmission } from "../types";
import { useAuth } from "../contexts/AuthContext";
import VoteButtons from "../components/VoteButtons";

const SalaryDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [submission, setSubmission] = useState<SalarySubmission | null>(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchSubmission = async () => {
      if (!id) return;
      try {
        const response = await getSubmission(id);
        setSubmission(response.data);
      } catch (error) {
        console.error("Failed to fetch submission", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSubmission();
  }, [id]);

  const handleVote = async (voteType: "UPVOTE" | "DOWNVOTE") => {
    if (!id) return;
    try {
      await vote(id, voteType);
      const response = await getSubmission(id);
      setSubmission(response.data);
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-indigo-600"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-gray-500 mb-4">Salary not found</p>
        <Link to="/" className="text-indigo-600 font-medium hover:text-indigo-800">
          Back to home
        </Link>
      </div>
    );
  }

  const statusColor =
    submission.status === "PENDING"
      ? "bg-amber-50 text-amber-700 border-amber-200"
      : "bg-emerald-50 text-emerald-700 border-emerald-200";

  return (
    <div className="container mx-auto px-4 py-10 max-w-3xl">
      {/* Back link */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-indigo-600 transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to salaries
      </Link>

      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">{submission.role}</h1>
              <p className="text-indigo-100 mt-1">
                {submission.anonymize ? "Anonymous" : submission.company} &middot; {submission.country}
                {submission.city && `, ${submission.city}`}
              </p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full border ${statusColor}`}>
              {submission.status}
            </span>
          </div>
        </div>

        <div className="p-8">
          {/* Salary */}
          <div className="text-center mb-8">
            <p className="text-sm text-gray-500 mb-1">Salary</p>
            <p className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              {submission.currency} {submission.salary_amount.toLocaleString()}
            </p>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {submission.level && (
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-500 mb-1">Level</p>
                <p className="text-sm font-semibold text-gray-900">{submission.level}</p>
              </div>
            )}
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Experience</p>
              <p className="text-sm font-semibold text-gray-900">{submission.experience_years} years</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Currency</p>
              <p className="text-sm font-semibold text-gray-900">{submission.currency}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-center">
              <p className="text-xs text-gray-500 mb-1">Submitted</p>
              <p className="text-sm font-semibold text-gray-900">
                {new Date(submission.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Vote section */}
          {isAuthenticated && submission.status === "PENDING" && (
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Does this salary look accurate?
              </p>
              <VoteButtons onVote={handleVote} />
            </div>
          )}

          {!isAuthenticated && submission.status === "PENDING" && (
            <div className="border-t border-gray-100 pt-6">
              <p className="text-sm text-gray-500">
                <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-800">
                  Log in
                </Link>{" "}
                to vote on this submission.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SalaryDetailPage;
