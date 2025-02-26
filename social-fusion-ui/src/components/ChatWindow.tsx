"use client";

import { useState } from "react";
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

  // Filter messages based on search query
  const filteredMessages = messages.filter((msg) =>
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-gray-900">
      {/* Chat Header */}
      <ChatHeader friendId={friendId} setSearchQuery={setSearchQuery} />

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
            <div
              className={`p-3 rounded-lg max-w-xs shadow-sm ${
                msg.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 dark:bg-gray-700 dark:text-white"
              }`}
            >
              {msg.type === "image" && (
                <img src={msg.fileUrl} alt="Uploaded" className="rounded-lg w-48 h-auto" />
              )}
              {msg.type === "video" && (
                <video controls className="rounded-lg w-48 h-auto">
                  <source src={msg.fileUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {msg.type === "audio" && (
                <audio controls className="w-full">
                  <source src={msg.fileUrl} type="audio/mp3" />
                  Your browser does not support the audio element.
                </audio>
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
        ))}
      </div>

      {/* Message Input */}
      <ChatInput sendMessage={sendMessage} />
    </div>
  );
};

export default ChatWindow;

