import React from "react";

export default function TypingIndicator({ active }) {
  if (!active) return null;

  return (
    <div className="text-gray-500 text-sm italic p-2">
      typing…
    </div>
  );
}
