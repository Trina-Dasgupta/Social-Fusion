"use client";

import { useAuth } from "@/contexts/AuthContext";
import { Settings, User, LogOut, ShieldCheck, Bell, Palette } from "lucide-react";

const SettingsMenu = () => {
  const { user,logout } = useAuth();
  return user && (
   <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-md p-5">
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <Settings size={24} className="text-gray-700 dark:text-gray-300" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
          Settings
        </h2>
      </div>

      {/* Menu Options */}
      <div className="space-y-2">
        <MenuItem icon={<User size={18} />} label="Account Info" />
        <MenuItem icon={<ShieldCheck size={18} />} label="Privacy & Security" />
        <MenuItem icon={<Bell size={18} />} label="Notifications" />
        <MenuItem icon={<Palette size={18} />} label="Appearance" />
        
        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

        {/* Logout Button */}
        <MenuItem icon={<LogOut size={18} />} label="Logout" danger logout={logout}/>
      </div>
    </div>
  );
};

// Reusable Menu Item Component
const MenuItem = ({
  icon,
  label,
  danger = false,
  logout
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  logout?: () => void;
}) => {
  return (
    <button
      className={`flex items-center space-x-3 w-full px-3 py-2 rounded-md transition-colors ${
        danger
          ? "text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`} onClick={logout}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

export default SettingsMenu;
