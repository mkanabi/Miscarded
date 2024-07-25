import React, { useState, useEffect, useRef, useContext } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import audioManager from '../audioManager';
import translations from '../translations';
import { LanguageContext } from '../LanguageContext';

const Host = () => {
  const location = useLocation();
  const userName = location.state?.userName || localStorage.getItem('userName');
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([userName]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const gameCreated = useRef(false); // to track if the game has been created
  const { language } = useContext(LanguageContext);

  useEffect(() => {
    const storedGameCode = localStorage.getItem('gameCode');
    if (storedGameCode) {
      setGameCode(storedGameCode);
      const gameRef = doc(firestore, 'games', storedGameCode);
      const unsubscribe = onSnapshot(gameRef, (doc) => {
        if (doc.exists()) {
          setPlayers(doc.data().players);
        }
      });
      gameCreated.current = true;
      return () => unsubscribe();
    } else if (!gameCreated.current) {
      const code = Math.random().toString(36).substring(2, 8);
      setGameCode(code);
      localStorage.setItem('gameCode', code);

      const createGame = async () => {
        try {
          await setDoc(doc(firestore, 'games', code), {
            host: userName,
            players: [userName],
            status: 'waiting',
            words: [],
            usedWords: [], // Initialize used words array
          });

          const gameRef = doc(firestore, 'games', code);
          const unsubscribe = onSnapshot(gameRef, (doc) => {
            if (doc.exists()) {
              setPlayers(doc.data().players);
            }
          });

          gameCreated.current = true; // set the flag to true after game creation
          return () => unsubscribe();
        } catch (error) {
          console.error('Error creating game:', error);
        }
      };

      createGame().catch(console.error);
    } else {
      console.log('Game already created, skipping creation.');
    }
  }, [userName]);

  const startGame = async () => {
    audioManager.playButtonClick();
    if (players.length < 3) {
      audioManager.playFail();
      setMessage(translations[language].needPlayers);
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return;
    }

    try {
      await updateDoc(doc(firestore, 'games', gameCode), {
        status: 'started',
        message: translations[language].gameStartedByHost || '',
      });
      navigate(`/game/${gameCode}`);
      audioManager.playGameStart();
    } catch (error) {
      console.error('Error starting game:', error);
      setMessage(translations[language].startGameError);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const exitGame = async () => {
    audioManager.playButtonClick();
    const gameRef = doc(firestore, 'games', gameCode);
    await deleteDoc(gameRef);
    localStorage.removeItem('gameCode');
    navigate('/choose');
  };

  const handleReturn = () => {
    audioManager.playButtonClick();
    navigate('/choose', { state: { userName } });
  };

  return (
    <div className="host">
      {message && <p className="message">{message}</p>}
      <div className="container">
        <h2>{translations[language].gameCode}: <gamecode>{gameCode}</gamecode></h2>
        <QRCode value={`${window.location.origin}/join/${gameCode}`} />
        <h3>{translations[language].players}:</h3>
        <ol className="players-list">
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ol>
        <div className="button-container">
          <button className="comic-button" onClick={startGame}>{translations[language].startGame}</button>
          <button className="comic-button" onClick={exitGame}>{translations[language].exitGame}</button>
          <button className="comic-button return-button" onClick={handleReturn}>{translations[language].return}</button>
        </div>
      </div>
    </div>
  );
};

export default Host;
