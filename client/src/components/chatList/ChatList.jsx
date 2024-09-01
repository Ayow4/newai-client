import { Link } from 'react-router-dom'
import './chatList.css'
import { useQuery } from '@tanstack/react-query'

const ChatList = () => {

  const { isPending, error, data } = useQuery({
    queryKey: ["userChats"],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`, {
        credentials: "include",
      }).then((res) =>
        res.json(),
      ),
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
      <div className="upgrade">
        <img src="/logo.png" alt="" />
        <div className="texts">
          <span><Link to="/faq">FAQ</Link> <a href="https://www.facebook.com/profile.php?id=61565169932067" target="_blank">Contact</a> <Link to="/feedback">Feedback</Link></span>
          <span>© 2024. All rights reserved.</span>
        </div>
      </div>
    </div>
  )
}

export default ChatList