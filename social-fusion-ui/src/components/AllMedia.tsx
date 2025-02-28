"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AllMedia = ({ mediaItems }: { mediaItems: { fileUrl: string; type: string }[] }) => {
  const [selectedTab, setSelectedTab] = useState<"image" | "video" | "document">("image");

  // Filtering media based on the selected tab
  const filteredMedia = mediaItems.filter((item) => item.type === selectedTab);

  return (
    <div className="p-4 h-full flex flex-col">
      {/* Tabs for Images, Videos, Documents */}
      <div className="flex justify-around border-b border-gray-300 dark:border-gray-700 pb-2">
        <button
          onClick={() => setSelectedTab("image")}
          className={`relative px-4 py-2 rounded-md transition-colors ${
            selectedTab === "image" ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          Images
          {selectedTab === "image" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
              layoutId="underline"
            />
          )}
        </button>
        <button
          onClick={() => setSelectedTab("video")}
          className={`relative px-4 py-2 rounded-md transition-colors ${
            selectedTab === "video" ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          Videos
          {selectedTab === "video" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
              layoutId="underline"
            />
          )}
        </button>
        <button
          onClick={() => setSelectedTab("document")}
          className={`relative px-4 py-2 rounded-md transition-colors ${
            selectedTab === "document" ? "text-blue-500" : "text-gray-600 dark:text-gray-300"
          }`}
        >
          Documents
          {selectedTab === "document" && (
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1 bg-blue-500"
              layoutId="underline"
            />
          )}
        </button>
      </div>

      {/* Media Grid */}
      <div className="flex-1 overflow-y-auto mt-4">
        <AnimatePresence mode="wait">
          {filteredMedia.length > 0 ? (
            <motion.div
              key={selectedTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-3 gap-2"
            >
              {filteredMedia.map((item, index) => (
                <div
                  key={index}
                  className="w-full h-24 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden flex items-center justify-center"
                >
                  {selectedTab === "image" && (
                    <Image
                      src={item.fileUrl}
                      alt="Image"
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  )}
                  {selectedTab === "video" && (
                    <video className="w-full h-full object-cover" controls>
                      <source src={item.fileUrl} type="video/mp4" />
                    </video>
                  )}
                  {selectedTab === "document" && (
                    <Link
                      href={item.fileUrl}
                      target="_blank"
                      className="text-blue-500 underline"
                    >
                      📎 Document
                    </Link>
                  )}
                </div>
              ))}
            </motion.div>
          ) : (
            // No Media Found Message
            <motion.div
              key="no-media"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="text-center text-gray-500 dark:text-gray-400 flex flex-col items-center mt-10"
            >
              <svg
                className="w-16 h-16 text-gray-400 mb-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="9" y1="12" x2="15" y2="12"></line>
                <line x1="12" y1="9" x2="12" y2="15"></line>
              </svg>
              <p className="text-lg font-medium">No {selectedTab} Found</p>
              <p className="text-sm">
                Photos, videos, and documents shared in this chat will appear here.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AllMedia;
