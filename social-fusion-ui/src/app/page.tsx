"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import ChatWindow from "@/components/ChatWindow";
import ThemeToggle from "@/components/ThemeToggle";
import FriendList from "@/components/FriendList";
import { friends } from "@/utils/friends";


export default function Home() {
  const [selectedFriend, setSelectedFriend] = useState<string | null>(null);
  const [messages, setMessages] = useState<{ 
    [key: string]: { sender: string; text: string; type?: string; fileUrl?: string; time: string }[] 
  }>({});
  
  const sendMessage = (friendId: string, text: string, type: string = "text", fileUrl: string = "") => {
    setMessages((prev) => ({
      ...prev,
      [friendId]: [
        ...(prev[friendId] || []),
        {
          sender: "You",
          text,
          type,  // Message type (text, image, video, document, audio)
          fileUrl, // File URL for media messages
          time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), // Timestamp
        },
      ],
    }));
  };
  
  
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Navbar (Mobile Only) */}
      <Navbar friends={friends} onFriendClick={setSelectedFriend} messages={messages} />


      {/* Friend List (Desktop Only) */}
      <div className="hidden md:block w-1/4 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <FriendList friends={friends} onFriendClick={setSelectedFriend} messages={messages}/>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Theme Toggle */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div className="flex justify-end">
            <ThemeToggle />
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex flex-col h-full min-h-0">
          {selectedFriend ? (
            <ChatWindow
            friendId={selectedFriend}
            messages={messages[selectedFriend] || []}
            sendMessage={(text, type, fileUrl) => sendMessage(selectedFriend, text, type, fileUrl)}
          />
          
          ) : (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900">
              <p className="text-gray-500 dark:text-gray-400">
                Select a friend to start chatting.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
