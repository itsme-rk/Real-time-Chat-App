import { useEffect, useState } from "react";
import api from "../services/api";
import UserList from "../components/UserList";
import UserSelector from "../components/UserSelector";
import ChatRoomList from "../components/ChatRoomList";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [activeUser, setActiveUser] = useState(
    Number(localStorage.getItem("activeUser")) || 1
  );

  const navigate = useNavigate();

  useEffect(() => {
    api.get("/users/").then((res) => setUsers(res.data));
  }, []);

  // auto refresh chat list
  useEffect(() => {
    const loadRooms = () => {
      api
        .get(`/rooms/?active_user=${activeUser}`)
        .then((res) => setRooms(res.data));
    };

    loadRooms(); // first load

    const interval = setInterval(loadRooms, 1200);

    // also update on 'chat-updated' WS event
    window.addEventListener("chat-updated", loadRooms);

    return () => {
      clearInterval(interval);
      window.removeEventListener("chat-updated", loadRooms);
    };
  }, [activeUser]);

  const changeActiveUser = (id) => {
    setActiveUser(id);
    localStorage.setItem("activeUser", id);
  };

  const startChat = (otherUserId) => {
    api
      .post("/rooms/create/", {
        user_id: otherUserId,
        active_user_id: activeUser,
      })
      .then((res) => {
        navigate(`/chat/${res.data.id}?activeUser=${activeUser}`);
      });
  };

  return (
    <div className="h-screen flex">
      <div className="w-64 border-r bg-white flex flex-col">
        <UserSelector
          activeUser={activeUser}
          setActiveUser={changeActiveUser}
          users={users}
        />

        <ChatRoomList
          rooms={rooms}
          onSelect={(id) =>
            navigate(`/chat/${id}?activeUser=${activeUser}`)
          }
        />

        <UserList users={users} onSelect={startChat} />
      </div>

      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a chat or start a new one
      </div>
    </div>
  );
}
