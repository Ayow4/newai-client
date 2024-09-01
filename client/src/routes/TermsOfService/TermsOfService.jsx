import React, { useState } from 'react';
import './termsOfService.css';

const TermsOfService = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <div className="terms-container">
      <div className="terms-title">Terms of Service</div>
      <div className="terms-sections">
        {termsSections.map((section, index) => (
          <div
            key={index}
            className={`terms-section ${activeIndex === index ? 'active' : ''}`}
            onClick={() => handleToggle(index)}
          >
            <div className="terms-section-title">{section.title}</div>
            {activeIndex === index && (
              <div className="terms-section-content">{section.content}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const termsSections = [
  {
    title: '1. Acceptance of Terms',
    content:
      'By using Ai Law Finder, you agree to be bound by these Terms of Service.',
  },
  {
    title: '2. Description of Service',
    content:
      'Ai Law Finder is a legal guidance platform designed to help users in the Philippines determine the appropriate laws applicable to their cases involving human rights violations. The service provides general legal information and is not a substitute for professional legal advice.',
  },
  {
    title: '3. User Responsibilities',
    content:
      'Accuracy of Information: Users are responsible for providing accurate and up-to-date information when using the service. The effectiveness of the service depends on the accuracy of the information provided. Legal Compliance: Users must comply with all applicable laws when using Ai Law Finder. Misuse of the service for unlawful purposes is strictly prohibited.',
  },
  {
    title: '4. Disclaimer of Warranties',
    content:
      'Ai Law Finder is provided "as is" and "as available," without any warranties of any kind, either express or implied. We do not guarantee the accuracy, completeness, or reliability of the information provided by the service.',
  },
  {
    title: '5. Limitation of Liability',
    content:
      'Ai Law Finder and its operators shall not be liable for any direct, indirect, incidental, or consequential damages arising from the use or inability to use the service, even if advised of the possibility of such damages.',
  },
  {
    title: '6. Modifications to the Service',
    content:
      'We reserve the right to modify or discontinue Ai Law Finder at any time, without prior notice. We are not liable for any modifications, suspension, or discontinuation of the service.',
  },
  {
    title: '7. Termination',
    content:
      'We may terminate or suspend access to Ai Law Finder without notice for conduct that we believe violates these Terms or is harmful to other users.',
  },
  {
    title: '8. Governing Law',
    content:
      'These Terms shall be governed by and construed in accordance with the laws of the Philippines, without regard to its conflict of law principles.',
  },
];

export default TermsOfService;