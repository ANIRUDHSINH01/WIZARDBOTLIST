const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const botsFilePath = path.join(__dirname, '..', 'data', 'bots.json');
const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

router.post('/', (req, res) => {
  const { botId, prefix, shortDescription } = req.body;
  const ownerId = req.user.id;
  const ownerUsername = req.user.username;

  if (!botId || !prefix || !shortDescription) {
    return res.status(400).send('Bot ID, prefix, and short description are required.');
  }

  fs.readFile(botsFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading bots.json:', err);
      return res.status(500).send('Error reading bot data.');
    }

    const bots = data ? JSON.parse(data) : {};

    if (bots[botId]) {
      return res.status(400).send('This bot has already been submitted.');
    }

    bots[botId] = {
      id: botId,
      prefix,
      shortDescription,
      ownerId,
      ownerUsername,
      status: 'pending',
      votes: 0,
      submittedAt: new Date().toISOString()
    };

    fs.writeFile(botsFilePath, JSON.stringify(bots, null, 2), async (writeErr) => {
      if (writeErr) {
        console.error('Error writing to bots.json:', writeErr);
        return res.status(500).send('Error saving bot information.');
      }

      if (webhookUrl) {
        try {
          // Send webhook to Discord
          await axios.post(webhookUrl, {
              embeds: [{
                title: 'New Bot Submission',
              color: 0x0099ff,
              fields: [
                { name: 'Bot ID', value: botId, inline: true },
                { name: 'Owner', value: `${ownerUsername} (${ownerId})`, inline: true },
                { name: 'Prefix', value: prefix, inline: false },
                { name: 'Short Description', value: shortDescription, inline: false },
              ],
              timestamp: new Date().toISOString()
            }]
        });
        console.log('Webhook sent successfully');
      } catch (webhookError) {
        console.error('Error sending webhook:', webhookError);
        // Don't fail the request if the webhook fails
      }

      res.status(201).send('Bot information submitted successfully and is awaiting approval!');
    });
  });
});

module.exports = router;
