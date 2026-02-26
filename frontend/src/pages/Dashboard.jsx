import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Group, Panel, Separator } from 'react-resizable-panels';

import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('planner');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };


  return (
    <div className="h-screen overflow-hidden">
      <Group orientation="horizontal">
        {/* Sidebar Panel */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          handleLogout={handleLogout}
        />

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

