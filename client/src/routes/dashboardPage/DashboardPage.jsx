import { useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboardPage.css'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react'; // Import useAuth to get the token

const DashboardPage = () => {
  
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken, signOut } = useAuth(); // added signOut to reset session if needed

  const mutation = useMutation({
    mutationFn: async (text) => {
      try {
        const token = await getToken();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        });

        if (response.status === 401) {
          // If token is invalid or user is unauthenticated, force sign out
          await signOut();
          navigate('/sign-in');
          throw new Error('Unauthenticated. Please log in again.');
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
      } catch (err) {
        console.error('Error creating chat:', err);
        throw err;
      }
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value.trim();
    if (!text) return;

    mutation.mutate(text);
    e.target.reset();
  };

  return (
    <div className='dashboardPage'>
      <div className="texts">
        <div className="logo">
          {/* <img src="/logo.png" alt="" /> */}
          <h1>  AI-DRIVEN FARMING PRACTICES</h1>
        </div>

        <div className="options">
          <div className="option">
            {/* <img src="/chat.png" alt="" /> */}
            <span>What are some effective natural methods for controlling aphids on vegetable crops?"</span>
          </div>
          <div className="option">
            {/* <img src="/image.png" alt="" /> */}
            <span>What are the signs of nitrogen deficiency in corn plants, and what are some common nitrogen fertilizer options?</span>
          </div>
          <div className="option">
            {/* <img src="/image.png" alt="" /> */}
            <span>What are some general tips for improving soil drainage in a heavy clay soil for planting tomatoes?</span>
          </div>
        </div>
      </div>
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <input type="text" name="text" placeholder='Enter prompt here' />
          <button>
            <img src="/arrow.png" alt="" />
          </button>
        </form>
      </div>
    </div>
  )
}

export default DashboardPage