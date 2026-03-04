import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import ProtectedRoute from './middleware/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Calendar from './pages/Calendar';
import Notes from './pages/Notes';

function App() {
  return (
    <ThemeProvider>
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
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/calendar" element={<Calendar/>} />
            <Route path="/notes" element={<Notes />} />
          </Route>
          

          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
