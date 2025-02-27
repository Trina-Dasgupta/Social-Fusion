"use client";

import { useState } from "react";
import MobileDrawer from "./MobileDrawer";



const Navbar = ({
  friends,
  onFriendClick,
  messages
}: {
  friends: { id: string; name: string }[];
  onFriendClick: (friendId: string) => void;
  messages: { [key: string]: { sender: string; text: string }[] };
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <>
      <nav className="md:hidden bg-gray-800 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <button
            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
            className="text-white"
          >
            ☰
          </button>
        </div>
      </nav>

      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        friends={friends}
        onFriendClick={onFriendClick}
        messages={messages}
      />

    </>
  );
};

export default Navbar;