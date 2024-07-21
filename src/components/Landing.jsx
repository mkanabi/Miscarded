// src/components/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = ({ setUserName }) => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleStart = () => {
    if (!name) {
      setMessage('Please enter your name');
      setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
      return;
    }
    setUserName(name);
    navigate('/choose', { state: { userName: name } });
  };

  return (
    <div className="container">
      <h2>Welcome to MisCarded</h2>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button className="comic-button" onClick={handleStart}>Start</button>
      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default Landing;
