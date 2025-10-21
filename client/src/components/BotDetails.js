import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const BotDetails = () => {
  const { id } = useParams();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [voteMessage, setVoteMessage] = useState('');

  useEffect(() => {
    const fetchBotDetails = async () => {
      try {
        const res = await axios.get(`/api/bots/${id}`);
        setBot(res.data);
      } catch (err) {
        console.error('Error fetching bot details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBotDetails();
  }, [id]);

  const handleVote = async () => {
    try {
      const res = await axios.post(`/api/bots/${id}/vote`);
      setBot(prevBot => ({ ...prevBot, votes: res.data.votes }));
      setVoteMessage('Thank you for voting!');
    } catch (err) {
      setVoteMessage(err.response ? err.response.data : 'Error voting for bot');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!bot) {
    return <div>Bot not found.</div>;
  }

  return (
    <div>
      <h1>{bot.id}</h1>
      <p>{bot.shortDescription}</p>
      <p>Prefix: {bot.prefix}</p>
      <p>Owner: {bot.ownerUsername}</p>
      <p>Votes: {bot.votes}</p>
      <button onClick={handleVote}>Vote</button>
      {voteMessage && <p>{voteMessage}</p>}
    </div>
  );
};

export default BotDetails;
