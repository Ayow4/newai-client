import React, { useState } from 'react';
import './faQ.css';

const FaQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="faq-container">
      <div className="faq-title">Law Finder FAQ</div>
      <div className="faq-questions">
        {faqs.map((faq, index) => (
          <div
          key={index}
          className={`faq-question ${activeIndex === index ? 'active' : ''}`}
          onClick={() => handleToggle(index)}
           >
            <div className="faq-question-title">{faq.question}</div>
            {activeIndex === index && (
              <div className="faq-question-answer">{faq.answer}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const faqs = [
  {
    question: 'What is Ai Law Finder?',
    answer: 'Ai Law Finder is an online tool that helps users in the Philippines identify the specific laws that apply to their situation, especially in cases of human rights violations.',
  },
  {
    question: 'How does Ai Law Finder work?',
    answer: 'Users provide details about their situation, and the system analyzes the information to recommend the relevant laws and legal actions they can take.',
  },
  {
    question: 'Is Ai Law Finder free to use?',
    answer: 'Yes, Ai Law Finder is free to use. It is designed to assist individuals in understanding their legal rights without the need for immediate legal consultation.',
  },
  {
    question: 'Who can use Ai Law Finder?',
    answer: 'Ai Law Finder is available to anyone in the Philippines who needs assistance in identifying applicable laws for their situation, particularly in cases involving human rights issues.',
  },
  {
    question: 'What kind of legal issues can Ai Law Finder help with?',
    answer: 'Ai Law Finder specializes in cases related to human rights violations, such as discrimination, unlawful detention, freedom of expression, and other constitutional rights.',
  },
  {
    question: 'Does Ai Law Finder provide legal advice?',
    answer: 'Ai Law Finder provides guidance on which laws may apply to your situation, but it is not a substitute for professional legal advice. It’s recommended to consult a lawyer for detailed legal assistance.',
  },
  {
    question: 'Is my information secure when using Ai Law Finder?',
    answer: 'Yes, Ai Law Finder ensures that all user data is kept confidential and secure, following strict data protection protocols.',
  },
  {
    question: 'Can Ai Law Finder help me file a case?',
    answer: 'While Ai Law Finder can guide you on the laws relevant to your situation, it does not handle case filing. You will need to consult a lawyer or legal professional for that process.',
  },
  {
    question: 'How accurate are the recommendations from Ai Law Finder?',
    answer: 'Ai Law Finder uses a database of laws and legal precedents to provide accurate recommendations. However, each case is unique, so it’s important to verify with a legal expert.',
  },
  {
    question: 'Can Ai Law Finder be used for other types of legal issues?',
    answer: 'Currently, Ai Law Finder is focused on human rights cases. Future updates may expand its capabilities to cover other areas of law.',
  },
];

export default FaQ;