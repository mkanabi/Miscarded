import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';
import audioManager from '../audioManager';

const Join = () => {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(location.state?.userName || '');
  const [inputGameCode, setInputGameCode] = useState(gameCode || '');
  const [message, setMessage] = useState('');

  const handleJoinGame = async () => {
    if (!playerName) {
      setMessage('Please enter your name');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const code = gameCode || inputGameCode;
    if (!code) {
      setMessage('Please enter a game code');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    const gameRef = doc(firestore, 'games', code);
    const gameDoc = await getDoc(gameRef);

    if (gameDoc.exists()) {
      await updateDoc(gameRef, {
        players: arrayUnion(playerName),
      });

      localStorage.setItem('joinedGameCode', code);
      localStorage.setItem('userName', playerName);

      navigate(`/lobby/${code}`, { state: { userName: playerName } });
      audioManager.playGameStart();
    } else {
      audioManager.playFail();
      setMessage('Game not found');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = () => {
    audioManager.playButtonClick();
    if (!playerName || (!inputGameCode && !gameCode)) {
      audioManager.playFail();
      setMessage('Please fill in all fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    handleJoinGame();
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleReturn = () => {
    audioManager.playButtonClick();
    navigate('/choose', { state: { userName: playerName } });
  };

  return (
    <div className="container">
      <h2>Join Game</h2>
      {message && <p className="message">{message}</p>}
      {!gameCode && (
        <input
          type="text"
          placeholder="Enter game code"
          className="game-code-input"
          value={inputGameCode}
          onChange={(e) => setInputGameCode(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      )}
      {!location.state?.userName && (
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          onKeyPress={handleKeyPress}
        />
      )}
      <div className="button-container">
        <button className="comic-button" onClick={handleSubmit}>Join Game</button>
        <button className="comic-button return-button" onClick={handleReturn}>Return</button>
      </div>
    </div>
  );
};

export default Join;
