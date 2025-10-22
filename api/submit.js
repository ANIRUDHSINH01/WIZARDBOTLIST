const express = require('express');
const router = express.Router();
const axios = require('axios');
const Bot = require('../models/Bot');

const webhookUrl = process.env.DISCORD_WEBHOOK_URL;

router.post('/', async (req, res) => {
  const { botId, prefix, shortDescription } = req.body;
  const ownerId = req.user.id;
  const ownerUsername = req.user.username;

  if (!botId || !prefix || !shortDescription) {
    return res.status(400).send('Bot ID, prefix, and short description are required.');
  }

  try {
    // Check if a bot with the same ID has already been submitted
    const existingBot = await Bot.findOne({ id: botId });
    if (existingBot) {
      return res.status(400).send('This bot has already been submitted.');
    }

    // Create a new bot instance and save it to the database
    const newBot = new Bot({
      id: botId,
      prefix,
      shortDescription,
      ownerId,
      ownerUsername,
      status: 'pending',
    });

    await newBot.save();

    // If a webhook URL is configured, send a notification to Discord
    if (webhookUrl) {
      try {
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
      }
    }

    res.status(201).send('Bot information submitted successfully and is awaiting approval!');

  } catch (err) {
    console.error('Error submitting bot:', err);
    res.status(500).send('An error occurred while submitting the bot.');
  }
});

module.exports = router;
