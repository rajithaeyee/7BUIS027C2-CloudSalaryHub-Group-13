import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SubmitPage from "./pages/SubmitPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import StatsPage from "./pages/StatsPage";
import SalaryDetailPage from "./pages/SalaryDetailPage";

const AppLoader = () => {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white text-xl font-bold mb-4 animate-pulse">
            S
          </div>
          <p className="text-sm text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/salary/:id" element={<SalaryDetailPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppLoader />
    </AuthProvider>
  );
}

export default App;
