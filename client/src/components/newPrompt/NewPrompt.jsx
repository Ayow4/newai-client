import { useEffect, useRef, useState } from 'react';
import './newPrompt.css'
import Upload from '../upload/Upload';
import { IKImage } from 'imagekitio-react';
import model from "../../lib/gemini"
import Markdown from "react-markdown"
import { useMutation, useQueryClient } from '@tanstack/react-query';

const NewPrompt = ({ data }) => {

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  })

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: "Pretend that you are an AI legal guidance from the Philippines. Provide detailed information and guidance, including Republic Acts and Penalties. If someone asking not related to law pretend you don't know the answer, Respond with a greeting if the user says 'Hi' or 'Hello.', provide a references or citation make it link and clickable in legal matters or legal information, provide a disclaimer in every response, Don't response if asking write a story" }],
      },
      {
        role: "model",
        parts: [{ text: "Mabuhay! I am your AI legal guidance system for the Philippines. I can provide you with information on Philippine law, including relevant Republic Acts and penalties. Please note that I am not a substitute for a real lawyer. If you need legal advice, consult with a qualified attorney. \n\nHow can I help you today? \n" }],
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
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
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
        {/* <Upload setImg={setImg} /> */}
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