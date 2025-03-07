"use client";

import { ArrowLeft, X, Lock, Phone, Video, Search, Flag, Ban, ArrowRight } from "lucide-react"; // Import icons
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";


const Profile = ({
  friend,
  onBack,
  mediaItems = [],
  onMediaClick
}: {
  friend: { name: string; phone: string; profilePic: string } | null;
  onBack: () => void;
  mediaItems?: { fileUrl: string; type: string }[];
  onMediaClick: () => void;
}) => {
  const [isMounted, setIsMounted] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  // Handle click outside the profile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        onBack(); // Close the profile
      }
    };

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Cleanup the event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onBack]);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; 
 
  if (!friend) {
    return (
      <div className="p-4 text-gray-500 dark:text-gray-400">User not found</div>
    );
  }
  const mediaCount = mediaItems.length;
  const displayedMedia = mediaItems.slice(0, 6); // Show only 6 items
  return (
    <div
      ref={profileRef}
      className="fixed inset-y-0 right-0 w-full md:w-96 bg-white dark:bg-gray-900 shadow-lg h-screen z-[1000]">

      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
        >
          <ArrowLeft size={24} />
        </button>
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          Profile
        </h2>
        <button
          onClick={onBack}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500"
        >
          <X size={24} />
        </button>
      </div>

      {/* Profile Picture and Details */}
      <div className="flex flex-col items-center p-6">
        {/* Profile Picture */}
        <div className="w-24 h-24 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
          <span className="text-white text-4xl font-semibold">
            {friend.name.charAt(0)}
          </span>
        </div>

        {/* Name and Phone */}
        <h3 className="mt-4 text-2xl font-semibold text-gray-800 dark:text-white">
          {friend.name}
        </h3>
        <p className="mt-1 text-gray-500 dark:text-gray-400">{friend.phone}</p>

        {/* Status */}
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          &quot;Hey there! I am using WhatsApp.&quot;
        </p>

        {/* Audio and Video Call Buttons */}
        <div className="flex space-x-4 mt-4">
          <button className="flex items-center justify-center w-12 h-12 bg-green-500 rounded-full hover:bg-green-600 transition-colors">
            <Phone size={20} className="text-white" />
          </button>
          <button className="flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full hover:bg-blue-600 transition-colors">
            <Video size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Scrollable Section */}
      <div className="overflow-y-auto h-[calc(100vh-460px)]">
        {/* Search Option */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2">
            <Search size={18} className="text-gray-600 dark:text-gray-300" />
            <input
              type="text"
              placeholder="Search messages..."
              className="w-full bg-transparent outline-none px-2 text-gray-900 dark:text-white"
            />
          </div>
        </div>

         {/* Media, Links & Docs */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center cursor-pointer" onClick={onMediaClick}>
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white">Media, Links & Docs</h4>
          <p className="text-gray-500 dark:text-gray-400">{mediaCount} items</p>
        </div>

        <ArrowRight size={20} className="text-gray-600 dark:text-gray-300" />

        
      </div>

      {/* Media Grid (First 6 Media Items) */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        {mediaCount > 0 ? (
          <div className="grid grid-cols-3 gap-2">
            {displayedMedia.map((item, index) => (
              <div key={index} className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                {item.type === "image" && <Image src={item.fileUrl} alt="Image" width={96} height={96} className="object-cover w-full h-full" />}
                {item.type === "video" && (
                  <video className="w-full h-full object-cover" controls>
                    <source src={item.fileUrl} type="video/mp4" />
                  </video>
                )}
                {item.type === "document" && (
                  <Link href={item.fileUrl} target="_blank" className="text-blue-500 underline">
                    📎 Document
                  </Link>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center">
            <p className="text-lg font-medium">No Media Found</p>
            <p className="text-sm">Photos, videos, and documents shared in this chat will appear here.</p>
          </div>
        )}
      </div>
        {/* Additional Details */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            Details
          </h4>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 dark:text-gray-400">Notifications</p>
              <p className="text-blue-500">Custom</p>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Lock size={18} className="text-gray-600 dark:text-gray-400" />
                <p className="text-gray-600 dark:text-gray-400">Encryption</p>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Messages are end-to-end encrypted.
              </p>
            </div>
          </div>
        </div>

        {/* Block and Report Options */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            {/* Block Option */}
            <button className="flex items-center space-x-3 w-full text-red-500 hover:text-red-600">
              <Ban size={18} />
              <span>Block</span>
            </button>

            {/* Report Option */}
            <button className="flex items-center space-x-3 w-full text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
              <Flag size={18} />
              <span>Report</span>
            </button>
          </div>
        </div>
      </div>
      {/* {mediaOpen && <AllMedia mediaItems={mediaItems} />} */}
    </div>
  );
};

export default Profile;