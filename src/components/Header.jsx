import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import audioManager from '../audioManager';
import { firestore } from '../firebase';
import { deleteDoc, doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';

const Header = ({ soundEnabled, onSoundToggle, userName, setUserName }) => {
  const navigate = useNavigate();
  const storedGameCode = localStorage.getItem('gameCode');
  const joinedGameCode = localStorage.getItem('joinedGameCode');

  const handleEndGame = async () => {
    if (storedGameCode) {
      const gameRef = doc(firestore, 'games', storedGameCode);
      await deleteDoc(gameRef);
      localStorage.removeItem('gameCode');
      navigate('/');
    }
  };

  const handleChangeUserName = () => {
    navigate('/', { state: { resetName: true } });
  };

  const handleReturnToGame = async () => {
    const gameCode = storedGameCode || joinedGameCode;
    if (gameCode) {
      const gameRef = doc(firestore, 'games', gameCode);
      const gameDoc = await getDoc(gameRef);
      if (gameDoc.exists()) {
        const gameData = gameDoc.data();
        if (gameData.status === 'started') {
          navigate(`/game/${gameCode}`, { state: { userName } });
        } else {
          navigate(`/lobby/${gameCode}`, { state: { userName } });
        }
      }
    }
  };

  const handleLeaveGame = async () => {
    if (joinedGameCode) {
      const gameRef = doc(firestore, 'games', joinedGameCode);
      await updateDoc(gameRef, {
        players: arrayRemove(userName),
      });
      localStorage.removeItem('joinedGameCode');
      navigate('/');
    }
  };

  return (
    <header>
      <div>
        <Link to="/" className="logo">MisCarded</Link>
      </div>
      <nav>
        <Link to="/about">About</Link>
        <Link to="/how-to-play">How to Play</Link>
        <Link to="/contacts">Contacts</Link>
        {userName && (
          <div className="dropdown">
            <button className="dropdown-button">
              {userName}
            </button>
            <div className="dropdown-content">
              <button onClick={handleChangeUserName}>Change User Name</button>
            </div>
          </div>
        )}
        {storedGameCode && (
          <div className="dropdown">
            <button className="dropdown-button">
              Hosted Game
            </button>
            <div className="dropdown-content">
              <button onClick={handleReturnToGame}>Return to Game</button>
              <button onClick={handleEndGame}>End Game</button>
            </div>
          </div>
        )}
        {joinedGameCode && (
          <div className="dropdown">
            <button className="dropdown-button">
              Joined Game
            </button>
            <div className="dropdown-content">
              <button onClick={handleReturnToGame}>Return to Game</button>
              <button onClick={handleLeaveGame}>Leave Game</button>
            </div>
          </div>
        )}

      </nav>
      <div className="sound-toggle">
          <input
            type="checkbox"
            id="checkboxInput"
            checked={soundEnabled}
            onChange={onSoundToggle}
          />
          <label htmlFor="checkboxInput" className="toggleSwitch">
            <div className="speaker">
              <svg version="1.0" viewBox="0 0 75 75" stroke="#fff" strokeWidth="5">
                <path d="m39,14-17,15H6V48H22l17,15z" fill="#fff" strokeLinejoin="round"></path>
                <path d="m49,26 20,24m0-24-20,24" fill="#fff" strokeLinecap="round"></path>
              </svg>
            </div>
            <div className="mute-speaker">
              <svg xmlns="http://www.w3.org/2000/svg" version="1.0" viewBox="0 0 75 75">
                <path d="M39.389,13.769 L22.235,28.606 L6,28.606 L6,47.699 L21.989,47.699 L39.389,62.75 L39.389,13.769z" style={{ stroke: '#fff', strokeWidth: '5', strokeLinejoin: 'round', fill: '#fff' }}></path>
                <path d="M48,27.6a19.5,19.5 0 0 1 0,21.4M55.1,20.5a30,30 0 0 1 0,35.6M61.6,14a38.8,38.8 0 0 1 0,48.6" style={{ fill: 'none', stroke: '#fff', strokeWidth: '5', strokeLinecap: 'round' }}></path>
              </svg>
            </div>
          </label>
        </div>
    </header>
  );
};

export default Header;
