import { useState, useEffect } from "react";
import { getStats } from "../services/api";
import type { Stats } from "../types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from "recharts";

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

  const formatNumber = (value: number | null | undefined): string => {
    if (value == null) return "N/A";
    const num = Number(value);
    return isNaN(num) ? "N/A" : num.toFixed(2);
  };

  // Prepare data for bar chart
  const barData = stats
    ? [
        { name: "Average", value: Number(stats.average) },
        { name: "Median", value: Number(stats.median) },
        { name: "25th Percentile", value: Number(stats.p25) },
        { name: "75th Percentile", value: Number(stats.p75) },
      ].filter((item) => !isNaN(item.value))
    : [];

  // Pie data: breakdown by percentiles (just a visual)
  const pieData = stats
    ? [
        {
          name: "Below 25th",
          value: stats.count > 0 ? Math.round(stats.count * 0.25) : 0,
        },
        {
          name: "25th-75th",
          value: stats.count > 0 ? Math.round(stats.count * 0.5) : 0,
        },
        {
          name: "Above 75th",
          value: stats.count > 0 ? Math.round(stats.count * 0.25) : 0,
        },
      ]
    : [];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">
        Salary Statistics
      </h1>
      <p className="text-gray-500 mb-6">Insights from community salaries</p>

      <form onSubmit={handleFilter} className="mb-8 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Country"
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filters.country}
          onChange={(e) => setFilters({ ...filters, country: e.target.value })}
        />
        <input
          type="text"
          placeholder="Role"
          className="flex-1 min-w-[150px] px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        />
        <button
          type="submit"
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </form>

      {loading && (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      )}

      {!loading && stats && stats.count === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No data available for the selected filters.
        </div>
      )}

      {!loading && stats && stats.count > 0 && (
        <div className="space-y-8">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Number of Salaries</p>
              <p className="text-3xl font-bold text-gray-900">{stats.count}</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Average</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(stats.average)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Median</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(stats.median)}
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <p className="text-sm text-gray-500">Range (25th-75th)</p>
              <p className="text-3xl font-bold text-gray-900">
                {formatNumber(stats.p25)} – {formatNumber(stats.p75)}
              </p>
            </div>
          </div>

          {/* Bar Chart */}
          {barData.length > 0 && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Distribution Metrics
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) => formatNumber(value as number)}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart - Example of distribution */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Estimated Distribution (based on percentiles)
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} salaries`} />
              </PieChart>
            </ResponsiveContainer>
            <p className="text-xs text-gray-400 text-center mt-2">
              Note: Distribution based on the count of salaries and percentile
              positions.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
