import React from 'react';

const Sidebar = () => {
  return (
    <div className="w-1/4 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Chats</h2>
      </div>
      <div className="p-4">
        <div className="flex items-center mb-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
          <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
          <div>
            <p className="font-semibold text-gray-800 dark:text-white">John Doe</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">Hey, how are you?</p>
          </div>
        </div>
        {/* Repeat for other chats */}
      </div>
    </div>
  );
};

export default Sidebar;