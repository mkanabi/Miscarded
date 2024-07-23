// src/components/About.jsx
import React, { useContext } from 'react';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const About = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className="container">
      <h2>{translations[language].about}</h2>
      <p>{translations[language].aboutDescription}</p>
    </div>
  );
};

export default About;
