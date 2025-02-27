import { useState } from "react";
import { Search, X } from "lucide-react";
import Logo from "./Logo";

const MobileDrawer = ({
  isOpen,
  onClose,
  friends,
  onFriendClick,
  messages,
}: {
  isOpen: boolean;
  onClose: () => void;
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
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-white dark:bg-gray-800 w-64 shadow-lg flex flex-col`}
    >
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
     <Logo/>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-red-500">
          <X size={24} />
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-3 flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg mx-3 my-2">
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
      <div className="flex-1 overflow-y-auto p-2">
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

export default MobileDrawer;


