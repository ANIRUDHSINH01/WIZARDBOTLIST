const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
const { botId, prefix } = req.body;
// Process the form data here
console.log(`Bot ID: ${botId}, Prefix: ${prefix}`);
res.send('Bot information submitted successfully!');
});

module.exports = router;
