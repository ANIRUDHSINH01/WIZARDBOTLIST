const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // To parse form data
app.use(express.static('public')); // Serve static files from 'public' directory
app.use(session({
secret: process.env.SESSION_SECRET,
resave: false,
saveUninitialized: true,
cookie: { secure: false } // Use secure: true in production with HTTPS
}));

// Middleware to check if user is authenticated
function isAuthenticated(req, res, next) {
if (req.session.user) {
next();
} else {
res.redirect('/login.html');
}
}

// Use authMiddleware for auth routes
app.use('/api/auth', require('./api/auth'));

// Use isAuthenticated middleware for secure routes
app.get('/submit.html', isAuthenticated, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'submit.html'));
});
app.get('/admin.html', isAuthenticated, (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});
app.use('/api/submit', isAuthenticated, require('./api/submit'));
app.use('/api/admin', isAuthenticated, require('./api/admin'));
app.use('/api/invite', isAuthenticated, require('./api/invite'));

// Serve index.html as the home page
app.get('/', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Serve login.html
app.get('/login.html', (req, res) => {
res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
