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
    return isNaN(num) ? "N/A" : num.toLocaleString(undefined, { maximumFractionDigits: 0 });
  };

  const barData = stats
    ? [
        { name: "Average", value: Number(stats.average) },
        { name: "Median", value: Number(stats.median) },
        { name: "25th %", value: Number(stats.p25) },
        { name: "75th %", value: Number(stats.p75) },
      ].filter((item) => !isNaN(item.value))
    : [];

  const pieData = stats
    ? [
        { name: "Below 25th", value: stats.count > 0 ? Math.round(stats.count * 0.25) : 0 },
        { name: "25th-75th", value: stats.count > 0 ? Math.round(stats.count * 0.5) : 0 },
        { name: "Above 75th", value: stats.count > 0 ? Math.round(stats.count * 0.25) : 0 },
      ]
    : [];

  const COLORS = ["#6366f1", "#8b5cf6", "#a78bfa"];

  const metricCards = stats
    ? [
        { label: "Total Salaries", value: String(stats.count), color: "from-indigo-500 to-indigo-600" },
        { label: "Average", value: formatNumber(stats.average), color: "from-violet-500 to-violet-600" },
        { label: "Median", value: formatNumber(stats.median), color: "from-purple-500 to-purple-600" },
        { label: "Range (25th-75th)", value: `${formatNumber(stats.p25)} - ${formatNumber(stats.p75)}`, color: "from-fuchsia-500 to-fuchsia-600" },
      ]
    : [];

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          Salary Statistics
        </h1>
        <p className="text-gray-500 mt-1 text-lg">Insights from community-shared salaries</p>
      </div>

      {/* Filters */}
      <form onSubmit={handleFilter} className="mb-8">
        <div className="flex flex-wrap gap-3 bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
          <input
            type="text"
            placeholder="Country"
            className="flex-1 min-w-[150px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
            value={filters.country}
            onChange={(e) => setFilters({ ...filters, country: e.target.value })}
          />
          <input
            type="text"
            placeholder="Role"
            className="flex-1 min-w-[150px] px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm"
            value={filters.role}
            onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium text-sm hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200"
          >
            Apply Filters
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
      {!loading && stats && stats.count === 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center text-gray-500">
          No data available for the selected filters.
        </div>
      )}

      {!loading && stats && stats.count > 0 && (
        <div className="space-y-6">
          {/* Metric cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {metricCards.map((card) => (
              <div key={card.label} className="relative overflow-hidden bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${card.color}`} />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{card.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Bar Chart */}
          {barData.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Distribution Metrics
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={barData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <Tooltip formatter={(value) => formatNumber(Number(value))} />
                  <Legend />
                  <Bar dataKey="value" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Estimated Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: { name?: string; percent?: number }) =>
                    `${props.name ?? ""}: ${((props.percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={90}
                  innerRadius={50}
                  fill="#8884d8"
                  dataKey="value"
                  strokeWidth={2}
                  stroke="#fff"
                >
                  {pieData.map((_entry, index) => (
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
              Based on the count of salaries and percentile positions
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
