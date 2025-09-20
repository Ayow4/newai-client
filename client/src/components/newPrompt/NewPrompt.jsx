import { useEffect, useRef, useState } from 'react';
import './newPrompt.css';
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from 'react-router-dom';

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const { getToken, signOut } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const endRef = useRef(null);
  const formRef = useRef(null);

  // Initialize chat with prior history
  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{
          text: "Pretend you are a farming chatbot designed to help farmers and agriculture enthusiasts..."
        }],
      },
      {
        role: "model",
        parts: [{
          text: "Okay, I'm ready to be your crop farming assistant! Ask me anything..."
        }],
      },
      ...(data?.history?.map(item => ({
        role: item.role,
        parts: [{ text: item.parts[0].text }]
      })) || []),
    ],
    generationConfig: { maxOutputTokens: 8192 }
  });

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  // Mutation to update chat on backend
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
            question: question || undefined,
            answer,
            img: img.dbData?.filePath || undefined,
          }),
        });

        if (response.status === 401) {
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
        throw err;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", data._id] });
      formRef.current?.reset();
      setQuestion("");
      setAnswer("");
      setImg({ isLoading: false, error: "", dbData: {}, aiData: {} });
    },
  });

  // Function to send prompt to model
  const add = async (text, isInitial = false) => {
    if (!isInitial) setQuestion(text);

    try {
      const result = await chat.sendMessageStream(
        Object.keys(img.aiData).length ? [img.aiData, text] : [text]
      );

      let accumulatedText = "";
      for await (const chunk of result.stream) {
        try {
          const chunkText = await chunk.text();
          accumulatedText += chunkText;
          setAnswer(prev => prev + chunkText);
          await new Promise(r => setTimeout(r, 50)); // typing effect
        } catch (err) {
          console.error('Error processing chunk:', err);
        }
      }

      mutation.mutate();
    } catch (err) {
      console.error('Error during chat interaction:', err);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    const text = e.target.text.value.trim();
    if (!text) return;
    add(text, false);
  };

  // Automatically send first message if this is the first chat
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && data?.history?.length === 1) {
      add(data.history[0].parts[0].text, true);
    }
    hasRun.current = true;
  }, []);

  return (
    <>
      {img.isLoading && <div className="loading">Loading...</div>}

      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}

      {question && <div className="message user">{question}</div>}
      {answer && <div className="message"><Markdown>{answer}</Markdown></div>}

      <div className="endChat" ref={endRef}></div>

      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Enter prompt here" />
        <button>
          <img src="/arrow.png" alt="send" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;
