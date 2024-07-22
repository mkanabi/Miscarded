import React, { useState, useEffect, useRef } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import { fetchWords } from '../utils/fetchWords';
import audioManager from '../audioManager';

const Host = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([userName]);
  const [categories] = useState(['fruits']); // Example categories
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const gameCreated = useRef(false); // to track if the game has been created
  const timeoutRef = useRef(null); // to store the timeout ID

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
      console.log('Creating game for the first time...');
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
            createdAt: new Date().getTime(), // Timestamp for creation
          });
          console.log(`Game created with code: ${code}`);

          const gameRef = doc(firestore, 'games', code);
          const unsubscribe = onSnapshot(gameRef, (doc) => {
            if (doc.exists()) {
              console.log(`Snapshot data: ${JSON.stringify(doc.data())}`);
              setPlayers(doc.data().players);
            }
          });

          gameCreated.current = true; // set the flag to true after game creation

          // Set a timeout to delete the game if not started within 10 minutes
          timeoutRef.current = setTimeout(async () => {
            const gameSnapshot = await gameRef.get();
            if (gameSnapshot.exists && gameSnapshot.data().status === 'waiting') {
              console.log('Deleting inactive game...');
              await deleteDoc(gameRef);
              localStorage.removeItem('gameCode');
              setMessage('Game expired due to inactivity');
              setTimeout(() => {
                navigate('/');
              }, 3000);
            }
          }, 10 * 60 * 1000); // 10 minutes

          return () => {
            clearTimeout(timeoutRef.current); // Clear timeout on component unmount
            unsubscribe();
          };
        } catch (error) {
          console.error('Error creating game:', error);
        }
      };

      createGame().catch(console.error);
    } else {
      console.log('Game already created, skipping creation.');
    }
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
    audioManager.playButtonClick();
    if (players.length < 3) {
      audioManager.playFail();
      setMessage('Need at least 3 players to start the game');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return;
    }

    const playerWords = await assignWords(players);
    await updateDoc(doc(firestore, 'games', gameCode), {
      status: 'started',
      words: playerWords,
    });
    clearTimeout(timeoutRef.current); // Clear the timeout if the game starts
    navigate(`/game/${gameCode}`);
    audioManager.playGameStart();
  };

  const exitGame = async () => {
    audioManager.playButtonClick();
    const gameRef = doc(firestore, 'games', gameCode);
    await deleteDoc(gameRef);
    localStorage.removeItem('gameCode');
    clearTimeout(timeoutRef.current); // Clear the timeout if the host exits the game
    navigate('/');
  };

  const handleReturn = () => {
    audioManager.playButtonClick();
    navigate('/choose', { state: { userName } });
  };

  return (
    <div className="container">
      <h2>Game Code: {gameCode}</h2>
      <QRCode value={`${window.location.origin}/join/${gameCode}`} />
      <h3>Players:</h3>
      <ul className="players-list">
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      {message && <p className="message">{message}</p>}
      <div className="button-container">
        <button className="comic-button" onClick={startGame}>Start Game</button>
        <button className="comic-button" onClick={exitGame}>Exit Game</button>
        <button className="comic-button return-button" onClick={handleReturn}>Return</button>
      </div>
    </div>
  );
};

export default Host;
