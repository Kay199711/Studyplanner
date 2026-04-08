import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './middleware/ProtectedRoute';
import Dashboard from './pages/dashboard/Dashboard';
import Calendar from './pages/calendar/Calendar';
import Resources from './pages/resources/ResourcesMainPage';
import Landing from './pages/landing/Landing';
import Layout from './Layout';

import ResourceTab from './pages/resources/Resources';

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
          {/* Public routes */}
          <Route element={<ProtectedRoute requireAuth={false} />}>
            <Route path="/" element={<Landing />} />
          </Route>

          {/* Protected routes */}
          <Route element={<ProtectedRoute requireAuth={true} />}>
            <Route element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/resources" element={<Resources />} />
            </Route>
            <Route path="/rt" element={<Resources />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
