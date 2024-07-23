import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import audioManager from '../audioManager';
import { firestore } from '../firebase';
import { deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations';

const Header = ({ userName, setUserName }) => {
  const navigate = useNavigate();
  const storedGameCode = localStorage.getItem('gameCode');
  const joinedGameCode = localStorage.getItem('joinedGameCode');
  const storedUserName = localStorage.getItem('userName');
  const [soundEnabled, setSoundEnabled] = useState(audioManager.soundEnabled);
  const { language, setLanguage } = useContext(LanguageContext);

  useEffect(() => {
    console.log("Stored user name from local storage:", storedUserName);
  }, []);

  const handleSoundToggle = () => {
    audioManager.toggleSound();
    setSoundEnabled(audioManager.soundEnabled);
  };

  const handleEndGame = async () => {
    audioManager.playButtonClick();
    if (storedGameCode) {
      try {
        const gameRef = doc(firestore, 'games', storedGameCode);
        await deleteDoc(gameRef);
        localStorage.removeItem('gameCode');
        navigate('/');
      } catch (error) {
        console.error("Error ending game:", error);
        localStorage.removeItem('gameCode'); // Remove the game code from local storage if the game is already deleted
      }
    }
  };

  const handleChangeUserName = () => {
    audioManager.playButtonClick();
    navigate('/', { state: { resetName: true } });
  };

  const handleReturnToGame = async () => {
    audioManager.playButtonClick();
    const gameCode = storedGameCode || joinedGameCode;
    if (gameCode) {
      const gameRef = doc(firestore, 'games', gameCode);
      const gameDoc = await getDoc(gameRef);
      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        if (gameData.status === 'started') {
          navigate(`/game/${gameCode}`, { state: { userName: storedUserName } });
        } else {
          navigate(`/lobby/${gameCode}`, { state: { userName: storedUserName } });
        }
      } else {
        console.error("Game not found. It might have been deleted.");
        localStorage.removeItem('gameCode');
        localStorage.removeItem('joinedGameCode');
        setUserName(null);
      }
    }
  };

  const handleLeaveGame = async () => {
    audioManager.playButtonClick();
    if (joinedGameCode) {
      try {
        const gameRef = doc(firestore, 'games', joinedGameCode);
        await updateDoc(gameRef, {
          players: arrayRemove(userName),
        });
        localStorage.removeItem('joinedGameCode');
        navigate('/');
      } catch (error) {
        console.error("Error leaving game:", error);
        localStorage.removeItem('joinedGameCode'); // Remove the game code from local storage if the game is already deleted
      }
    }
  };

  const handleLogoClick = () => {
    audioManager.playButtonClick();
    console.log("Stored user name from local storage on logo click:", storedUserName);
    if (storedUserName) {
      navigate('/choose', { state: { userName: storedUserName } });
    } else {
      navigate('/');
    }
  };

  const handleLinkClick = () => {
    audioManager.playButtonClick();
  };

  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  return (
    <header>
      <div onClick={handleLogoClick} className="logo" style={{ cursor: 'pointer' }}>
        MisCarded
      </div>
      <nav>
        <div className="dropdown">
          <button className="dropdown-button">☰</button>
          <div className="dropdown-content">
            <button onClick={() => { handleLinkClick(); navigate('/about'); }}>{translations[language].about}</button>
            <button onClick={() => { handleLinkClick(); navigate('/how-to-play'); }}>{translations[language].howToPlay}</button>
            <button onClick={() => { handleLinkClick(); navigate('/contacts'); }}>{translations[language].contacts}</button>
          </div>
        </div>
        {storedUserName && (
          <div className="dropdown">
            <button className="dropdown-button">
              {storedUserName}
            </button>
            <div className="dropdown-content">
              <button onClick={handleChangeUserName}>{translations[language].updateUserName}</button>
            </div>
          </div>
        )}
        {storedGameCode && (
          <div className="dropdown">
            <button className="dropdown-button">
              {translations[language].hostedGame}
            </button>
            <div className="dropdown-content">
              <button onClick={handleReturnToGame}>{translations[language].returnToGame}</button>
              <button onClick={handleEndGame}>{translations[language].endGame}</button>
            </div>
          </div>
        )}
        {joinedGameCode && (
          <div className="dropdown">
            <button className="dropdown-button">
              {translations[language].joinedGame}
            </button>
            <div className="dropdown-content">
              <button onClick={handleReturnToGame}>{translations[language].returnToGame}</button>
              <button onClick={handleLeaveGame}>{translations[language].leaveGame}</button>
            </div>
          </div>
        )}
      </nav>
      <div className="language-selector">
        <select value={language} onChange={handleLanguageChange} className="comic-select">
          <option value="en" style={{ fontFamily: 'Bangers, sans-serif' }}>English</option>
          <option value="ku" style={{ fontFamily: 'UniMahanGamayZhian, sans-serif', fontWeight: 800 }}>کوردی</option>
          <option value="ar" style={{ fontFamily: 'Lalezar-Regular, sans-serif' }}>العربية</option>
        </select>
      </div>
      <div className="sound-toggle">
        <input
          type="checkbox"
          id="checkboxInput"
          checked={soundEnabled}
          onChange={handleSoundToggle}
        />
        <label htmlFor="checkboxInput" className="toggleSwitch">
          <div className="speaker">
            <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth="5">
              <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round"></path>
              <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round"></path>
            </svg>
          </div>
          <div className="mute-speaker">
            <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
              <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{ stroke: '#fff', strokeWidth: '5', strokeLinejoin: 'round', fill: '#fff' }}></path>
              <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{ fill: 'none', stroke: '#fff', strokeWidth: '5', strokeLinecap: 'round' }}></path>
            </svg>
          </div>
        </label>
      </div>
    </header>
  );
};

export default Header;
