const express = require('express');
const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;

router.get('/', (req, res) => {
    const { botId } = req.query;

    if (!botId) {
        return res.status(400).send('Missing botId');
    }

    // Generate invite link with 0 permissions
    const inviteLink = `https://discord.com/api/oauth2/authorize?client_id=${botId}&permissions=0&scope=bot`;

    res.send(inviteLink);
});

module.exports = router;
