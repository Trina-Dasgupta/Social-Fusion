"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Settings } from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import SettingsMenu from "./SettingsMenu";

const Header = () => {
  const [showSettings, setShowSettings] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close settings when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowSettings(false);
      }
    };

    if (showSettings) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettings]);

  return (
    <div className="flex items-center justify-between w-full p-4 bg-white dark:bg-gray-900 shadow-md relative">
      {/* Left: Logo */}
      <div className="flex items-center">
        <Logo />
      </div>

      <div className="flex-1 flex justify-end px-5">
        <ThemeToggle />
      </div>

      {/* Right: Settings Button */}
      <div className="flex items-center">
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="text-gray-600 dark:text-gray-300 hover:text-blue-500 transition"
        >
          <Settings size={24} />
        </button>
      </div>

      {/* Animated Settings Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            ref={menuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 5 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="absolute right-4 top-14 w-72 bg-white dark:bg-gray-900 shadow-lg rounded-lg z-50"
          >
            <SettingsMenu />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Header;
