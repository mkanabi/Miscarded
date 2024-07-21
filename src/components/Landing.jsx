// src/components/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = ({ setUserName }) => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name) {
      alert('Please enter your name');
      return;
    }
    setUserName(name);
    navigate('/choose', { state: { userName: name } });
  };

  return (
    <div className="landing">
      <h2>Welcome to MisCarded</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="comic-button" onClick={handleStart}>Start</button>
    </div>
  );
};

export default Landing;
