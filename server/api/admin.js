const express = require('express');
const router = express.Router();
const Bot = require('../models/Bot');

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && ADMIN_USER_IDS.includes(req.user.id)) {
    return next();
  }
  res.status(403).send('Access denied');
}

// Get all pending bots
router.get('/pending', isAdmin, async (req, res) => {
  try {
    const pendingBots = await Bot.find({ status: 'pending' });
    res.json(pendingBots);
  } catch (err) {
    console.error('Error fetching pending bots:', err);
    res.status(500).send('Error fetching pending bots.');
  }
});

// Approve a bot
router.post('/:id/approve', isAdmin, async (req, res) => {
  try {
    const updatedBot = await Bot.findOneAndUpdate(
      { id: req.params.id },
      { status: 'approved' },
      { new: true }
    );
    if (updatedBot) {
      res.send(`Bot ${req.params.id} has been approved.`);
    } else {
      res.status(404).send('Bot not found.');
    }
  } catch (err) {
    console.error('Error approving bot:', err);
    res.status(500).send('Error approving bot.');
  }
});

// Reject a bot
router.post('/:id/reject', isAdmin, async (req, res) => {
  try {
    const deletedBot = await Bot.findOneAndDelete({ id: req.params.id });
    if (deletedBot) {
      res.send(`Bot ${req.params.id} has been rejected.`);
    } else {
      res.status(404).send('Bot not found.');
    }
  } catch (err) {
    console.error('Error rejecting bot:', err);
    res.status(500).send('Error rejecting bot.');
  }
});

module.exports = router;
