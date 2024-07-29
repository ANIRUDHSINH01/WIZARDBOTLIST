const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const CLIENT_ID = process.env.DISCORD_CLIENT_ID;
const CLIENT_SECRET = process.env.DISCORD_CLIENT_SECRET;
const REDIRECT_URI = process.env.DISCORD_REDIRECT_URI;
const USERS_FILE = path.join(__dirname, '../data/users.json');

router.get('/login', (req, res) => {
const redirect = `https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_type=code&scope=identify`;
res.redirect(redirect);
});

router.get('/callback', async (req, res) => {
const { code } = req.query;

if (!code) {
return res.send('No code provided');
}

try {
const tokenResponse = await axios.post('https://discord.com/api/oauth2/token', new URLSearchParams({
client_id: CLIENT_ID,
client_secret: CLIENT_SECRET,
code,
grant_type: 'authorization_code',
redirect_uri: REDIRECT_URI,
scope: 'identify',
}), {
headers: {
'Content-Type': 'application/x-www-form-urlencoded',
},
});

const userResponse = await axios.get('https://discord.com/api/users/@me', {
headers: {
authorization: `${tokenResponse.data.token_type} ${tokenResponse.data.access_token}`,
},
});

const userData = userResponse.data;

// Load existing users
let users = [];
if (fs.existsSync(USERS_FILE)) {
users = JSON.parse(fs.readFileSync(USERS_FILE));
}

// Check if user already exists
const existingUserIndex = users.findIndex(user => user.id === userData.id);
if (existingUserIndex !== -1) {
users[existingUserIndex] = userData; // Update existing user
} else {
userData.isAdmin = false; // Mark every new user as non-admin initially
users.push(userData); // Add new user
}

// Save users to file
fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

// Redirect to submit page
res.redirect('/');
} catch (error) {
console.error(error);
res.status(500).send('Error during the authentication process');
}
});

module.exports = router;
