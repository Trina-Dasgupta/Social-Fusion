"use client";

import { useState, useEffect } from "react";
import { Search, X, Settings } from "lucide-react";
import { friends } from "@/utils/friends";

const ChatHeader = ({ friendId, setSearchQuery }: { friendId: string; setSearchQuery: (query: string) => void }) => {
  const [friend, setFriend] = useState<{ name: string; isOnline: boolean; lastActive: string } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    
    setFriend(friends.find((f) => f.id === friendId) || null);
  }, [friendId]);

  if (!friend) {
    return (
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 w-full h-16 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between z-50 shadow-md">
      {showSearch ? (
        <div className="flex-1 flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
          <Search size={18} className="text-gray-600 dark:text-gray-300" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="w-full bg-transparent outline-none px-2 text-gray-900 dark:text-white"
          />
          <button onClick={() => { setShowSearch(false); setSearchQuery(""); setSearchInput(""); }}>
            <X size={20} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
        </div>
      ) : (
        <>
          {/* Profile & Name */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">{friend.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{friend.name}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {friend.isOnline ? "Online" : `Last active ${friend.lastActive}`}
              </p>
            </div>
          </div>

          {/* Search & Settings Icons */}
          <div className="flex space-x-4">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>
            <button className="text-gray-600 dark:text-gray-300 hover:text-blue-500">
              <Settings size={20} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatHeader;
