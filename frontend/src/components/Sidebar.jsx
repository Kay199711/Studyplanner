import { TbLayoutSidebarLeftCollapse } from "react-icons/tb";
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";

import {BiHome, BiCalendarEvent, BiBookBookmark, BiGridSmall} from "react-icons/bi";


export default function Sidebar({
    sidebarOpen,
    toggleSidebar,
    activeTab,
    setActiveTab,
    handleLogout,
    darkMode,
    toggleDarkMode
}){
    return(
        <div className="h-full">
            <div className="h-full bg-primary-light dark:bg-primary-dark flex flex-col">
            {/* Sidebar Header */}
            <div className={`bg-secondary-light dark:bg-secondary-dark h-12 flex items-center border-b border-highlight-light dark:border-highlight-dark ${
              sidebarOpen 
                ? 'justify-between pl-7 pr-4' 
                : 'justify-center px-2'
            }`}>
              {sidebarOpen && <h1 className="text-primary-dark dark:text-primary-light font-medium">Study Planner</h1>}
              <button 
                className="hover:cursor-pointer hover:bg-highlight-light dark:hover:bg-highlight-dark rounded-sm p-0.5" 
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
                    className={`w-full text-left block px-3 py-2 rounded-md text-primary-dark dark:text-primary-light ${
                      activeTab === 'planner' 
                        ? 'bg-highlight-light dark:bg-highlight-dark' 
                        : 'hover:bg-highlight-light dark:hover:bg-highlight-dark'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BiHome className="w-5 h-5" />
                      Planner
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-primary-dark dark:text-primary-light ${
                      activeTab === 'calendar' 
                        ? 'bg-highlight-light dark:bg-highlight-dark' 
                        : 'hover:bg-highlight-light dark:hover:bg-highlight-dark'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BiCalendarEvent className="w-5 h-5" />
                      Calendar
                    </span>
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`w-full text-left block px-3 py-2 rounded-md text-primary-dark dark:text-primary-light ${
                      activeTab === 'notes' 
                        ? 'bg-highlight-light dark:bg-highlight-dark' 
                        : 'hover:bg-highlight-light dark:hover:bg-highlight-dark'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <BiBookBookmark className="w-5 h-5" />
                      Notes
                    </span>
                  </button>
                </nav>
                <nav className="border-t border-highlight-light dark:border-highlight-dark pt-2 space-y-2">
                  <button
                    className="w-full text-left block px-3 py-2 rounded-md text-primary-dark dark:text-primary-light hover:bg-highlight-light dark:hover:bg-highlight-dark"
                  >
                    Settings
                  </button>
                  <button
                    onClick={toggleDarkMode}
                    className="w-full text-left block px-3 py-2 rounded-md text-primary-dark dark:text-primary-light hover:bg-highlight-light dark:hover:bg-highlight-dark"
                  >
                    {darkMode ? 'Light Mode' : 'Dark Mode'}
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
        </div>
    )
}