const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const BOTS_FILE = path.join(__dirname, '../data/bots.json');
const WEBHOOK_URL = process.env.WEBHOOK_URL;

router.post('/', async (req, res) => {
    const { botId } = req.body;

    if (!botId) {
        return res.status(400).send('Missing botId');
    }

    let bots = [];
    if (fs.existsSync(BOTS_FILE)) {
        bots = JSON.parse(fs.readFileSync(BOTS_FILE));
    }

    const botIndex = bots.findIndex(bot => bot.botId === botId);
    if (botIndex === -1) {
        return res.status(404).send('Bot not found');
    }

    bots[botIndex].status = 'rejected';
    fs.writeFileSync(BOTS_FILE, JSON.stringify(bots, null, 2));

    // Send webhook notification
    try {
        await axios.post(WEBHOOK_URL, {
            content: `Bot with ID ${botId} has been rejected. Owner ID: ${bots[botIndex].ownerId}`
        });
        res.send('Bot rejected successfully and notification sent');
    } catch (error) {
        console.error('Error sending webhook:', error);
        res.status(500).send('Bot rejected but failed to send notification');
    }
});

module.exports = router;
