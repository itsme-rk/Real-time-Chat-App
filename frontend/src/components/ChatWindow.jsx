import React, { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatWindow({
  messages,
  typing,
  text,
  setText,
  onSend,
  onTyping,
  currentUser,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="flex flex-col w-full bg-gray-50 h-screen">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} currentUser={currentUser} />
        ))}

        <TypingIndicator active={typing} />

        <div ref={bottomRef}></div>
      </div>

      {/* Input area */}
      <div className="p-4 border-t bg-white flex items-center gap-2 fixed bottom-0 left-64 right-0">
        <input
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            onTyping();
          }}
          onKeyDown={handleKeyPress}
          className="flex-1 px-3 py-2 border rounded"
          placeholder="Type a message..."
        />
        <button
          onClick={onSend}
          className="px-4 py-2 bg-green-600 text-white rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
