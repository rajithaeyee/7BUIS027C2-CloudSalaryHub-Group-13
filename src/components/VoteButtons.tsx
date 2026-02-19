import { useState } from "react";

const VoteButtons = ({ onVote }: { onVote: (voteType: boolean) => void }) => {
  const [voted, setVoted] = useState<boolean | null>(null);

  const handleVote = (type: boolean) => {
    setVoted(type);
    onVote(type);
  };

  return (
    <div className="flex gap-4">
      <button
        onClick={() => handleVote(true)}
        className={`px-4 py-2 rounded ${voted === true ? "bg-green-600 text-white" : "bg-gray-200"}`}
      >
        👍 Upvote
      </button>
      <button
        onClick={() => handleVote(false)}
        className={`px-4 py-2 rounded ${voted === false ? "bg-red-600 text-white" : "bg-gray-200"}`}
      >
        👎 Downvote
      </button>
    </div>
  );
};

export default VoteButtons;
