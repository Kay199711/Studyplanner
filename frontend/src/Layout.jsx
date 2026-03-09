import { useLocation, Outlet } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import Sidebar from './components/Sidebar';

export default function Layout({ isDark, setIsDark }) {
  const location = useLocation();

  return (
    // Text color is set here for all children components
    <div className="h-screen overflow-hidden text-txt-primary dark:text-txt-primary-dark">
      <Group orientation="horizontal">

        <Sidebar isDark={isDark} setIsDark={setIsDark} />

        <Separator className="w-0.5 bg-brd-primary dark:bg-brd-primary-dark hover:bg-blue-500 active:bg-blue-600 cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Topbar */}
            <div className="bg-primary dark:bg-primary-dark h-12 flex items-center px-6 border-b border-brd-primary dark:border-brd-primary-dark">
              <h2 className="font-medium capitalize">
                {location.pathname.replace('/', '')}
              </h2>
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
