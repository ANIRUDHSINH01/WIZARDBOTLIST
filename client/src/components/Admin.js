import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Admin = () => {
  const [pendingBots, setPendingBots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchPendingBots = async () => {
    try {
      const res = await axios.get('/api/admin/pending');
      setPendingBots(res.data);
    } catch (err) {
      setError(err.response ? err.response.data : 'Error fetching pending bots');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingBots();
  }, []);

  const handleApprove = async (botId) => {
    try {
      await axios.post(`/api/admin/${botId}/approve`);
      fetchPendingBots(); // Refresh the list
    } catch (err) {
      setError(err.response ? err.response.data : 'Error approving bot');
    }
  };

  const handleReject = async (botId) => {
    try {
      await axios.post(`/api/admin/${botId}/reject`);
      fetchPendingBots(); // Refresh the list
    } catch (err) {
      setError(err.response ? err.response.data : 'Error rejecting bot');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Pending Bots</h2>
      {pendingBots.length > 0 ? (
        <ul>
          {pendingBots.map(bot => (
            <li key={bot.id}>
              <strong>{bot.id}</strong> (Owner: {bot.ownerUsername})
              <p>{bot.shortDescription}</p>
              <button onClick={() => handleApprove(bot.id)}>Approve</button>
              <button onClick={() => handleReject(bot.id)}>Reject</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No pending bots.</p>
      )}
    </div>
  );
};

export default Admin;
