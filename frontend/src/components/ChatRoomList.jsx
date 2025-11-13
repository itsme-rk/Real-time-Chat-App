import React from "react";

export default function ChatRoomList({ rooms, onSelect }) {
  return (
    <div className="p-4 border-r w-72 h-full overflow-y-auto bg-white">
      <h2 className="text-lg font-semibold mb-4">Chats</h2>

      {rooms.map((room) => (
        <div
          key={room.id}
          onClick={() => onSelect(room.id)}
          className="p-3 mb-3 cursor-pointer bg-gray-100 rounded hover:bg-gray-200"
        >
          <div className="flex justify-between items-center">
            <div className="font-medium">
              {room.users.map((u) => u.username).join(", ")}
            </div>

            {room.unread_count > 0 && (
              <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                {room.unread_count}
              </span>
            )}
          </div>

          {room.last_message && (
            <div className="text-sm text-gray-600 truncate">
              {room.last_message.text}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
