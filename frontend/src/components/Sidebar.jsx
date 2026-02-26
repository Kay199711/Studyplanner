import { useState, useRef } from 'react';
import { Panel } from 'react-resizable-panels';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";

export default function Sidebar({ activeTab, setActiveTab, handleLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

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
  );
}
