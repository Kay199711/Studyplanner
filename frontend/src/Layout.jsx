import { useState, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import Sidebar from './components/Sidebar';
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";


export default function Layout({ isDark, setIsDark }) {
  const location = useLocation();
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
    // Text color is set here for all children components
    <div className="h-screen overflow-hidden text-txt-primary dark:text-txt-primary-dark">
      <Group orientation="horizontal">

        <Sidebar 
          isDark={isDark} 
          setIsDark={setIsDark} 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarRef={sidebarRef}
          toggleSidebar={toggleSidebar}
        />

        <Separator className="w-0.5 bg-brd-primary dark:bg-brd-primary-dark hover:bg-blue-500 active:bg-blue-600 cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Topbar */}
            <div className="justify-between bg-primary dark:bg-primary-dark h-12 flex items-center px-6 border-b border-brd-primary dark:border-brd-primary-dark">
              <div className='flex items-center gap-2'>
                {!sidebarOpen && (
                  <button onClick={toggleSidebar}
                  className='p-0.5 rounded-sm hover:bg-hover hover:dark:bg-hover-dark cursor-pointer'>
                    <TbLayoutSidebarLeftExpand className="w-6 h-6 text-icon dark:text-icon-dark"/>
                  </button>
                )}
                <h2 className="font-medium capitalize">
                  {location.pathname.replace('/', '')}
                </h2>
              </div>
              {location.pathname === '/dashboard' && (
                <button
                  title= "Customize Dashboard"
                  className='block px-3 py-1 rounded-md hover:dark:bg-hover-dark cursor-pointer'  
                  onClick={()=>{}}
                >
                  Customize
                </button>
              )}
            </div>
            {/* Main Content Area - Child routes render here */}
            <div className="flex-1 bg-secondary dark:bg-secondary-dark overflow-auto">
              <Outlet />
            </div>
          </div>
        </Panel>

      </Group>
    </div>
  );
}
