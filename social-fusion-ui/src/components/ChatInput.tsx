"use client";

import { useState, useEffect, useRef } from "react";
import { Paperclip, Mic, Send, Smile, Image, FileText, Video, X } from "lucide-react";
import dynamic from "next/dynamic";

const Picker = dynamic(() => import("emoji-picker-react"), { ssr: false });

const ChatInput = ({ sendMessage }: { sendMessage: (text: string, type?: string, fileUrl?: string) => void }) => {
  const [input, setInput] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Close modals when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        !(event.target as HTMLElement).closest(".emoji-picker-container") &&
        !(event.target as HTMLElement).closest(".emoji-btn") &&
        !(event.target as HTMLElement).closest(".attachment-modal") &&
        !(event.target as HTMLElement).closest(".attachment-btn")
      ) {
        setShowEmojiPicker(false);
        setShowAttachmentModal(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSend = () => {
    if (input.trim() !== "") {
      sendMessage(input, "text");
      setInput("");
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, type: string) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      sendMessage(file.name, type, fileUrl);
    }
  };

  const handleStartRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/mp3" });
        const audioUrl = URL.createObjectURL(audioBlob);
        sendMessage("🎤 Audio Message", "audio", audioUrl);
        setIsRecording(false);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Audio recording failed:", error);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  return (
    <div className="relative">
      {/* Attachment Modal */}
      {showAttachmentModal && (
        <div className="absolute bottom-16 left-2 bg-white dark:bg-gray-800 shadow-lg p-3 rounded-lg z-50 w-48 attachment-modal">
          <button
            onClick={() => setShowAttachmentModal(false)}
            className="absolute top-1 right-1 text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </button>
          <div className="flex flex-col space-y-2">
            {/* Image Upload */}
            <label className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Image size={18} className="text-blue-500" />
              <span className="text-sm text-gray-800 dark:text-white">Image</span>
              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, "image")} hidden />
            </label>

            {/* Video Upload */}
            <label className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <Video size={18} className="text-green-500" />
              <span className="text-sm text-gray-800 dark:text-white">Video</span>
              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, "video")} hidden />
            </label>

            {/* Document Upload */}
            <label className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg cursor-pointer">
              <FileText size={18} className="text-orange-500" />
              <span className="text-sm text-gray-800 dark:text-white">Document</span>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={(e) => handleFileUpload(e, "document")} hidden />
            </label>

            {/* Audio Recording */}
            {isRecording ? (
              <button
                onClick={handleStopRecording}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg text-red-500"
              >
                <Mic size={18} />
                <span className="text-sm">Stop Recording</span>
              </button>
            ) : (
              <button
                onClick={handleStartRecording}
                className="flex items-center space-x-2 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg"
              >
                <Mic size={18} className="text-red-500" />
                <span className="text-sm text-gray-800 dark:text-white">Record Audio</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="absolute bottom-0 left-0 w-full p-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 flex items-center space-x-3">
      {/* Attachments Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowAttachmentModal((prev) => {
              if (!prev) setShowEmojiPicker(false);
              return !prev;
            });
          }}
          className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 attachment-btn"
        >
          <Paperclip size={22} />
        </button>

        {/* Emoji Picker Button */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowEmojiPicker((prev) => {
                if (!prev) setShowAttachmentModal(false);
                return !prev;
              });
            }}
            className="p-2 text-gray-600 dark:text-gray-300 hover:text-blue-500 emoji-btn"
          >
            <Smile size={22} />
          </button>
          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50 emoji-picker-container">
              <Picker onEmojiClick={(emojiObject) => setInput((prev) => prev + emojiObject.emoji)} />
            </div>
          )}
        </div>

        {/* Text Input Field */}
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full p-2 px-4 border border-gray-300 dark:border-gray-600 rounded-full focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
        />

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="p-2 text-white bg-blue-500 rounded-full hover:bg-blue-600 transition-colors"
        >
          <Send size={22} />
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
