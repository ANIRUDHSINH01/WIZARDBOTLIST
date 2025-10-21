const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');

// Get all approved bots
router.get('/', async (req, res) => {
  try {
    const approvedBots = await Bot.find({ status: 'approved' });
    res.json(approvedBots);
  } catch (err) {
    console.error('Error fetching approved bots:', err);
    res.status(500).send('Error fetching approved bots.');
  }
});

// Get a specific bot by ID
router.get('/:id', async (req, res) => {
  try {
    const bot = await Bot.findOne({ id: req.params.id, status: 'approved' });
    if (bot) {
      res.json(bot);
    } else {
      res.status(404).send('Bot not found or not approved.');
    }
  } catch (err) {
    console.error('Error fetching bot details:', err);
    res.status(500).send('Error fetching bot details.');
  }
});

// Vote for a bot
router.post('/:id/vote', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).send('You must be logged in to vote.');
  }

  try {
    const updatedBot = await Bot.findOneAndUpdate(
      { id: req.params.id, status: 'approved' },
      { $inc: { votes: 1 } },
      { new: true }
    );
    if (updatedBot) {
      res.json({ votes: updatedBot.votes });
    } else {
      res.status(404).send('Bot not found or not approved.');
    }
  } catch (err) {
    console.error('Error voting for bot:', err);
    res.status(500).send('Error voting for bot.');
  }
});

module.exports = router;
