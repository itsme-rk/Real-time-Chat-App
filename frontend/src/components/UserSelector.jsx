export default function UserSelector({ activeUser, setActiveUser, users }) {
  return (
    <div className="p-4 border-b bg-gray-100 flex items-center gap-2">
      <span className="font-medium">Active User:</span>
      <select
        value={activeUser}
        onChange={(e) => setActiveUser(Number(e.target.value))}
        className="border px-2 py-1 rounded"
      >
        {users.map((u) => (
          <option key={u.id} value={u.id}>
            {u.username}
          </option>
        ))}
      </select>
    </div>
  );
}
