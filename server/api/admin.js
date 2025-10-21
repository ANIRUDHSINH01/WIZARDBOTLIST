const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const botsFilePath = path.join(__dirname, '..', 'data', 'bots.json');
const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && ADMIN_USER_IDS.includes(req.user.id)) {
    return next();
  }
  res.status(403).send('Access denied');
}

// Get all pending bots
router.get('/pending', isAdmin, (req, res) => {
  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    const pendingBots = Object.values(bots).filter(bot => bot.status === 'pending');
    res.json(pendingBots);
  });
});

// Approve a bot
router.post('/:id/approve', isAdmin, (req, res) => {
  const botId = req.params.id;
  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    if (bots[botId]) {
      bots[botId].status = 'approved';
      fs.writeFile(botsFilePath, JSON.stringify(bots, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to bots.json:', writeErr);
          return res.status(500).send('Error updating bot status.');
        }
        res.send(`Bot ${botId} has been approved.`);
      });
    } else {
      res.status(404).send('Bot not found.');
    }
  });
});

// Reject a bot
router.post('/:id/reject', isAdmin, (req, res) => {
  const botId = req.params.id;
  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }
    const bots = JSON.parse(data);
    if (bots[botId]) {
      delete bots[botId]; // Or mark as rejected, for now we delete
      fs.writeFile(botsFilePath, JSON.stringify(bots, null, 2), (writeErr) => {
        if (writeErr) {
          console.error('Error writing to bots.json:', writeErr);
          return res.status(500).send('Error updating bot status.');
        }
        res.send(`Bot ${botId} has been rejected.`);
      });
    } else {
      res.status(404).send('Bot not found.');
    }
  });
});

module.exports = router;
