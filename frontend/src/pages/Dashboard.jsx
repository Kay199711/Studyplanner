import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('planner');
  const [sidebarOpen, setSidebarOpen] = useState(true);
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

  return (
    <div className="h-screen overflow-hidden">
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
          <div className="h-full bg-white flex flex-col">
            {/* Sidebar Header */}
            <div className={`bg-blue-100 h-12 flex items-center border-b border-gray-200 ${
              sidebarOpen 
                ? 'justify-between pl-7 pr-4' 
                : 'justify-center px-2'
            }`}>
              {sidebarOpen && <h1 className="text-gray-900 font-medium">Study Planner</h1>}
              <button 
                className="hover:cursor-pointer hover:bg-gray-300 rounded-sm p-0.5" 
                onClick={toggleSidebar}
              >
                {sidebarOpen ? (
                  <TbLayoutSidebarLeftCollapse className="w-6 h-6" />
                ) : (
                  <TbLayoutSidebarLeftExpand className="w-6 h-6" />
                )}
              </button>
            </div>
            
            {/* Sidebar Navigation */}
            {sidebarOpen && (
              <div className="flex-1 p-4 flex flex-col overflow-auto">
                <nav className="space-y-2 flex-1">
                  <button
                    onClick={() => setActiveTab('planner')}
                    className={`w-full text-left block px-3 py-2 rounded-md ${
                      activeTab === 'planner' 
                        ? 'bg-gray-300' 
                        : 'hover:bg-gray-300'
                    }`}
                  >
                    Planner
                  </button>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`w-full text-left block px-3 py-2 rounded-md ${
                      activeTab === 'calendar' 
                        ? 'bg-gray-300' 
                        : 'hover:bg-gray-300'
                    }`}
                  >
                    Calendar
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`w-full text-left block px-3 py-2 rounded-md ${
                      activeTab === 'notes' 
                        ? 'bg-gray-300' 
                        : 'hover:bg-gray-300'
                    }`}
                  >
                    Notes
                  </button>
                </nav>
                <nav className="border-t border-gray-200 pt-2 space-y-2">
                  <button
                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-300"
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
        </Panel>

        <Separator className="w-0.5 bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Main Content Header */}
            <div className="bg-blue-100 h-12 flex items-center px-6 border-b border-gray-200">
              <h2 className="text-gray-900 font-medium capitalize">{activeTab}</h2>
            </div>
            
            {/* Main Content Area */}
            <div className="flex-1 bg-gray-50 p-6 overflow-auto">
              <div className="flex justify-center items-start">
                <h2 className="text-xl text-gray-700">Tab Content Goes Here</h2>
              </div>
            </div>
          </div>
        </Panel>
      </Group>
    </div>
  );
}

