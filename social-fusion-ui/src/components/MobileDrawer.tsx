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
  return (
    <div
      className={`fixed inset-0 z-50 transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } bg-white dark:bg-gray-800 w-64 shadow-lg`}
    >
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Chats
        </h2>
        <button onClick={onClose} className="text-gray-500 dark:text-gray-400">
          ✕
        </button>
      </div>
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
              <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full mr-3"></div>
              <div>
                <p className="font-medium text-gray-800 dark:text-white">{friend.name}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{lastMessage}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MobileDrawer;
