"use client";
import { SearchBarProps } from "@/utils/types";
import { Search as SearchIcon } from "lucide-react";



const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, setSearchQuery }) => {
  return (
    <div className="p-3 flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg mx-2 my-2">
      <SearchIcon size={20} className="text-gray-600 dark:text-gray-300" />
      <input
        type="text"
        placeholder="Search friends..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full bg-transparent outline-none px-2 text-gray-900 dark:text-white"
      />
    </div>
  );
};

export default SearchBar;
