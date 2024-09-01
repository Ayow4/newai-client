import { useMutation, useQueryClient } from '@tanstack/react-query';
import './dashboardPage.css'
import { useNavigate } from 'react-router-dom';

const DashboardPage = () => {

  const queryClient = useQueryClient();

  const navigate = useNavigate()

  const mutation = useMutation({
    mutationFn: (text) => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text }),
      }).then((res) => res.json());
    },
    onSuccess: (id) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["userChats"] });
      navigate(`/dashboard/chats/${id}`)
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value.trim(); // <--- Use elements property and trim() method
    if (!text) return;

    mutation.mutate(text);
    e.target.reset(); // <--- Reset the form to prevent double submission
  };

  return (
    <div className='dashboardPage'>
      <div className="texts">
        <div className="logo">
          <img src="/logo.png" alt="" />
          <h1>AI LAWFINDER</h1>
        </div>

        {/* <div className="options">
          <div className="option">
            <img src="/chat.png" alt="" />
            <span>---------------</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>---------------</span>
          </div>
          <div className="option">
            <img src="/image.png" alt="" />
            <span>---------------</span>
          </div>
        </div> */}
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