// src/App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Landing from './components/Landing';
import Choose from './components/Choose';
import Host from './components/Host';
import Join from './components/Join';
import Lobby from './components/Lobby';
import Game from './components/Game';
import './App.css';
const App = () => {
  const [userName, setUserName] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing setUserName={setUserName} />} />
        <Route path="/choose" element={<Choose />} />
        <Route path="/host" element={<Host />} />
        <Route path="/join" element={<Join />} />
        <Route path="/join/:gameCode" element={<Join />} />
        <Route path="/lobby/:gameCode" element={<Lobby userName={userName} />} />
        <Route path="/game/:gameCode" element={<Game userName={userName} />} />
      </Routes>
    </Router>
  );
};

export default App;
