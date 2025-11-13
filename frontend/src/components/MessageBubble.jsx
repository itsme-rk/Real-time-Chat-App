import React from "react";

export default function MessageBubble({ message, currentUser }) {
  const isMine = message.sender.username === currentUser;

  return (
    <div className={`mb-3 flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`px-4 py-2 max-w-xs rounded-xl ${
          isMine
            ? "bg-green-600 text-white rounded-br-none"
            : "bg-gray-200 text-black rounded-bl-none"
        }`}
      >
        <div>{message.text}</div>

        <div className="text-xs mt-1 opacity-70 flex items-center gap-1">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}

          {/* BLUE TICK FIX */}
          {isMine && (
            <span
  style={{
    color: message.is_read ? "#2563eb" : "#777",
    transition: "color 0.3s ease-in-out",
  }}
>

              {message.is_read ? "✔✔" : "✔"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
