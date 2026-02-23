import { Link } from "react-router-dom";
import type { SalarySubmission } from "../types";

const SalaryCard = ({ salary }: { salary: SalarySubmission }) => {
  return (
    <Link
      to={`/salary/${salary.id}`}
      className="block bg-white rounded shadow p-4 hover:shadow-lg"
    >
      <h3 className="font-semibold text-lg">{salary.role}</h3>
      <p className="text-gray-600">
        {salary.anonymize ? "Anonymous" : salary.company} • {salary.country}
      </p>
      <p className="text-xl font-bold mt-2">
        {salary.currency} {salary.salary.toLocaleString()}
      </p>
      {salary.level && (
        <p className="text-sm text-gray-500">Level: {salary.level}</p>
      )}
      <p className="text-xs text-gray-400 mt-2">
        {new Date(salary.created_at).toLocaleDateString()}
      </p>
    </Link>
  );
};

export default SalaryCard;
