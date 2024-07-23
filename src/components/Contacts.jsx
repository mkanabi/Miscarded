// src/components/ContactUs.jsx
import React, { useContext } from 'react';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const ContactUs = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className="container">
      <h2>{translations[language].contacts}</h2>
      <p>{translations[language].contactDescription}</p>
      <p>Email: mkanabi@protonmail.com</p>
    </div>
  );
};

export default ContactUs;
