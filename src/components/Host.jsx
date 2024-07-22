// src/components/Host.jsx
import React, { useState, useEffect, useRef } from 'react';
import { firestore } from '../firebase';
import { doc, setDoc, deleteDoc, onSnapshot, collection, getDocs, updateDoc } from 'firebase/firestore';
import { useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode.react';
import audioManager from '../audioManager';

const Host = () => {
  const location = useLocation();
  const userName = location.state?.userName;
  const [gameCode, setGameCode] = useState('');
  const [players, setPlayers] = useState([userName]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [customWords, setCustomWords] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const gameCreated = useRef(false); // to track if the game has been created

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(firestore, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    };

    fetchCategories().catch(console.error);
  }, []);

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

  const assignWords = async (players) => {
    let wordsList;
    if (selectedCategory === 'custom') {
      wordsList = customWords.split(',').map(word => word.trim());
    } else {
      let selectedCat;
      if (selectedCategory === 'random') {
        selectedCat = categories[Math.floor(Math.random() * categories.length)];
      } else {
        selectedCat = categories.find(cat => cat.id === selectedCategory);
      }
      wordsList = selectedCat.words;
    }

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
    navigate(`/game/${gameCode}`);
    audioManager.playGameStart();
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
    <div className="container">
      <h2>Game Code: {gameCode}</h2>
      <QRCode value={`${window.location.origin}/join/${gameCode}`} />
      <h3>Players:</h3>
      <ul className="players-list">
        {players.map((player, index) => (
          <li key={index}>{player}</li>
        ))}
      </ul>
      <label>
        Select Category:
        <select className="comic-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="random">Random</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.category}</option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>
      {selectedCategory === 'custom' && (
        <input
          type="text"
          className="comic-input"
          placeholder="Enter custom words separated by commas"
          value={customWords}
          onChange={(e) => setCustomWords(e.target.value)}
        />
      )}
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
