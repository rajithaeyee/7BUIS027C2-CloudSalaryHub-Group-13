import { Link } from "react-router-dom";
import type { SalarySubmission } from "../types";

const SalaryCard = ({ salary }: { salary: SalarySubmission }) => {
  const isPending = salary.status?.toUpperCase() === "PENDING";

  return (
    <Link
      to={`/salary/${salary.id}`}
      className="group block bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-gray-100 hover:border-gray-200 relative overflow-hidden"
    >
      {isPending && (
        <div className="absolute top-3 right-3 bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-1 rounded-full z-10">
          Pending
        </div>
      )}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
          {salary.role}
        </h3>
        <div className="flex items-center text-sm text-gray-500 mb-2">
          <span className="truncate">
            {salary.anonymize ? "Anonymous" : salary.company}
          </span>
          <span className="mx-2">•</span>
          <span>{salary.country}</span>
        </div>
        <p className="text-2xl font-bold text-gray-900 mt-2">
          {salary.currency} {salary.salary_amount.toLocaleString()}
        </p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-500">
          {salary.level && <span>Level: {salary.level}</span>}
          <span>Experience: {salary.experience_years} years</span>
          <span className="text-xs">
            {new Date(salary.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default SalaryCard;
