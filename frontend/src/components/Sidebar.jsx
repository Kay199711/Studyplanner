import { useState, useRef } from 'react';
import { Panel } from 'react-resizable-panels';
import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
// imported react icons for the sidebar tabs
import { IoIosTimer } from "react-icons/io";    // Focus tab icon <IoIosTimer />
import { MdOutlineTimer } from "react-icons/md";    // Alternative Focus tab icon <MdOutlineTimer />
import { FcTodoList } from "react-icons/fc";    // Todo tab icon <FcTodoList />
import { LuListTodo } from "react-icons/lu";    // Alternative Todo tab icon <LuListTodo />
import { FaRegNoteSticky } from "react-icons/fa6";    // Notes tab icon <FaRegNoteSticky />
import { FaRegCalendarAlt } from "react-icons/fa";    // Calendar tab icon <FaRegCalendarAlt />
import { RxDashboard } from "react-icons/rx";     // Planner tab icon <RxDashboard />



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
      <div className="h-full bg-light-bg dark:bg-dark-bg flex flex-col">
        {/* Sidebar Header */}
        <div className={`bg-light-secondary dark:bg-dark-secondary h-12 flex items-center border-b border-gray-200 dark:border-gray-700 ${
          sidebarOpen 
            ? 'justify-between pl-7 pr-4' 
            : 'justify-center px-2'
        }`}>
          {sidebarOpen && <h1 className="text-light-text dark:text-dark-text font-medium">Study Planner</h1>}
          <button 
            className="hover:cursor-pointer hover:bg-light-secondary dark:hover:bg-dark-secondary rounded-sm p-0.5 text-light-text dark:text-dark-text" 
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
                className={`w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text ${
                  activeTab === 'planner' 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Planner<RxDashboard />
              </button>
              <button
                onClick={() => setActiveTab('calendar')}
                className={`w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text ${
                  activeTab === 'calendar' 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Calendar<FaRegCalendarAlt />
              </button>
              <button
                onClick={() => setActiveTab('notes')}
                className={`w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text ${
                  activeTab === 'notes' 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Notes<FaRegNoteSticky />
              </button>
              <button
                onClick={() => setActiveTab('todo')}
                className={`w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text ${
                  activeTab === 'todo' 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                Todo<LuListTodo />
              </button>
              <button
                onClick={() => setActiveTab('focus')}
                className={`w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text ${
                  activeTab === 'focus' 
                    ? 'bg-gray-400 dark:bg-gray-600' 
                    : 'hover:bg-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                
                Focus<MdOutlineTimer />
              </button>
            </nav>
            <nav className="border-t border-gray-200 dark:border-gray-700 pt-2 space-y-2">
              <button
                className="w-full text-left block px-3 py-2 rounded-md text-light-text dark:text-dark-text hover:bg-gray-300 dark:hover:bg-gray-700"
              >
                Settings
              </button>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:cursor-pointer hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500"
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
