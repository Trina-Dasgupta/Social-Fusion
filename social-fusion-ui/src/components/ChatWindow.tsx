"use client";

import { useState,useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";


const ChatWindow = ({
  friendId,
  messages,
  sendMessage,
}: {
  friendId: string;
  messages: { sender: string; text: string; type?: string; fileUrl?: string; time: string }[];
  sendMessage: (text: string, type?: string, fileUrl?: string) => void;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
    }, 100); 
  
    return () => clearTimeout(timeoutId); 
  }, [messages]);
  

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
      {/* Chat Header */}
      <ChatHeader friendId={friendId} setSearchQuery={setSearchQuery} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 w-full pb-24">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
              <div
                className={`p-3 rounded-lg shadow-sm break-words max-w-[75%] ${
                  msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                }`}
              >
                {msg.type === "image" && <img src={msg.fileUrl} alt="Uploaded" className="rounded-lg w-48 h-auto" />}
                {msg.type === "video" && (
                  <video controls className="rounded-lg w-48 h-auto">
                    <source src={msg.fileUrl} type="video/mp4" />
                  </video>
                )}
                {msg.type === "audio" && (
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-2 flex items-center space-x-3 w-64">
                    <audio controls className="w-full">
                      <source src={msg.fileUrl} type="audio/mp3" />
                    </audio>
                  </div>
                )}
                {msg.type === "document" && (
                  <a href={msg.fileUrl} target="_blank" className="text-blue-500 underline">
                    📎 {msg.text}
                  </a>
                )}
                {msg.type === "text" && <p>{msg.text}</p>}

                {/* Timestamp */}
                <div className="text-xs text-gray-400 mt-1 text-right">{msg.time}</div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400">No messages found</p>
        )}
        {/* Invisible div for auto-scrolling */}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Message Input */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};


export default ChatWindow;


