import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import Bots from './components/Bots';
import BotDetails from './components/BotDetails';
import Submit from './components/Submit';
import Admin from './components/Admin';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/bots" element={<Bots />} />
            <Route path="/bot/:id" element={<BotDetails />} />
            <Route path="/submit" element={<Submit />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
