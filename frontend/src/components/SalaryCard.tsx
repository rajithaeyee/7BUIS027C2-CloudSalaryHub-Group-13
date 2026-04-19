import { Link } from "react-router-dom";
import type { SalarySubmission } from "../types";

const SalaryCard = ({ salary }: { salary: SalarySubmission }) => {
  const isPending = salary.status?.toUpperCase() === "PENDING";

  return (
    <Link
      to={`/salary/${salary.id}`}
      className="group block bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 hover:border-indigo-100 relative overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="h-1 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {isPending && (
        <div className="absolute top-4 right-4 bg-amber-50 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200 z-10">
          Pending
        </div>
      )}

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
          {salary.role}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <span className="truncate">
            {salary.anonymize ? "Anonymous" : salary.company}
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <span>{salary.country}</span>
        </div>
        <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
          {salary.currency} {salary.salary_amount.toLocaleString()}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {salary.level && (
            <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
              {salary.level}
            </span>
          )}
          <span className="text-xs font-medium bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {salary.experience_years}y exp
          </span>
          <span className="text-xs text-gray-400 ml-auto self-center">
            {new Date(salary.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SalaryCard;
