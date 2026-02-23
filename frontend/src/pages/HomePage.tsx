import { useState, useEffect } from "react";
import { searchSalaries } from "../services/api";
import type { SalarySubmission } from "../types";
import SalaryCard from "../components/SalaryCard";

const HomePage = () => {
  const [salaries, setSalaries] = useState<SalarySubmission[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    company: "",
    role: "",
    country: "",
  });

  const fetchSalaries = async () => {
    setLoading(true);
    try {
      const response = await searchSalaries(filters);
      setSalaries(response.data);
    } catch (error) {
      console.error("Failed to fetch salaries", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchSalaries();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Tech Salaries</h1>
      <form onSubmit={handleSearch} className="mb-8 flex flex-wrap gap-4">
        <input
          type="text"
          placeholder="Company"
          className="border rounded px-3 py-2"
          value={filters.company}
          onChange={(e) => setFilters({ ...filters, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          className="border rounded px-3 py-2"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <input
          type="text"
          placeholder="Country"
          className="border rounded px-3 py-2"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </form>

      {loading && <p>Loading...</p>}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {salaries.map((salary) => (
          <SalaryCard key={salary.id} salary={salary} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
