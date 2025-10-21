const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const USERS_FILE = path.join(__dirname, '../data/users.json');

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
const userId = req.query.userId; // Assuming userId is passed as a query parameter
if (!userId) {
return res.status(400).send('Missing userId');
}

let users = [];
if (fs.existsSync(USERS_FILE)) {
users = JSON.parse(fs.readFileSync(USERS_FILE));
}

const user = users.find(user => user.id === userId);
if (user) {
req.user = user;
next();
} else {
res.status(404).send('User not found');
}
}

// Get user information
router.get('/', isAuthenticated, (req, res) => {
res.json(req.user);
});

// Update user information
router.post('/', isAuthenticated, (req, res) => {
const { username, discriminator, avatar } = req.body;

if (!username || !discriminator) {
return res.status(400).send('Missing username or discriminator');
}

let users = JSON.parse(fs.readFileSync(USERS_FILE));
const userIndex = users.findIndex(user => user.id === req.user.id);

if (userIndex !== -1) {
users[userIndex].username = username;
users[userIndex].discriminator = discriminator;
users[userIndex].avatar = avatar || users[userIndex].avatar;

fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
res.send('User information updated successfully');
} else {
res.status(404).send('User not found');
}
});

module.exports = router;
