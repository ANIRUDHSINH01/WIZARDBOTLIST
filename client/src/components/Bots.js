import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Bots = () => {
  const [bots, setBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchBots = async () => {
      try {
        const res = await axios.get('/api/bots');
        setBots(res.data);
      } catch (err) {
        console.error('Error fetching bots:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBots();
  }, []);

  const filteredBots = bots.filter(bot =>
    bot.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Bots</h1>
      <input
        type="text"
        placeholder="Search for a bot..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {filteredBots.length > 0 ? (
        <ul>
          {filteredBots.map(bot => (
            <li key={bot.id}>
              <Link to={`/bot/${bot.id}`}>
                <strong>{bot.id}</strong>
              </Link>
              <p>{bot.shortDescription}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No bots found.</p>
      )}
    </div>
  );
};

export default Bots;
