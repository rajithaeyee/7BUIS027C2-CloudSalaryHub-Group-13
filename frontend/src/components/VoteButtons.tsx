import { useState } from "react";

const VoteButtons = ({
  onVote,
}: {
  onVote: (voteType: "UPVOTE" | "DOWNVOTE") => void;
}) => {
  const [voted, setVoted] = useState<"UPVOTE" | "DOWNVOTE" | null>(null);

  const handleVote = (type: "UPVOTE" | "DOWNVOTE") => {
    setVoted(type);
    onVote(type);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={() => handleVote("UPVOTE")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
          voted === "UPVOTE"
            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-200"
            : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
        Upvote
      </button>
      <button
        onClick={() => handleVote("DOWNVOTE")}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${
          voted === "DOWNVOTE"
            ? "bg-rose-500 text-white shadow-lg shadow-rose-200"
            : "bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100"
        }`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
        Downvote
      </button>
    </div>
  );
};

export default VoteButtons;
