import { TbLayoutSidebarLeftCollapse, TbLayoutSidebarLeftExpand } from "react-icons/tb";
import { Panel } from 'react-resizable-panels';

export default function Sidebar({
    sidebarRef,
    sidebarOpen,
    setSidebarOpen,
    activeTab,
    setActiveTab,
    handleLogout,
    darkMode,
    setDarkMode,
}) { 


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

const handleThemeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
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
            {/* Main Container */}
          <div className="h-full bg-white dark:bg-slate-900 flex flex-col transition-colors duration-300">
            {/* Sidebar Header */}
            <div className={`bg-blue-100 dark:bg-slate-800 h-12 flex items-center border-b border-gray-200 ${
              sidebarOpen 
                ? 'justify-between pl-7 pr-4' 
                : 'justify-center px-2'
            }`}>
              {sidebarOpen && <h1 className="text-gray-900 dark:text-white font-medium">Study Planner</h1>}
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
                        ? 'bg-gray-300 dark:bg-neutral-800' 
                        : 'hover:bg-gray-200 dark:hover:bg-neutral-800 dark:text-slate-200'
                    }`}
                  >
                    Planner
                  </button>
                  <button
                    onClick={() => setActiveTab('calendar')}
                    className={`w-full text-left block px-3 py-2 rounded-md ${
                      activeTab === 'calendar' 
                        ? 'bg-gray-300 dark:bg-neutral-800' 
                        : 'hover:bg-gray-300 dark:hover:bg-neutral-800 dark:text-slate-200'
                    }`}
                  >
                    Calendar
                  </button>
                  <button
                    onClick={() => setActiveTab('notes')}
                    className={`w-full text-left block px-3 py-2 rounded-md ${
                      activeTab === 'notes' 
                        ? 'bg-gray-300 dark:bg-neutral-800' 
                        : 'hover:bg-gray-300 dark:hover:bg-neutral-800 dark:text-slate-200'
                    }`}
                  >
                    Notes
                  </button>
                </nav>
                <nav className="border-t border-gray-200 pt-2 space-y-2">
                  <button
                    className="w-full text-left block px-3 py-2 rounded-md text-gray-700 dark:text-white hover:bg-gray-300 hover:dark:bg-neutral-800"
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