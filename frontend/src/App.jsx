import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './middleware/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Calendar from './pages/calendar/Calendar';
import Resources from './pages/resources/Resources';
import Login from './pages/auth/Login'
import Layout from './Layout';
import ProfilePage from './components/ProfilePage';

function App() {
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public routes */}
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/login" element={<Login />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute requireAuth={true} />}>
            <Route element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
