import { useAuth } from '../context/AuthContext';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Panel } from 'react-resizable-panels';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { HiOutlineMoon, HiOutlineSun } from 'react-icons/hi';
import { PiBooks } from "react-icons/pi";
import { MdOutlineCalendarMonth } from "react-icons/md";
import { MdOutlineSettings } from "react-icons/md";
import { HiOutlineLogout } from "react-icons/hi";
import { LuLayoutDashboard } from "react-icons/lu";
import { BiBookReader } from "react-icons/bi";
import { useState } from 'react';
import Settings from './Settings';

export default function Sidebar({ isDark, setIsDark, sidebarOpen, setSidebarOpen, sidebarRef, toggleSidebar }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Panel
      panelRef={sidebarRef}
      defaultSize="15%" 
      minSize="15%" 
      maxSize="30%" 
      collapsible={true} 
      collapsedSize="4%"
      onResize={(size) => {
        console.log(size.asPercentage);
        setSidebarOpen(size.asPercentage > 5);
      }}
    >
      <div className="h-full bg-primary dark:bg-primary-dark flex flex-col">
        <div className={`h-12 flex items-center border-b border-brd-primary dark:border-brd-primary-dark ${
          sidebarOpen 
            ? 'justify-between pl-7 pr-4' 
            : 'justify-center px-2'
        }`}>
          {sidebarOpen && (
            <div className="flex items-center gap-2">
            <BiBookReader className='w-5 h-5 text-icon dark:text-icon-dark'/>
            <h1 className="font-medium">Study Planner</h1>
          </div>
          )}
          {!sidebarOpen && <BiBookReader className='w-6 h-6 text-icon dark:text-icon-dark justify-center' />}
          <button 
            className="hover:cursor-pointer hover:bg-hover hover:dark:bg-hover-dark rounded-sm p-0.5" 
            onClick={toggleSidebar}
          >
            {sidebarOpen && (
              <TbLayoutSidebarLeftCollapse className="w-6 h-6 text-icon dark:text-icon-dark" />
            )}
          </button>
        </div>
        
        {/* Sidebar Navigation */}
        {sidebarOpen ? (
          <div className="flex-1 p-4 flex flex-col overflow-auto">
            <nav className="space-y-2 flex-1">
              <Link
                to="/dashboard"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive('/dashboard') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                <LuLayoutDashboard className='flex w-5 h-5 text-icon dark:text-icon-dark' />
                Dashboard
              </Link>
              <Link
                to="/calendar"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive('/calendar') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                <MdOutlineCalendarMonth className='w-5 h-5 text-icon dark:text-icon-dark'/>
                Calendar
              </Link>
              <Link
                to="/resources"
                className={`flex items-center gap-2 px-3 py-2 rounded-md ${
                  isActive('/resources') 
                    ? 'bg-hover dark:bg-hover-dark' 
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
              >
                <PiBooks className='w-5 h-5 text-icon dark:text-icon-dark'/>
                Resources
              </Link>
            </nav>
            <nav className="border-t border-brd-primary dark:border-brd-primary-dark pt-2 space-y-2">
              <button
                onClick={() => setIsDark(!isDark)}
                className="w-full text-left flex items-center gap-1 px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
                aria-label="Toggle dark mode"
                title="Toggle Dark Mode"
              >
                {isDark ? (
                  <HiOutlineSun className="w-5 h-5 text-icon dark:text-icon-dark" />
                ) : (
                  <HiOutlineMoon className="w-5 h-5 text-icon dark:text-icon-dark" />
                )} Toggle Theme
              </button>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="w-full text-left flex items-center gap-1 px-3 py-2 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
              >
                <MdOutlineSettings className='w-5 h-5 text-icon dark:text-icon-dark '/>
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
         ) : (
              /* Minimized Sidebar Navigation */
              <div className="flex-1 flex flex-col items-center gap-4 pt-4">
                <nav className='flex-1 flex flex-col items-center gap-4 pt-4'>
                <Link to="/dashboard" 
                  className={`p-1.5 rounded-md cursor-pointer ${
                    isActive('/dashboard')
                    ? 'bg-hover dark:bg-hover-dark'
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                }`}
                >
                  <LuLayoutDashboard className='w-6 h-6 text-icon dark:text-icon-dark' />
                </Link>
                <Link to="/calendar"
                  className={`p-1.5 rounded-md cursor-pointer ${
                    isActive('/calendar')
                    ? 'bg-hover dark:bg-hover-dark'
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                  }`}
                >
                  <MdOutlineCalendarMonth className='w-6 h-6 text-icon dark:text-icon-dark' />
                </Link>
                <Link to="/resources" 
                  className={`p-1.5 rounded-md cursor-pointer ${
                    isActive('/resources')
                    ? 'bg-hover dark:bg-hover-dark'
                    : 'hover:bg-hover hover:dark:bg-hover-dark'
                  }`}
                >
                  <PiBooks className='w-6 h-6 text-icon dark:text-icon-dark' />
                </Link>
                </nav>

                <nav className= 'border-t-2 border-brd-primary dark:border-brd-primary-dark pt-2 flex flex-col gap-4 items-center'>
                  <button 
                    title = "Toggle Dark Mode"
                    className="p-1.5 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
                    onClick={() => setIsDark(!isDark)}
                    >
                    {isDark ? (
                      <HiOutlineSun className='w-6 h-6 text-icon dark:text-icon-dark'/>
                    ) : (
                      <HiOutlineMoon className='w-6 h-6 text-icon dark:text-icon-dark'/>
                    )}
                  </button>
                  <button
                    title="Settings"
                    className="p-1.5 rounded-md hover:bg-hover hover:dark:bg-hover-dark cursor-pointer"
                    onClick={() => {}}
                  >
                    <MdOutlineSettings className='w-6 h-6 text-icon dark:text-icon-dark' />
                  </button>
                  <button
                    title="Logout"
                    className='p-1.5 bg-red-600 text-white rounded-md hover:cursor-pointer hover:bg-red-700 mb-4'
                    onClick={handleLogout}
                  >
                    <HiOutlineLogout className='w-6 h-6 dark:text-icon-dark'/>
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