const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const BOTS_FILE = path.join(__dirname, '../data/bots.json');
const USERS_FILE = path.join(__dirname, '../data/users.json');

// Middleware to check if user is admin
function isAdmin(req, res, next) {
    const userId = req.query.userId; // Assuming userId is passed as a query parameter
    if (!userId) {
        return res.status(400).send('Missing userId');
    }

    let users = [];
    if (fs.existsSync(USERS_FILE)) {
    users = JSON.parse(fs.readFileSync(USERS_FILE));
    }

    const user = users.find(user => user.id === userId);
    if (user && user.isAdmin) {
        next();
    } else {
        res.status(403).send('Access denied');
    }
}

router.get('/', isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, '../public/admin.html'));
});

router.get('/data', isAdmin, (req, res) => {
    let bots = [];
    if (fs.existsSync(BOTS_FILE)) {
        bots = JSON.parse(fs.readFileSync(BOTS_FILE));
    }

    res.json(bots);
});

module.exports = router;
