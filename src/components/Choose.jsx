// src/components/Choose.jsx
import React, { useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import audioManager from '../audioManager';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const Choose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;
  const { language } = useContext(LanguageContext);

  const handleHostGame = () => {
    audioManager.playButtonClick();
    navigate('/host', { state: { userName } });
  };

  const handleJoinGame = () => {
    audioManager.playButtonClick();
    navigate('/join', { state: { userName } });
  };

  return (
    <div className="container">
      <h2>{translations[language].chooseOption}</h2>
      <div className="button-container">
        <button className="comic-button" onClick={handleHostGame}>{translations[language].hostGame}</button>
        <button className="comic-button" onClick={handleJoinGame}>{translations[language].joinGame}</button>
      </div>
    </div>
  );
};

export default Choose;
