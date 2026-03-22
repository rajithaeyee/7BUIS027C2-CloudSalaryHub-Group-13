import { useState, useEffect } from "react";
import { searchSalaries } from "../services/api";
import type { SalarySubmission } from "../types";
import SalaryCard from "../components/SalaryCard";
import { useAuth } from "../contexts/AuthContext";

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
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Tech Salaries</h1>
      <p className="text-gray-500 mb-6">
        Discover real salaries shared by the tech community
      </p>

      {!isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-blue-700">
            🔒 <strong>Log in</strong> to see pending salaries and vote!
          </p>
        </div>
      )}
      {isAuthenticated && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-yellow-700">
            🟡 <strong>Pending</strong> badges show salaries that need your
            vote. Click to vote!
          </p>
        </div>
      )}

      <form onSubmit={handleSearch} className="mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Company"
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && salaries.length === 0 && (
        <div className="text-center py-12 text-gray-500">
          No salaries found. Be the first to submit one!
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {salaries.map((salary) => (
          <SalaryCard key={salary.id} salary={salary} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
