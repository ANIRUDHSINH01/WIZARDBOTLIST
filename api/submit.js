const express = require('express');
const router = express.Router();
const axios = require('axios');

const webhookUrl = 'https://discord.com/api/webhooks/{webhook_id}/{webhook_token}';

router.post('/', async (req, res) => {
const { botId, prefix } = req.body;

try {
// Send webhook to Discord
await axios.post(webhookUrl, {
content: `New Bot Submission
Bot ID: ${botId}
Prefix: ${prefix}`
});
console.log('Webhook sent successfully');

// Respond to client
res.send('Bot information submitted successfully!');
} catch (error) {
console.error('Error sending webhook:', error);
res.status(500).send('Error submitting bot information');
}
});

module.exports = router;
