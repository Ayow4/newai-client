import { useState } from 'react';
import './privacyPolicy.css'

const PrivacyPolicy = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const handleToggle = (index) => {
      setActiveIndex(index === activeIndex ? null : index);
    };
  
    return (
      <div className="privacy-policy-container">
        <div className="privacy-policy-title">Privacy Policy</div>
        <div className="privacy-policy-sections">
          {privacyPolicySections.map((section, index) => (
            <div
              key={index}
              className={`privacy-policy-section ${activeIndex === index ? 'active' : ''}`}
              onClick={() => handleToggle(index)}
            >
              <div className="privacy-policy-section-title">{section.title}</div>
              {activeIndex === index && (
                <div className="privacy-policy-section-content">{section.content}</div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  const privacyPolicySections = [
    {
      title: '1. Information We Collect',
      content:
        'Personal Information: We may collect personal information such as your name, email address, and other details necessary to provide the service. Usage Data: We collect information on how you interact with Ai Law Finder, including the pages visited and the features used.',
    },
    {
      title: '2. How We Use Your Information',
      content:
        'Service Provision: Your information is used to provide and improve the Ai Law Finder service. Communication: We may use your contact information to send updates or important information regarding your use of the service. Legal Compliance: We may use your information to comply with legal obligations.',
    },
    {
      title: '3. Data Security',
      content:
        'We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, use, or disclosure. However, no method of transmission over the internet is 100% secure.',
    },
    {
      title: '4. Sharing of Information',
      content:
        'We do not share your personal information with third parties except as required by law or to protect our rights.',
    },
    {
      title: '5. Data Retention',
      content:
        'We retain your personal information only as long as necessary to fulfill the purposes for which it was collected and to comply with legal obligations.',
    },
    {
      title: '6. Your Rights',
      content:
        'You have the right to access, correct, or delete your personal information. You may also object to the processing of your data or request data portability.',
    },
    {
      title: '7. Changes to this Policy',
      content:
        'We may update this Privacy Policy from time to time. We will notify you of any significant changes by posting the new policy on our website.',
    },
    {
      title: '8. Contact Us',
      content:
        'If you have any questions or concerns about this Privacy Policy, please contact us at Facebook Page: AI Law Finder.',
    },
];

export default PrivacyPolicy