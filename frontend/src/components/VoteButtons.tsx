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
    <div className="flex gap-4">
      <button
        onClick={() => handleVote("UPVOTE")}
        className={`px-4 py-2 rounded ${voted === "UPVOTE" ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        👍 Upvote
      </button>
      <button
        onClick={() => handleVote("DOWNVOTE")}
        className={`px-4 py-2 rounded ${voted === "DOWNVOTE" ? "bg-red-600 text-white" : "bg-gray-200"}`}
      >
        👎 Downvote
      </button>
    </div>
  );
};

export default VoteButtons;
