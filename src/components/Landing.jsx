// src/components/Landing.jsx
import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import audioManager from '../audioManager';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const Landing = ({ setUserName }) => {
  const location = useLocation();
  const [name, setName] = useState(localStorage.getItem('userName') || '');
  const [message, setMessage] = useState('');
  const { language } = useContext(LanguageContext);
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleStart = () => {
    audioManager.playButtonClick();

    if (!name) {
      audioManager.playFail();
      setMessage(translations[language].enterYourName);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return;
    }
    setUserName(name);
    localStorage.setItem('userName', name);
    audioManager.playBackgroundMusic();
    navigate('/choose', { state: { userName: name } });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className='landing'>
            {message && <p className="message">{message}</p>}
    <div className="container" dir={language === 'ar' || language === 'ku' ? 'rtl' : 'ltr'}>
      <h2>{translations[language].welcome}</h2>
      <input
        type="text"
        placeholder={translations[language].enterName}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="comic-button" onClick={handleStart}>
        {name ? translations[language].updateName : translations[language].start}
      </button>
    </div></div>
  );
};

export default Landing;
