import React, { useState } from 'react';
import axios from 'axios';

const Submit = () => {
  const [botId, setBotId] = useState('');
  const [prefix, setPrefix] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/submit', { botId, prefix, shortDescription });
      setMessage(res.data);
      setBotId('');
      setPrefix('');
      setShortDescription('');
    } catch (err) {
      setMessage(err.response.data);
    }
  };

  return (
    <div>
      <h1>Submit Bot</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Bot ID"
          value={botId}
          onChange={(e) => setBotId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Prefix"
          value={prefix}
          onChange={(e) => setPrefix(e.target.value)}
          required
        />
        <textarea
          placeholder="Short Description"
          value={shortDescription}
          onChange={(e) => setShortDescription(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Submit;
