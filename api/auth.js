const express = require('express');
const router = express.Router();

const adminCredentials = {
username: 'admin',
password: 'admin123'
};

router.use((req, res, next) => {
const { username, password } = req.headers;

if (username === adminCredentials.username && password === adminCredentials.password) {
next();
} else {
res.status(401).send('Unauthorized');
}
});

module.exports = router;
