const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authMiddleware = require('./api/auth');

app.use(express.json());
app.use(express.static('public'));

// Use authMiddleware for admin routes
app.use('/api/submit', authMiddleware, require('./api/submit'));
app.use('/api/approve', authMiddleware, require('./api/approve'));
app.use('/api/reject', authMiddleware, require('./api/reject'));

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
