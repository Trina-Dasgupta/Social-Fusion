"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDarkMode);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("darkMode", "true");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("darkMode", "false");
    }
  }, [darkMode]);

  return (
    <div className="flex items-center justify-between w-full p-4 ">
      {/* Logo & Home Link */}
      <Link href="/" className="flex items-center gap-2">
        <span className="text-3xl font-bold text-blue-500">🌐</span>
        <span className="text-2xl font-bold text-gray-800 dark:text-white">
          SocialFusion
        </span>
      </Link>

      {/* Theme Toggle Button */}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className="p-2 rounded-full transition duration-300 bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600"
      >
        {darkMode ? "🌙" : "☀️"}
      </button>
    </div>
  );
};

export default ThemeToggle;
