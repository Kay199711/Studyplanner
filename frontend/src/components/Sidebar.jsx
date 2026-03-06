import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Panel } from 'react-resizable-panels';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import Settings from './Settings';

export default function Sidebar({ isDark, setIsDark }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const sidebarRef = useRef(null);

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

  const isActive = (path) => location.pathname === path;

  return (
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
      <div className="h-full bg-primary dark:bg-primary-dark flex flex-col">
        {/* Sidebar Header */}
        <div className={`h-12 flex items-center border-b border-brd-primary dark:border-brd-primary-dark ${
          sidebarOpen 
            ? 'justify-between pl-7 pr-4' 
            : 'justify-center px-2'
        }`}>
          {sidebarOpen && <h1 className="font-medium">Study Planner</h1>}
          <button 
            className="hover:cursor-pointer hover:bg-hover hover:dark:bg-hover-dark rounded-sm p-0.5" 
            onClick={toggleSidebar}
          >
            {sidebarOpen ? (
              <TbLayoutSidebarLeftCollapse className="w-6 h-6  text-icon dark:text-icon-dark" />
            ) : (
              <TbLayoutSidebarLeftExpand className="w-6 h-6 text-icon dark:text-icon-dark" />
            )}
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        {sidebarOpen && (
          <div className="flex-1 p-4 flex flex-col overflow-auto">
            <nav className="space-y-2 flex-1">
              <Link
                to="/dashboard"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/dashboard') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/calendar') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                Calendar
              </Link>
              <Link
                to="/resources"
                className={`block px-3 py-2 rounded-md ${
                  isActive('/resources') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                Resources
              </Link>
            </nav>
            <nav className="border-t border-brd-primary dark:border-brd-primary-dark pt-2 space-y-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-full text-left flex items-center gap-1 px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
                aria-label="Toggle dark mode"
              >
                {isDark ? (
                  <HiOutlineSun className="w-5 h-5 text-icon dark:text-icon-dark" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5 text-icon dark:text-icon-dark" />
                )} Toggle Theme
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full text-left block px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:cursor-pointer hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Logout
              </button>
            </nav>
          </div>
        )}
      </div>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        isDark={isDark}
        setIsDark={setIsDark}
      />
    </Panel>
  );
}
