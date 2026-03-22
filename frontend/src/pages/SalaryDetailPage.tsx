import { useParams } from "react-router-dom";
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
      // Optionally refresh the submission to see updated status
      const response = await getSubmission(id);
      setSubmission(response.data);
    } catch (error) {
      console.error("Vote failed", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-blue-600"></div>
      </div>
    );
  }
  if (!submission) return <p>Salary not found</p>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-3xl font-bold mb-4">{submission.role}</h1>
      <p className="text-gray-700">
        {submission.anonymize ? "Anonymous" : submission.company} •{" "}
        {submission.country}
      </p>
      <p className="text-4xl font-bold my-4">
        {submission.currency} {submission.salary_amount.toLocaleString()}
      </p>
      {submission.level && (
        <p className="text-gray-600">Level: {submission.level}</p>
      )}
      <p className="text-gray-600">
        Experience: {submission.experience_years} years
      </p>
      <p className="text-sm text-gray-500">Status: {submission.status}</p>
      <p className="text-xs text-gray-400 mt-2">
        Submitted on {new Date(submission.created_at).toLocaleDateString()}
      </p>

      {isAuthenticated && submission.status === "PENDING" && (
        <div className="mt-6">
          <VoteButtons onVote={handleVote} />
        </div>
      )}
    </div>
  );
};

export default SalaryDetailPage;
