import { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './middleware/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark';
  });
  
  useEffect(()=> {
    const root = window.document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme','dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);
  

  return (
  <AuthProvider>
      <Router>
        <div className="min-h-screen transition-colors duration-300 bg-white dark:bg-gray-900 text-black dark:text-white">
          
          <Routes> 
            <Route path="/" element={<Navigate to="/login" replace />} />

            {/* Public routes */}
            <Route element={<ProtectedRoute requireAuth={false} />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected routes */}
            <Route element={<ProtectedRoute requireAuth={true} />}>
              <Route 
                path="/dashboard" 
                element={<Dashboard darkMode={darkMode} setDarkMode={setDarkMode} />} 
              />
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </div> 
      </Router>
    </AuthProvider>
  );
}

export default App;
