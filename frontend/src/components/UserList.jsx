import React from "react";

export default function UserList({ users, onSelect }) {
  return (
    <div className="p-4 border-r w-64 h-full overflow-y-auto bg-white">
      <h2 className="text-lg font-semibold mb-4">Users</h2>

      {users.map((user) => (
        <div
          key={user.id}
          onClick={() => onSelect(user.id)}
          className="p-3 mb-2 cursor-pointer bg-gray-100 rounded hover:bg-gray-200"
        >
          {user.username}
        </div>
      ))}
    </div>
  );
}
