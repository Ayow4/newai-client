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
        parts: [{ text: "Pretend that you are an AI legal guidance system from the Philippines. Provide detailed information and guidance on legal matters, including relevant Republic Acts, and penalties. If the query is related to a serious crime or abuse, provide specific guidance and penalties. If the question is not related to law pretend that you don't know the answer, Provide a disclaimer , always don't forget to include references make it link or clickable." }],
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
      // temperature: 1,
      // maxOutputTokens: 5000, 
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
        const chunkText = chunk.text();
        console.log(chunkText);
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }

      mutation.mutate();
    } catch (err) {
      console.log(err);
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