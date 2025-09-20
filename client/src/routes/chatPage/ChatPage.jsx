import './chatPage.css'
import NewPrompt from '../../components/newPrompt/NewPrompt';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';
import Markdown from 'react-markdown';
import { IKImage } from 'imagekitio-react';
import { useAuth } from '@clerk/clerk-react'; // Import useAuth to get the token

const ChatPage = () => {
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();

  const { getToken, signOut } = useAuth(); // include signOut
  const navigate = useNavigate();

  const { isPending, error, data } = useQuery({
  queryKey: ["chat", chatId],
  queryFn: async () => {
    try {
      // Always get the fresh token for the current user
      const token = await getToken({ template: "default" });

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include", // keep cookies/session
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Handle unauthorized responses (e.g., switching users)
      if (response.status === 401) {
        await signOut();       // force logout
        navigate('/sign-in');  // redirect to login
        throw new Error('Unauthenticated. Please log in again.');
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText}`);
      }

      return response.json();
    } catch (err) {
      console.error('Error fetching chat data:', err);
      throw err; // propagate to react-query
    }
  },
  retry: false, // optional: don't retry if token is invalid
});

  return (
    <div className='chatPage'>
      <div className="wrapper">
        <div className="chat">
          {isPending
            ? "Loading..."
            : error
              ? "Something went wrong!"
              : data?.history?.map((message, i) => (
                <>
                  {message.img && (
                    <IKImage
                      urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
                      path={message.img}
                      height="300"
                      width="400"
                      transformation={[{ height: 300, width: 400 }]}
                      loading="lazy"
                      lqip={{ active: true, quality: 20 }}
                    />
                  )}
                  <div className={
                    message.role === "user" ? "message user" : "message ai"
                  }
                    key={i}

                  >
                    <Markdown>{message.parts[0].text}</Markdown>
                  </div>
                </>
              ))}

          {data && <NewPrompt data={data}/>}
        </div>
      </div>
    </div>
  )
}

export default ChatPage