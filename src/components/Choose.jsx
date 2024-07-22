import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import audioManager from '../audioManager';

const Choose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;

  const handleHostGame = () => {
    audioManager.playButtonClick();
    navigate('/host', { state: { userName } });
  };

  const handleJoinGame = () => {
    audioManager.playButtonClick();
    navigate('/join', { state: { userName } });
  };

  const handleReturn = () => {
    audioManager.playButtonClick();
    navigate('/', { state: { userName } });
  };

  return (
    <div className="container">
      <h2>Choose an Option</h2>
      <div className="button-container">
        <button className="comic-button" onClick={handleHostGame}>Host Game</button>
        <button className="comic-button" onClick={handleJoinGame}>Join Game</button>
        <button className="comic-button return-button" onClick={handleReturn}>Return</button>
      </div>
    </div>
  );
};

export default Choose;
