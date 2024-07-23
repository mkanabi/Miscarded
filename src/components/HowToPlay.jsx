// src/components/HowToPlay.jsx
import React, { useContext } from 'react';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const HowToPlay = () => {
  const { language } = useContext(LanguageContext);

  return (
    <div className="container">
      <h2>{translations[language].howToPlay}</h2>
      <ol>
        <li>{translations[language].step1}</li>
        <li>{translations[language].step2}</li>
        <li>{translations[language].step3}</li>
        <li>{translations[language].step4}</li>
      </ol>
    </div>
  );
};

export default HowToPlay;
