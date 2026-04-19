import { useState } from "react";
import { submitSalary } from "../services/api";
import { useNavigate } from "react-router-dom";

const SubmitPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    level: "",
    country: "",
    city: "",
    salary_amount: "",
    currency: "LKR",
    experience_years: "",
    anonymize: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await submitSalary({
        ...formData,
        salary_amount: parseFloat(formData.salary_amount),
        experience_years: parseInt(formData.experience_years),
      });
      navigate("/");
    } catch {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full px-4 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-sm";

  return (
    <div className="container mx-auto px-4 py-10 max-w-2xl">
      <div className="bg-white rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-6">
          <h1 className="text-2xl font-bold text-white">Submit Your Salary</h1>
          <p className="text-indigo-100 text-sm mt-1">
            Share anonymously and help the community
          </p>
        </div>

        <div className="p-8">
          {error && (
            <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-6 text-rose-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Company <span className="text-gray-400">(optional)</span>
              </label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="e.g. Google, Meta..."
                className={inputClass}
              />
            </div>

            {/* Role + Level */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Role <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="role"
                  required
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="e.g. Software Engineer"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Level <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  placeholder="e.g. Senior, L5"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Country + City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Country <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={formData.country}
                  onChange={handleChange}
                  placeholder="e.g. Sri Lanka"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  City <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Colombo"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Salary + Currency */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Monthly Salary <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  name="salary_amount"
                  required
                  min="0"
                  step="1000"
                  value={formData.salary_amount}
                  onChange={handleChange}
                  placeholder="e.g. 500000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Currency
                </label>
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="LKR">LKR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </div>
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Years of Experience <span className="text-rose-500">*</span>
              </label>
              <input
                type="number"
                name="experience_years"
                required
                min="0"
                step="1"
                value={formData.experience_years}
                onChange={handleChange}
                placeholder="e.g. 3"
                className={inputClass}
              />
            </div>

            {/* Anonymize */}
            <label className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors">
              <input
                type="checkbox"
                name="anonymize"
                checked={formData.anonymize}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">Anonymize submission</p>
                <p className="text-xs text-gray-500">Hide your company name from public view</p>
              </div>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white py-3 rounded-xl font-semibold hover:from-indigo-700 hover:to-violet-700 transition-all disabled:opacity-50 shadow-lg shadow-indigo-200"
            >
              {loading ? "Submitting..." : "Submit Salary"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmitPage;
