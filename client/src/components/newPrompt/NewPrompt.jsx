import { useEffect, useRef, useState } from 'react';
import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-react"; // ✅ import Clerk hook

const NewPrompt = ({ data }) => {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  })

   const { getToken } = useAuth(); // ✅ access Clerk JWT

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Pretend you are a farming chatbot designed to help farmers and agriculture enthusiasts, You only provide guidance related to crop farming topics such as planting, pest control, fertilizers, and crop care, if the user show some images you should give an advise for planting, fertilize pest, control and crop care only, Do not provide advice on livestock, fisheries, or personalized farm-specific recommendations, You are not a replacement for professional agricultural experts—your role is to offer general, educational, and supportive information about farming. Answer questions clearly and helpfully as if you are a digital assistant for crop farming education, Always stay within your area of knowledge, always add a disclaimer at the last of your response." }],
      },
      {
        role: "model",
        parts: [{ text: "Okay, I'm ready to be your crop farming assistant! Ask me anything related to planting, pest control, fertilizers, and crop care, I'll do my best to provide helpful, educational information. Remember, I'm here to guide you, not replace expert advice, Let's grow some amazing crops!. \n" }],
      },
      ...(data?.history.map((item) => ({
        role: item.role,
        parts: [{ text: item.parts[0].text }],
      })) || []),
    ],
    generationConfig: {
      maxOutputTokens: 8192,
    }
  });

  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

 const mutation = useMutation({
  mutationFn: async () => {
    try {
      const token = await getToken();

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      });

      if (response.status === 401) {
        // Token invalid, force logout
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
      console.error("Error updating chat:", err);
      throw err; // propagate error to react-query
    }
  },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const add = async (text, isInitial) => {
    if (!isInitial) setQuestion(text);
  
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        try {
          const chunkText = await chunk.text();
          accumulatedText += chunkText;
  
          // Simulate typing effect with a delay
          setAnswer(prevAnswer => prevAnswer + chunkText);
          await new Promise(resolve => setTimeout(resolve, 50)); // Adjust delay as needed
  
        } catch (err) {
          console.error('Error processing chunk:', err);
        }
      }
  
      console.log('Final answer:', accumulatedText); // Log the final accumulated text
      mutation.mutate();
    } catch (err) {
      console.error('Error during chat interaction:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const text = e.target.text.value;
    if (!text) return;

    add(text, false);
  };

  // IN PRODUCTION WE DON'T NEED IT
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      if (data?.history?.length === 1) {
        add(data.history[0].parts[0].text, true);
      }
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {/* ADD NEW CHAT */}
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Enter prompt here" />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
