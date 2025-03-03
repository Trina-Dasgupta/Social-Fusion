"use client";

import { useState, useRef, useEffect } from "react";
import ChatHeader from "./ChatHeader";
import ChatInput from "./ChatInput";
import Image from "next/image";
import Link from "next/link";
import AllMedia from "./AllMedia";
import { ArrowLeft } from "lucide-react";

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
  const [showMedia, setShowMedia] = useState(false);
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

  const mediaMessages = messages
  .filter((msg) => 
    (msg.type === "image" || msg.type === "video" || msg.type === "document") &&
    msg.fileUrl 
  )
  .map((msg) => ({
    fileUrl: msg.fileUrl as string,
    type: msg.type as string,     
  }));

  return (
    <div className="flex flex-col h-screen w-full bg-white dark:bg-gray-900 overflow-hidden">
      {showMedia ? (
        <>
          {/* Media Header */}
          <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
            <button
              onClick={() => setShowMedia(false)}
              className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white ml-4">
              Media, Links & Docs
            </h2>
          </div>

          {/* Media Section */}
          <AllMedia mediaItems={mediaMessages} />
        </>
      ) : (
        <>
          {/* Chat Header */}
          <ChatHeader friendId={friendId} setSearchQuery={setSearchQuery} onMediaClick={() => setShowMedia(true)}  mediaItems={mediaMessages}/>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 w-full pb-24">
            {filteredMessages.length > 0 ? (
              filteredMessages.map((msg, index) => (
                <div key={index} className={`flex ${msg.sender === "You" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`p-3 rounded-lg shadow-sm break-words max-w-[75%] ${msg.sender === "You" ? "bg-blue-500 text-white" : "bg-gray-100 dark:bg-gray-700 dark:text-white"
                      }`}
                  >
                    {msg.type === "image" && msg.fileUrl && (
                      <Image
                        src={msg.fileUrl}
                        alt="Uploaded"
                        width={192}
                        height={192}
                        className="rounded-lg w-48 h-auto"
                      />
                    )}
                    {msg.type === "video" && (
                      <video controls className="rounded-lg w-48 h-auto">
                        <source src={msg.fileUrl} type="video/mp4" />
                      </video>
                    )}
                    {msg.type === "document" && (
                      <Link href={msg.fileUrl ?? ""} target="_blank" className="text-blue-500 underline">
                        📎 {msg.text}
                      </Link>
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
        </>
      )}
    </div>
  );
};



export default ChatWindow;


