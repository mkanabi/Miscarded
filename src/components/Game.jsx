import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { firestore } from '../firebase';
import { doc, updateDoc, onSnapshot, collection, getDocs, arrayRemove, deleteDoc } from 'firebase/firestore';
import { LanguageContext } from '../LanguageContext';
import translations from '../translations';

const Game = ({ userName: propUserName }) => {
  const { gameCode } = useParams() || { gameCode: localStorage.getItem('gameCode') };
  const navigate = useNavigate();
  const [players, setPlayers] = useState([]);
  const [host, setHost] = useState('');
  const [words, setWords] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('random');
  const [customWords, setCustomWords] = useState('');
  const [assignedWords, setAssignedWords] = useState([]);
  const [myWord, setMyWord] = useState('');
  const [message, setMessage] = useState('');
  const { language } = useContext(LanguageContext);
  const userName = propUserName || localStorage.getItem('userName');

  useEffect(() => {
    const fetchCategories = async () => {
      let categoriesCollection;
      if (language === 'ar') {
        categoriesCollection = collection(firestore, 'arabic_categories');
      } else if (language === 'ku') {
        categoriesCollection = collection(firestore, 'kurdish_categories');
      } else {
        categoriesCollection = collection(firestore, 'categories');
      }

      const categoriesSnapshot = await getDocs(categoriesCollection);
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCategories(categoriesList);
    };

    fetchCategories().catch(console.error);
  }, [language]);

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
          setMessage(translations[language].hostEndedGame);
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
  }, [gameCode, userName, navigate, language]);

  const updatePlayerState = async (userName, word, isHost) => {
    const gameRef = doc(firestore, 'games', gameCode);
    await updateDoc(gameRef, {
      [`playersState.${userName}`]: {
        word: word,
        isHost: isHost,
      }
    });
  };

  const assignWords = async () => {
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

    if (players.length < 2) {
      throw new Error(translations[language].notEnoughPlayers);
    }

    const shuffledWords = wordsList.sort(() => 0.5 - Math.random());
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
      await updatePlayerState(assignedWord.uid, assignedWord.word, assignedWord.uid === host);
    });
  };

  const shuffleWords = async () => {
    try {
      await assignWords();
      setMessage(translations[language].wordsShuffled);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error shuffling words:', error);
      setMessage(translations[language].shuffleError);
      setTimeout(() => setMessage(''), 3000);
    }
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

  const exitGame = async () => {
    const gameRef = doc(firestore, 'games', gameCode);
    if (players.length <= 3) {
      await updateDoc(gameRef, { status: 'ended', message: translations[language].notEnoughPlayersToEnd });
      setTimeout(() => {
        navigate('/choose');
      }, 3000);
    } else {
      if (host === userName) {
        const remainingPlayers = players.filter(player => player !== userName);
        await updateDoc(gameRef, {
          players: arrayRemove(userName),
          host: remainingPlayers[0],
          message: `${userName} ${translations[language].exitedGame} ${remainingPlayers[0]} ${translations[language].newHost}`
        });
      } else {
        await updateDoc(gameRef, {
          players: arrayRemove(userName),
          message: `${userName} ${translations[language].exitedGame}`
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
        message: translations[language].hostEndedGame
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
    <div className="Game">
      {message && <p className='message'>{message}</p>}
      <div className="container">
        <h1 className="word">{myWord}</h1>
        <div>
          <h3>{translations[language].playersInGame}</h3>
          <ul>
            {players.map((player, index) => (
              <li key={index}>{player}{player === host && ` (${translations[language].host})`}</li>
            ))}
          </ul>
        </div>
        {host === userName && (
          <div className='host-buttons'>
            <label>
              {translations[language].selectCategory}:
              <select className="comic-select" value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
                <option value="random">{translations[language].random}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.category}</option>
                ))}
                <option value="custom">{translations[language].custom}</option>
              </select>
            </label>
            {selectedCategory === 'custom' && (
              <input
                type="text"
                className="comic-input"
                placeholder={translations[language].enterCustomWords}
                value={customWords}
                onChange={(e) => setCustomWords(e.target.value)}
              />
            )}
            <button onClick={shuffleWords} className="comic-button-restart">{translations[language].shuffleWords}</button>
            <button onClick={endGame} className="comic-button-end">{translations[language].endGame}</button>
          </div>
        )}
        <button onClick={exitGame} className="comic-button-exit">{translations[language].exitGame}</button>
      </div>
    </div>
  );
};

export default Game;
