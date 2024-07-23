import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, onSnapshot, collection, getDocs, arrayRemove, deleteDoc } from 'firebase/firestore';

const Game = ({ userName }) => {
  const { gameCode } = useParams() || localStorage.getItem('gameCode');
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState('');
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [assignedWords, setAssignedWords] = useState([]);
  const [myWord, setMyWord] = useState('');
  const [message, setMessage] = useState('');

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
    const gameRef = doc(firestore, 'games', gameCode);

    const unsubscribe = onSnapshot(gameRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setPlayers(data.players);
        setHost(data.host);

        // Retrieve player's state
        const playerState = data.playersState?.[userName];
        if (playerState) {
          setMyWord(playerState.word);
          if (playerState.isHost) {
            setHost(userName);
          }
        }

        if (data.status === 'started') {
          setWords(data.words);
        } else if (data.status === 'ended') {
          setMessage('Host ended the game');
          setTimeout(() => {
            navigate('/choose');
          }, 3000);
        }
        if (data.message) {
          setMessage(data.message);
          setTimeout(() => setMessage(''), 3000);
        }
      }
    });

    return () => unsubscribe();
  }, [gameCode, userName, navigate]);

  const updatePlayerState = async (userName, word) => {
    const gameRef = doc(firestore, 'games', gameCode);
    await updateDoc(gameRef, {
      [`playersState.${userName}`]: {
        word: word,
        isHost: userName === host
      }
    });
  };

  const assignWords = async () => {
    if (categories.length === 0) {
      throw new Error('No categories found');
    }

    let selectedCat;
    if (selectedCategory === '') {
      selectedCat = categories[Math.floor(Math.random() * categories.length)];
    } else {
      selectedCat = categories.find(cat => cat.id === selectedCategory);
    }
    const shuffledWords = selectedCat.words.sort(() => 0.5 - Math.random());

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

    // Update each player's state in Firestore
    newAssignedWords.forEach(async (assignedWord) => {
      await updatePlayerState(assignedWord.uid, assignedWord.word);
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

  const shuffleWords = async () => {
    try {
      await assignWords();
      await updateDoc(doc(firestore, 'games', gameCode), {
        status: 'started',
        message: 'Words shuffled by host'
      });
    } catch (error) {
      console.error('Error shuffling words:', error);
    }
  };

  const exitGame = async () => {
    const gameRef = doc(firestore, 'games', gameCode);
    if (players.length <= 3) {
      await updateDoc(gameRef, { status: 'ended', message: 'Not enough players. Game ended.' });
      setTimeout(() => {
        navigate('/choose');
      }, 3000);
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
      setTimeout(() => {
        navigate('/choose');
      }, 3000);
    }
  };

  const endGame = async () => {
    try {
      await updateDoc(doc(firestore, 'games', gameCode), {
        status: 'ended',
        message: 'Host ended the game'
      });
      setTimeout(async () => {
        await deleteDoc(doc(firestore, 'games', gameCode));
        localStorage.removeItem('gameCode');
        navigate('/choose');
      }, 3000);
    } catch (error) {
      console.error('Error ending game:', error);
    }
  };

  useEffect(() => {
    if (players.length > 0 && words.length === 0) {
      startGame();
    }
  }, [players]);

  return (
    <div className="container">
      <h1 className="word">{myWord}</h1>
      {message && <p className='message'>{message}</p>}
      <div>
        <h3>Players in the game:</h3>
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}{player === host && ' (Host)'}</li>
          ))}
        </ul>
      </div>
      {host === userName && (
        <div className='host-buttons'>
          <label>
            Select Category:
            <select className="comic-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
              <option value="" disabled>Select a category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>{category.category}</option>
              ))}
            </select>
          </label>
          <button onClick={shuffleWords} className="comic-button-restart">Shuffle Words</button>
          <button onClick={endGame} className="comic-button-end">End Game</button>
        </div>
      )}
      <button onClick={exitGame} className="comic-button-exit">Exit Game</button>
    </div>
  );
};

export default Game;
