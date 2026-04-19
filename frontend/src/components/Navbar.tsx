import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileOpen(false);
    navigate("/");
  };

  const isActive = (path: string) => location.pathname === path;

  const navLink = (to: string, label: string) => (
    <Link
      to={to}
      onClick={() => setMobileOpen(false)}
      className={`text-sm font-medium transition-colors ${
        isActive(to)
          ? "text-indigo-600"
          : "text-gray-600 hover:text-indigo-600"
      }`}
    >
      {label}
    </Link>
  );

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold shadow-md shadow-indigo-200">
            S
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
            SalaryView
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLink("/", "Home")}
          {navLink("/submit", "Submit")}
          {navLink("/stats", "Stats")}

          {isAuthenticated ? (
            <div className="flex items-center gap-4 pl-4 border-l border-gray-200">
              <span className="text-sm text-gray-500">
                Hi, <span className="font-medium text-gray-700">{user?.username}</span>
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-500 hover:text-rose-600 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl hover:from-indigo-700 hover:to-violet-700 transition-all shadow-md shadow-indigo-200"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          aria-label="Toggle menu"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-3">
          {navLink("/", "Home")}
          {navLink("/submit", "Submit")}
          {navLink("/stats", "Stats")}
          <hr className="border-gray-100" />
          {isAuthenticated ? (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                Signed in as <span className="font-medium text-gray-700">{user?.username}</span>
              </p>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-rose-600"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex gap-3">
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium text-indigo-600 border border-indigo-200 px-4 py-2 rounded-xl"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 text-center text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-4 py-2 rounded-xl"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
