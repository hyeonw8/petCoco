"use client"

import Chat from "@/components/chat/Chat";
import { useState } from "react";
import { RiChat1Fill } from "react-icons/ri";

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  }
  return (
  <main className="flex min-h-screen flex-col items-center justify-between p-24">    
  <div>
    <button onClick={toggleChat} className="fixed bottom-4 right-4 bg-white border border-gray-300 p-2 rounded-full shadow-lg focus:outline-none">
      <RiChat1Fill />
    </button>
    <Chat isOpen={isChatOpen} onClose={toggleChat} />
  </div>
</main>
);
}
