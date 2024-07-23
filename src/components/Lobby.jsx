// src/components/Lobby.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, onSnapshot, updateDoc, arrayRemove } from 'firebase/firestore';

const Lobby = ({ userName }) => {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState('');
  const [message, setMessage] = useState('');
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
        setHost(data.host);
        if (data.status === 'started') {
          navigate(`/game/${gameCode}`);
        } else if (data.status === 'ended') {
          alert('Host ended game');
          navigate('/');
        }
        if (data.message) {
          setMessage(data.message);
          setTimeout(() => setMessage(''), 3000);
        }
      }
    });

    return () => unsubscribe();
  }, [gameCode, navigate]);

  const startGame = async () => {
    await updateDoc(doc(firestore, 'games', gameCode), {
      status: 'started',
      message: 'Game started by host'
    });
  };

  const exitGame = async () => {
    const gameRef = doc(firestore, 'games', gameCode);
    if (players.length <= 3) {
      await updateDoc(gameRef, { status: 'ended' });
    } else {
      if (host === userName) {
        const remainingPlayers = players.filter(player => player !== userName);
        await updateDoc(gameRef, {
          players: arrayRemove(userName),
          host: remainingPlayers[0],
          message: `${userName} exited the game. ${remainingPlayers[0]} is the new host.`
        });
      } else {
        await updateDoc(gameRef, {
          players: arrayRemove(userName),
          message: `${userName} exited the game.`
        });
      }
    }
    navigate('/');
  };

  return (
    <div className="container">
      <h2>Game Code: {gameCode}</h2>
      {message && <p>{message}</p>}
      <h3>Players:</h3>
      <ol>
        {players.map((player, index) => (
          <li key={index}>{player}{player === host && ' (Host)'}</li>
        ))}
      </ol>
      {host === userName && (
        <button onClick={startGame} className="comic-button">Start Game</button>
      )}
      <button onClick={exitGame} className="comic-button">Exit Game</button>
    </div>
  );
};

export default Lobby;
