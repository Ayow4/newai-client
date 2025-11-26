// ChatList.jsx
import { Link } from "react-router-dom";
import "./chatList.css";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";

const ChatList = () => {
  const { getToken } = useAuth();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      const token = await getToken();
      return fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((res) => res.json());
    },
  });

  return (
    <aside className="chatList" aria-label="Chat list">
      <div className="chatList-header">
        <span className="title">DASHBOARD</span>
        <Link className="create-link" to="/dashboard">+ New Chat</Link>
      </div>

      <hr />

      <span className="title small">RECENT CHATS</span>

      <div className="list" role="list">
        {isPending && (
          // skeleton placeholders
          Array.from({ length: 5 }).map((_, i) => (
            <div className="list-item skeleton" key={i} />
          ))
        )}

        {!isPending && error && (
          <div className="empty">Couldn't load chats. Try refreshing.</div>
        )}

        {!isPending && !error && data?.length === 0 && (
          <div className="empty">No chats yet — create your first one.</div>
        )}

        {!isPending && !error && data?.map((chat) => (
          <Link
            to={`/dashboard/chats/${chat._id}`}
            key={chat._id}
            className="list-link"
            role="listitem"
          >
            <div className="list-link-inner">
              <div className="chat-icon">{chat.title?.charAt(0)?.toUpperCase()}</div>
              <div className="chat-meta">
                <div className="chat-title">{chat.title || "Untitled chat"}</div>
                <div className="chat-sub">Tap to open</div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <hr />

      <div className="upgrade">
        <div className="texts">
          {/* <span>© {new Date().getFullYear()}. All rights reserved.</span> */}
        </div>
      </div>
    </aside>
  );
};

export default ChatList;
