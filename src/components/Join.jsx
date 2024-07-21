// src/components/Join.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

const Join = () => {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(location.state?.userName || '');
  const [inputGameCode, setInputGameCode] = useState(gameCode || '');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (playerName && inputGameCode) {
      handleJoinGame();
    }
  }, [playerName, inputGameCode]);

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

      navigate(`/lobby/${code}`);
    } else {
      setMessage('Game not found');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSubmit = () => {
    if (!playerName || !inputGameCode) {
      setMessage('Please fill in all fields');
      setTimeout(() => setMessage(''), 3000);
      return;
    }
    handleJoinGame();
  };

  return (
    <div className="join">
      <h2>Join Game</h2>
      {message && <p className="message">{message}</p>}
      {!gameCode && (
        <input
          type="text"
          placeholder="Enter game code"
          className="game-code-input"
          value={inputGameCode}
          onChange={(e) => setInputGameCode(e.target.value)}
        />
      )}
      {!playerName && (
        <input
          type="text"
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      )}
      {(!playerName || !gameCode) && (
        <button className="comic-button" onClick={handleSubmit}>Join Game</button>
      )}
    </div>
  );
};

export default Join;
