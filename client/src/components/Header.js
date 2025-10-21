import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <Link to="/">WizardBotList</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/bots">Bots</Link></li>
          <li><Link to="/submit">Submit Bot</Link></li>
        </ul>
      </nav>
      <div className="auth-buttons">
        <a href="/api/auth/login">Login with Discord</a>
      </div>
    </header>
  );
};

export default Header;
