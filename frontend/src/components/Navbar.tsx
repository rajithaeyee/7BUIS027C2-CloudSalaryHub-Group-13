import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold text-blue-600 tracking-tight"
        >
          SalaryView
        </Link>
        <div className="space-x-6">
          <Link
            to="/"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Home
          </Link>
          <Link
            to="/submit"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Submit
          </Link>
          <Link
            to="/stats"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Stats
          </Link>
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="text-gray-600 hover:text-blue-600 transition-colors"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Signup
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
