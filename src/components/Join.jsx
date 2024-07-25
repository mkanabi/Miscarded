import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import audioManager from '../audioManager';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const Join = () => {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(location.state?.userName || localStorage.getItem('userName') || '');
  const [inputPlayerName, setInputPlayerName] = useState(playerName);
  const [inputGameCode, setInputGameCode] = useState(gameCode || '');
  const [message, setMessage] = useState('');
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    if (gameCode && playerName) {
      handleJoinGame();
    }
  }, [gameCode, playerName]);

  const handleJoinGame = async () => {
    if (!inputPlayerName) {
      setMessage(translations[language].enterYourName);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const code = gameCode || inputGameCode;
    if (!code) {
      setMessage(translations[language].enterGameCode);
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const gameRef = doc(firestore, 'games', code);
    const gameDoc = await getDoc(gameRef);

    if (gameDoc.exists()) {
      await updateDoc(gameRef, {
        players: arrayUnion(inputPlayerName),
      });

      localStorage.setItem('joinedGameCode', code);
      localStorage.setItem('userName', inputPlayerName);

      navigate(`/lobby/${code}`, { state: { userName: inputPlayerName } });
      audioManager.playGameStart();
    } else {
      audioManager.playFail();
      setMessage(translations[language].gameNotFound);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = () => {
    audioManager.playButtonClick();
    if (!inputPlayerName || (!inputGameCode && !gameCode)) {
      audioManager.playFail();
      setMessage(translations[language].fillAllFields);
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    setPlayerName(inputPlayerName); // Update playerName only on submit
    handleJoinGame();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleReturn = () => {
    audioManager.playButtonClick();
    navigate('/choose', { state: { userName: inputPlayerName } });
  };

  return (
    <div className="join">
      {message && <p className="message">{message}</p>}
      <div className="container">
        <h2>{translations[language].joinGame}</h2>
        {!gameCode && (
          <input
            type="text"
            placeholder={translations[language].enterGameCode}
            className="game-code-input"
            value={inputGameCode}
            onChange={(e) => setInputGameCode(e.target.value)}
            onKeyPress={handleKeyPress}
          />
        )}
        <input
          type="text"
          placeholder={translations[language].enterYourName}
          value={inputPlayerName}
          onChange={(e) => setInputPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <div className="button-container">
          <button className="comic-button" onClick={handleSubmit}>{translations[language].joinGame}</button>
          <button className="comic-button return-button" onClick={handleReturn}>{translations[language].return}</button>
        </div>
      </div>
    </div>
  );
};

export default Join;
