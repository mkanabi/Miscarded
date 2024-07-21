// src/components/Lobby.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, onSnapshot, updateDoc } from 'firebase/firestore';

const Lobby = ({ userName }) => {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!gameCode) {
      console.error('Game code is undefined');
      return;
    }

    const gameRef = doc(firestore, 'games', gameCode);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPlayers(data.players);
        if (data.status === 'started') {
          navigate(`/game/${gameCode}`);
        }
      }
    });

    return () => unsubscribe();
  }, [gameCode, navigate]);

  const startGame = async () => {
    await updateDoc(doc(firestore, 'games', gameCode), {
      status: 'started'
    });
  };

  return (
    <div className="lobby">
      <h2>Game Code: {gameCode}</h2>
      <h3>Players:</h3>
      <ul>
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      {players[0] === userName && <button onClick={startGame}>Start Game</button>}
    </div>
  );
};

export default Lobby;
