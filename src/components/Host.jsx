import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc, updateDoc, onSnapshot } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { fetchWords } from '../utils/fetchWords';

const Host = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([userName]);
  const [categories, setCategories] = useState(['fruits']); // Example categories
  const navigate = useNavigate();

  useEffect(() => {
    const code = Math.random().toString(36).substring(2, 8);
    setGameCode(code);

    const createGame = async () => {
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

      return () => unsubscribe();
    };

    createGame().catch(console.error);
  }, [userName]);

  const assignWords = async (players) => {
    const category = categories[0]; // Assuming we're using the first category for simplicity
    const wordsList = await fetchWords(category);
    const playerWords = players.map((player, index) => {
      if (index === Math.floor(Math.random() * players.length)) {
        return { uid: player, word: wordsList[1] }; // Different word
      }
      return { uid: player, word: wordsList[0] }; // Same word
    });

    return playerWords;
  };

  const startGame = async () => {
    if (players.length < 3) {
      alert('Need at least 3 players to start the game');
      return;
    }

    const playerWords = await assignWords(players);
    await updateDoc(doc(firestore, 'games', gameCode), {
      status: 'started',
      words: playerWords,
    });
    navigate(`/game/${gameCode}`);
  };

  return (
    <div className="host">
      <h2>Game Code: {gameCode}</h2>
      <QRCode value={`${window.location.origin}/join/${gameCode}`} />
      <h3>Players:</h3>
      <ul className="players-list">
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <button className="comic-button" onClick={startGame}>Start Game</button>
    </div>
  );
};

export default Host;
