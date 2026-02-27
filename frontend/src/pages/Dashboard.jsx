import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import Sidebar from '/src/components/Sidebar.jsx'


export default function Dashboard({darkMode, setDarkMode}) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const sidebarRef = useRef(null);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

const toggleTheme = () => {
  const newMode = !darkMode;
  setDarkMode(newMode);
  localStorage.setItem('theme', newMode ? 'dark' : 'light');
};

  return (
    <div className="h-screen overflow-hidden">
      <Group orientation="horizontal">

        <Sidebar
          sidebarRef={sidebarRef}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          />

        <Separator className="w-0.5 bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Main Content Header */}
            <div className="bg-blue-100 dark:bg-slate-800 h-12 flex items-center px-6 border-b border-gray-200">
              <h2 className="text-gray-900 dark:text-slate-100 font-medium capitalize">{activeTab}</h2>
            <button
            onClick={toggleTheme}
            className="absolute right-6 p-2 rounded-lg hover:bg-blue-200 dark:hover:bg-slate-700 transition-colors border border-blue-300 dark:border-slate-600"
            aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <span className="text-yellow-400 text-xl">☀️</span>
              ) : (
                <span className="text-slate-700 text-xl">🌙</span>
              )}
              </button>
            </div>
            
            {/* Main Content Area */}
              <div className="flex-1 bg-gray-50 dark:bg-slate-900 p-6 overflow-auto transition-colors duration-300">
              <div className="flex justify-center items-start">
                <h2 className="text-xl text-gray-700 dark:text-slate-300">Tab Content Goes Here</h2>
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}

