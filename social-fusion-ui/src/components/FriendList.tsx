"use client";

const FriendList = ({
  friends,
  onFriendClick,
  messages
}: {
  friends: { id: string; name: string }[];
  onFriendClick: (friendId: string) => void;
  messages: { [key: string]: { sender: string; text: string }[] };
}) => {
  return (
    <div className="w-full h-full bg-white dark:bg-gray-800 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Chats
        </h2>
      </div>

      {/* Friend List */}
      <div className="p-2">
        {friends.map((friend) => {
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
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lastMessage}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default FriendList;