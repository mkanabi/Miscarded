// src/components/Game.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, onSnapshot, collection, getDocs } from 'firebase/firestore';

const Game = ({ userName }) => {
  const { gameCode } = useParams();
  const [players, setPlayers] = useState([]);
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [assignedWords, setAssignedWords] = useState([]);
  const [myWord, setMyWord] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesCollection = collection(firestore, 'categories');
      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => doc.data());
      setCategories(categoriesList);
    };

    fetchCategories().catch(console.error);
  }, []);

  useEffect(() => {
    const gameRef = doc(firestore, 'games', gameCode);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPlayers(data.players);
        if (data.status === 'started') {
          setWords(data.words);
          const myWordObj = data.words.find((word) => word.uid === userName);
          setMyWord(myWordObj ? myWordObj.word : '');
        }
      }
    });

    return () => unsubscribe();
  }, [gameCode, userName]);

  const assignWords = async () => {
    if (categories.length === 0) {
      throw new Error('No categories found');
    }

    const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
    const shuffledWords = selectedCategory.words.sort(() => 0.5 - Math.random());

    if (players.length < 2) {
      throw new Error('Not enough players to assign words');
    }

    const sameWord = shuffledWords[0];
    const differentWord = shuffledWords[1];

    const newAssignedWords = players.map((player, index) => ({
      uid: player,
      word: index === players.length - 1 ? differentWord : sameWord,
    }));

    setAssignedWords(newAssignedWords);
    await updateDoc(doc(firestore, 'games', gameCode), {
      words: newAssignedWords,
    });
  };

  const startGame = async () => {
    try {
      await assignWords();
      await updateDoc(doc(firestore, 'games', gameCode), {
        status: 'started',
      });
    } catch (error) {
      console.error('Error starting game:', error);
    }
  };

  const restartGame = async () => {
    try {
      await assignWords();
      await updateDoc(doc(firestore, 'games', gameCode), {
        status: 'started',
      });
    } catch (error) {
      console.error('Error restarting game:', error);
    }
  };

  useEffect(() => {
    if (players.length > 0 && words.length === 0) {
      startGame();
    }
  }, [players]);

  return (
    <div className="game">
      <h1>Your Word</h1>
      <h2>{myWord}</h2>
      {players[0] === userName && <button onClick={restartGame}>Restart Game</button>}
    </div>
  );
};

export default Game;
