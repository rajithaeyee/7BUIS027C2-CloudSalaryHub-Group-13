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
    salary: "",
    currency: "USD",
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
        salary: parseFloat(formData.salary),
      });
      navigate("/");
    } catch (err) {
      setError("Submission failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-3xl font-bold mb-6">Submit Your Salary</h1>
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1">Company (optional)</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Role *</label>
          <input
            type="text"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Level (e.g., Senior)</label>
          <input
            type="text"
            name="level"
            value={formData.level}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Country *</label>
          <input
            type="text"
            name="country"
            required
            value={formData.country}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Salary *</label>
          <input
            type="number"
            name="salary"
            required
            min="0"
            step="1000"
            value={formData.salary}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block mb-1">Currency</label>
          <select
            name="currency"
            value={formData.currency}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          >
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
            <option value="LKR">LKR</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="anonymize"
            id="anonymize"
            checked={formData.anonymize}
            onChange={handleChange}
            className="mr-2"
          />
          <label htmlFor="anonymize">
            Anonymize my submission (hide company name)
          </label>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SubmitPage;
