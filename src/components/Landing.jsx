import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import audioManager from '../audioManager';

const Landing = ({ setUserName }) => {
  const location = useLocation();
  const [name, setName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedName = localStorage.getItem('userName');
    if (storedName) {
      setName(storedName);
    }
  }, []);

  const handleStart = () => {
    audioManager.playButtonClick();

    if (!name) {
      audioManager.playFail();
      alert('Please enter your name');
      return;
    }
    setUserName(name);
    localStorage.setItem('userName', name);
    audioManager.playBackgroundMusic();
    navigate('/choose', { state: { userName: name } });
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleStart();
    }
  };

  return (
    <div className="landing container">
      <h2>Welcome to MisCarded</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyPress={handleKeyPress}
      />
      <button className="comic-button" onClick={handleStart}>
        {name ? 'Update Name' : 'Start'}
      </button>
    </div>
  );
};

export default Landing;
