const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const authMiddleware = require('./api/auth');

app.use(express.json());
app.use(express.static('public'));

// Use authMiddleware for admin routes
app.use('/api/auth', require('./api/auth'));
app.use('/api/submit', require('./api/submit'));
app.use('/api/approve', authMiddleware, require('./api/approve'));
app.use('/api/reject', authMiddleware, require('./api/reject'));
app.use('/api/admin', require('./api/admin'));

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
