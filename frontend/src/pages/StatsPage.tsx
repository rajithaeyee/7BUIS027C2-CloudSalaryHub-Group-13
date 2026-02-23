import { useState, useEffect } from "react";
import { getStats } from "../services/api";
import type { Stats } from "../types";

const StatsPage = () => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({ country: "", role: "" });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await getStats(filters);
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleFilter = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStats();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Salary Statistics</h1>
      <form onSubmit={handleFilter} className="mb-8 flex gap-4">
        <input
          type="text"
          placeholder="Country"
          className="border rounded px-3 py-2"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          className="border rounded px-3 py-2"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Apply
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {stats && (
        <div className="bg-white p-6 rounded shadow">
          <p className="text-lg">Average: {stats.average.toFixed(2)}</p>
          <p className="text-lg">Median: {stats.median.toFixed(2)}</p>
          <p className="text-lg">25th Percentile: {stats.p25.toFixed(2)}</p>
          <p className="text-lg">75th Percentile: {stats.p75.toFixed(2)}</p>
          <p className="text-lg">Number of salaries: {stats.count}</p>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
