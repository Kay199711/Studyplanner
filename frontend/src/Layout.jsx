import { useState, useRef } from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import Sidebar from './components/Sidebar';
import CustomizeDashboard from './components/CustomizeDashboard';
import { TbLayoutSidebarLeftExpand } from "react-icons/tb";

export default function Layout({ isDark, setIsDark }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const sidebarRef = useRef(null);

  // Customize state lifted here so the topbar button can control it
  const [visible, setVisible] = useState({todo: true, note: true, shelf: true, calendar: true});

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
    <div className="h-screen overflow-hidden text-txt-primary dark:text-txt-primary-dark">
      <Group orientation="horizontal">

        <Sidebar
          isDark={isDark}
          setIsDark={setIsDark}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          sidebarRef={sidebarRef}
          toggleSidebar={toggleSidebar}
          visible={visible}
          setVisible={setVisible}
        />

        <Separator className="w-0.5 bg-brd-primary dark:bg-brd-primary-dark hover:bg-blue-500 active:bg-blue-600 cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Topbar */}
            <div className="justify-between bg-primary dark:bg-primary-dark h-12 flex items-center px-6 border-b border-brd-primary dark:border-brd-primary-dark">
              <div className='flex items-center gap-2'>
                {!sidebarOpen && (
                  <button
                    onClick={toggleSidebar}
                    className='p-0.5 rounded-sm hover:bg-hover hover:dark:bg-hover-dark cursor-pointer'
                  >
                    <TbLayoutSidebarLeftExpand className="w-6 h-6 text-icon dark:text-icon-dark" />
                  </button>
                )}
                <h2 className="font-medium capitalize">
                  {location.pathname.replace('/', '')}
                </h2>
              </div>

              {/* Customize button + dropdown — only on /dashboard */}
              {location.pathname === '/dashboard' && (
                <CustomizeDashboard visible={visible} setVisible={setVisible} />
              )}
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-secondary dark:bg-secondary-dark overflow-hidden">
              <Outlet context={{ visible }} />
            </div>
          </div>
        </Panel>

      </Group>
    </div>
  );
}