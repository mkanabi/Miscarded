import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import Landing from './components/Landing';
import Choose from './components/Choose';
import Host from './components/Host';
import Join from './components/Join';
import Lobby from './components/Lobby';
import Game from './components/Game';
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css';
import ContactUs from './components/Contacts';
import About from './components/About';
import HowToPlay from './components/HowToPlay';
import audioManager from './audioManager';
const App = () => {
  const [userName, setUserName] = React.useState('');

  return (
    <LanguageProvider>
      <Router>
        <Header userName={userName} setUserName={setUserName} />
        <Routes>
          <Route path="/" element={<Landing setUserName={setUserName} />} />
          <Route path="/choose" element={<Choose />} />
          <Route path="/host" element={<Host />} />
          <Route path="/join" element={<Join />} />
          <Route path="/game/:gameCode" element={<Game />} />
          <Route path="/join/:gameCode" element={<Join />} />
          <Route path="/about" element={<About />} />
          <Route path="/contacts" element={<ContactUs />} />
          <Route path="/how-to-play" element={<HowToPlay />} />
          <Route path="/lobby/:gameCode" element={<Lobby userName={userName} />} />
        </Routes>
        <Footer />
      </Router>
    </LanguageProvider>
  );
};

export default App;