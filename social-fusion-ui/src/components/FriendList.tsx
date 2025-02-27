"use client";

import { useState } from "react";
import { Search } from "lucide-react";

const FriendList = ({
  friends,
  onFriendClick,
  messages
}: {
  friends: { id: string; name: string }[];
  onFriendClick: (friendId: string) => void;
  messages: { [key: string]: { sender: string; text: string }[] };
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Filter friends based on search input
  const filteredFriends = friends.filter(friend =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 overflow-y-auto">
      {/* Header */}
     

      {/* Search Bar */}
      <div className="p-3 flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg mx-2 my-2">
        <Search size={20} className="text-gray-600 dark:text-gray-300" />
        <input
          type="text"
          placeholder="Search friends..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-transparent outline-none px-2 text-gray-900 dark:text-white"
        />
      </div>

      {/* Friend List */}
      <div className="p-2">
        {filteredFriends.length > 0 ? (
          filteredFriends.map((friend) => {
            const lastMessage =
              messages[friend.id]?.[messages[friend.id].length - 1]?.text || "No messages yet";
            return (
              <div
                key={friend.id}
                onClick={() => onFriendClick(friend.id)}
                className="flex items-center p-3 cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                {/* Profile Icon */}
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center mr-3">
                  <span className="text-white text-lg font-semibold">
                    {friend.name.charAt(0)}
                  </span>
                </div>

                {/* Friend Name and Last Message */}
                <div className="flex-1">
                  <p className="font-medium text-gray-800 dark:text-white">
                    {friend.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                    {lastMessage}
                  </p>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 mt-4">
            No friends found
          </p>
        )}
      </div>
    </div>
  );
};

export default FriendList;
