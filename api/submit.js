const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const BOTS_FILE = path.join(__dirname, '../data/bots.json');

router.post('/', (req, res) => {
    const { botId, ownerId, botName } = req.body;

    if (!botId || !ownerId || !botName) {
        return res.status(400).send('Missing botId, ownerId, or botName');
    }

    let bots = [];
    if (fs.existsSync(BOTS_FILE)) {
        bots = JSON.parse(fs.readFileSync(BOTS_FILE));
    }

    bots.push({ botId, ownerId, botName, status: 'pending' });

    fs.writeFileSync(BOTS_FILE, JSON.stringify(bots, null, 2));

    res.send('Bot submitted successfully');
});

module.exports = router;
