// DashboardPage.jsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import "./dashboardPage.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { getToken, signOut } = useAuth();

  const mutation = useMutation({
    mutationFn: async (text) => {
      try {
        const token = await getToken();

        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        });

        if (response.status === 401) {
          await signOut();
          navigate("/sign-in");
          throw new Error("Unauthenticated. Please log in again.");
        }

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error ${response.status}: ${errorText}`);
        }

        return response.json();
      } catch (err) {
        console.error("Error creating chat:", err);
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
    <main className="dashboardPage" aria-live="polite">
      <section className="hero">
        <div className="hero-texts">
          <div className="logo">
            <h1>AI-DRIVEN FARMING PRACTICES</h1>
          </div>

          <div className="options" role="list">
            <button className="option" type="button">What are some effective natural methods for controlling aphids on vegetable crops?</button>
            <button className="option" type="button">What are the signs of nitrogen deficiency in corn plants, and what are common fertilizer options?</button>
            <button className="option" type="button">Tips for improving soil drainage in heavy clay soil for tomatoes?</button>
          </div>
        </div>

        <div className="formContainer" aria-label="Create new chat">
          <form onSubmit={handleSubmit}>
            <input name="text" type="text" placeholder="Enter prompt here" aria-label="Chat prompt" />
            <button type="submit" aria-label="Send prompt">
              <img src="/arrow.png" alt="" />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default DashboardPage;
