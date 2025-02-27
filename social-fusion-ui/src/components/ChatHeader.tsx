"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MoreVertical, X } from "lucide-react";
import { friends } from "@/utils/friends";
import Profile from "./Profile";

const ChatHeader = ({
  friendId,
  setSearchQuery,
}: {
  friendId: string;
  setSearchQuery: (query: string) => void;
}) => {
  const [friend, setFriend] = useState<{
    name: string;
    isOnline: boolean;
    lastActive: string;
    phone: string;
    profilePic: string;
  } | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const selectedFriend = friends.find((f) => f.id === friendId);
    if (selectedFriend) {
      setFriend({
        name: selectedFriend.name,
        isOnline: selectedFriend.isOnline,
        lastActive: selectedFriend.lastActive,
        phone: "12323323",
        profilePic: "selectedFriend.profilePic",
      });
    } else {
      setFriend(null);
    }
  }, [friendId]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current?.contains(event.target as Node) ||
        menuButtonRef.current?.contains(event.target as Node)
      ) {
        return;
      }
      setShowMenu(false);
    };

    if (showMenu) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

  if (!friend) {
    return (
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <p className="text-gray-500 dark:text-gray-400">User not found</p>
      </div>
    );
  }

  return (
    <div className="sticky top-0 w-full h-16 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between shadow-md relative">
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
          <button
            onClick={() => {
              setShowSearch(false);
              setSearchQuery("");
              setSearchInput("");
            }}
          >
            <X size={20} className="text-gray-600 dark:text-gray-300 hover:text-red-500" />
          </button>
        </div>
      ) : (
        <>
          {/* Profile & Name */}
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => setShowProfile(true)}
          >
            <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {friend.name.charAt(0)}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                {friend.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {friend.isOnline ? "Online" : `Last active ${friend.lastActive}`}
              </p>
            </div>
          </div>

          {/* Search & More Options (⋮) */}
          <div className="flex space-x-4 relative">
            <button
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              onClick={() => setShowSearch(true)}
            >
              <Search size={20} />
            </button>

            <button
              ref={menuButtonRef}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <MoreVertical size={20} />
            </button>

            {/* Dropdown Menu */}
            {showMenu && (
              <div
                ref={menuRef}
                className="absolute top-10 right-0 w-48 bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => {
                    setShowProfile(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  View Contact
                </button>

                <button
                  onClick={() => {
                    setShowSearch(true);
                    setShowMenu(false);
                  }}
                  className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Search
                </button>

                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Media, Links & Docs
                </button>

                <button className="w-full text-left px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Mute Notifications
                </button>
              </div>
            )}
          </div>

          {/* Profile Modal */}
          {showProfile && <Profile friend={friend} onBack={() => setShowProfile(false)} />}
        </>
      )}
    </div>
  );
};

export default ChatHeader;
