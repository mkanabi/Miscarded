import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Choose = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userName = location.state?.userName;

  const handleHostGame = () => {
    navigate('/host', { state: { userName } });
  };

  const handleJoinGame = () => {
    navigate('/join', { state: { userName } });
  };

  return (
    <div className="container">
      <h2>Choose an Option</h2>
      <div className="button-container">
        <button className="comic-button" onClick={handleHostGame}>Host Game</button>
        <button className="comic-button" onClick={handleJoinGame}>Join Game</button>
      </div>
    </div>
  );
};

export default Choose;
