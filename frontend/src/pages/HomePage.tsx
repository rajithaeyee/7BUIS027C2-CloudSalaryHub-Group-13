import { useState, useEffect } from "react";
import { searchSalaries } from "../services/api";
import type { SalarySubmission } from "../types";
import SalaryCard from "../components/SalaryCard";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";

const HomePage = () => {
  const [salaries, setSalaries] = useState<SalarySubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    country: "",
  });
  const { isAuthenticated } = useAuth();

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await searchSalaries(filters);
      setSalaries(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Failed to fetch salaries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  useEffect(() => {
    fetchSalaries();
  }, [isAuthenticated]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalaries();
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Hero */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Tech Salaries
        </h1>
        <p className="text-gray-500 mt-1 text-lg">
          Discover real salaries shared by the tech community
        </p>
      </div>

      {/* Auth banners */}
      {!isAuthenticated && (
        <div className="bg-gradient-to-r from-indigo-50 to-violet-50 border border-indigo-100 rounded-2xl p-4 mb-6 flex items-center justify-between">
          <p className="text-indigo-700 text-sm">
            <strong>Log in</strong> to see pending salaries and vote on submissions.
          </p>
          <Link
            to="/login"
            className="text-xs font-semibold text-indigo-600 bg-white border border-indigo-200 px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors whitespace-nowrap ml-4"
          >
            Log in
          </Link>
        </div>
      )}
      {isAuthenticated && (
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-6">
          <p className="text-amber-700 text-sm">
            <strong>Pending</strong> badges show salaries awaiting community votes. Click to review!
          </p>
        </div>
      )}

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="Company"
            className="flex-1 min-w-[140px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
            value={filters.company}
            onChange={(e) => setFilters({ ...filters, company: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            className="flex-1 min-w-[140px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
          <input
            type="text"
            placeholder="Country"
            className="flex-1 min-w-[140px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium text-sm hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200"
          >
            Search
          </button>
        </div>
      </form>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-[3px] border-gray-200 border-t-indigo-600"></div>
        </div>
      )}

      {/* Empty */}
      {!loading && salaries.length === 0 && (
        <div className="text-center py-16">
          <div className="text-4xl mb-3 opacity-30">$</div>
          <p className="text-gray-500 mb-4">No salaries found.</p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            Be the first to submit one
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}

      {/* Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {salaries.map((salary) => (
          <SalaryCard key={salary.id} salary={salary} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
