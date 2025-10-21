const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const botsFilePath = path.join(__dirname, '..', 'data', 'bots.json');

// Get all approved bots
router.get('/', (req, res) => {
  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    const approvedBots = Object.values(bots).filter(bot => bot.status === 'approved');
    res.json(approvedBots);
  });
});

// Get a specific bot by ID
router.get('/:id', (req, res) => {
  const botId = req.params.id;
  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    const bot = bots[botId];
    if (bot && bot.status === 'approved') {
      res.json(bot);
    } else {
      res.status(404).send('Bot not found or not approved.');
    }
  });
});

// Vote for a bot
router.post('/:id/vote', (req, res) => {
  const botId = req.params.id;

  // A simple check to see if the user is authenticated.
  // In a real application, you'd want to use a more robust
  // rate-limiting and vote-tracking system.
  if (!req.isAuthenticated()) {
    return res.status(401).send('You must be logged in to vote.');
  }

  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    const bot = bots[botId];
    if (bot && bot.status === 'approved') {
      bot.votes += 1;
      fs.writeFile(botsFilePath, JSON.stringify(bots, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to bots.json:', writeErr);
          return res.status(500).send('Error saving vote.');
        }
        res.json({ votes: bot.votes });
      });
    } else {
      res.status(404).send('Bot not found or not approved.');
    }
  });
});

module.exports = router;
