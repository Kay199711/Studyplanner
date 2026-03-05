import { useLocation, Outlet } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';
import Sidebar from './components/Sidebar';

export default function Layout({ isDark, setIsDark }) {
  const location = useLocation();

  return (
    <div className="h-screen overflow-hidden">
      <Group orientation="horizontal">

        <Sidebar isDark={isDark} setIsDark={setIsDark} />

        <Separator className="w-0.5 bg-gray-300 hover:bg-blue-500 active:bg-blue-600 transition-colors cursor-col-resize" />

        {/* Main Content Panel */}
        <Panel>
          <div className="h-full flex flex-col">
            {/* Topbar */}
            <div className="bg-blue-100 h-12 flex items-center px-6 border-b border-gray-200">
              <h2 className="text-gray-900 font-medium capitalize">
                {location.pathname.replace('/', '')}
              </h2>
            </div>
            {/* Main Content Area - Child routes render here */}
            <div className="flex-1 bg-gray-50 overflow-auto">
              <Outlet />
            </div>
          </div>
        </Panel>

      </Group>
    </div>
  );
}
