import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { useTheme } from '../context/ThemeContext';

import Sidebar from '../components/Sidebar';


export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);
  const {darkMode, toggleDarkMode}=useTheme();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    const panel = sidebarRef.current;
    if (panel) {
      if (panel.isCollapsed()) {
        panel.expand();
      } else {
        panel.collapse();
      }
    }
  };

  return (
    <div className="h-screen overflow-hidden" >
      <Group orientation="horizontal">
        {/* Sidebar Panel */}
        <Panel 
          panelRef={sidebarRef}
          defaultSize="15%" 
          minSize="15%" 
          maxSize="30%" 
          collapsible={true} 
          collapsedSize="5%"
          onResize={(size) => {
            setSidebarOpen(size.asPercentage > 5);
          }}
        >
        <Sidebar
          sidebarOpen={sidebarOpen}
          toggleSidebar={toggleSidebar}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
          darkMode={darkMode}
          toggleDarkMode={toggleDarkMode}
        />
            
        </Panel>

        <Separator className="w-0.5 bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Main Content Header */}
            <div className="bg-secondary-light dark:bg-secondary-dark h-12 flex items-center px-6 border-b border-highlight-light dark:border-highlight-dark">
              <h2 className="text-primary-dark dark:text-primary-light font-medium capitalize">{activeTab}</h2>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 bg-primary-light dark:bg-primary-dark p-6 overflow-auto">
              <div className="flex justify-center items-start">
                <h2 className="text-primary-dark dark:text-primary-light">Tab Content Goes Here</h2>
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}

