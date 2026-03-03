import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { MdDarkMode } from "react-icons/md";    // Dark mode toggle icon <MdDarkMode />


import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('planner');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  return (
    <div className="h-screen overflow-hidden">
      <Group orientation="horizontal">
        {/* Sidebar Panel */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

        <Separator className="w-0.5 bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Main Content Header */}
            <div className="bg-light-secondary dark:bg-dark-secondary h-12 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-light-text dark:text-dark-text font-medium capitalize">{activeTab}</h2>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                title="Toggle dark mode"
              >
                <MdDarkMode className="w-5 h-5 text-light-text dark:text-dark-text" />
              </button>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 bg-light-bg dark:bg-dark-bg p-6 overflow-auto">
              <div className="flex justify-center items-start">
                <h2 className="text-xl text-light-text dark:text-dark-text">Tab Content Goes Here</h2>
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}

