import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, getDoc, arrayUnion } from 'firebase/firestore';

const Join = () => {
  const { gameCode } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [playerName, setPlayerName] = useState(location.state?.userName || '');
  const [inputGameCode, setInputGameCode] = useState(gameCode || '');

  const handleJoinGame = async () => {
    if (!playerName) {
      alert('Please enter your name');
      return;
    }

    const code = gameCode || inputGameCode;
    if (!code) {
      alert('Please enter a game code');
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
      alert('Game not found');
    }
  };

  return (
    <div className="join">
      <h2>Join Game</h2>
      {!gameCode && (
        <input
          type="text"
          placeholder="Enter game code"
          className='game-code-input'
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
      <button className="comic-button" onClick={handleJoinGame}>Join Game</button>
    </div>
  );
};

export default Join;
