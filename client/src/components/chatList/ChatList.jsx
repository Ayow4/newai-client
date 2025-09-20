import { Link, useNavigate } from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@clerk/clerk-react';

const ChatList = () => {
  const { getToken, signOut } = useAuth();
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: async () => {
      try {
        const token = await getToken();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
          credentials: "include", // Keep this for cookies
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          // Token invalid or session expired, force logout
          await signOut();
          navigate('/sign-in');
          throw new Error("Unauthenticated. Please log in again.");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
      } catch (err) {
        console.error("Error fetching user chats:", err);
        throw err;
      }
    },
  });



  return (
    <div className='chatList'>
      <span className='title'>DASHBOARD</span>
      <Link to="/dashboard">Create a New Chat</Link>
      <hr />
      <span className="title">RECENT CHATS</span>
      <div className="list">
        {isPending
          ? ""
          : error
          ? ""
          : data?.map((chat) => (
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>
                {chat.title}
              </Link>
            ))}
      </div>
      <hr />
      {/* <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span><Link to="/faq">FAQ</Link> <a href="https://www.facebook.com/profile.php?id=61565169932067" target="_blank">Contact</a> <Link to="/feedback">Feedback</Link></span>
          <span>© 2024. All rights reserved.</span>
        </div>
      </div> */}
    </div>
  )
}

export default ChatList