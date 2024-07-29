const express = require('express');
const session = require('express-session');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));
app.use(session({
secret: 'e5f6d7c8b9a0d1e2f3g4h5i6j7k8l9m0n1o2p3q4r5s6t7u8v9w0x1y2z3a4b5c6',
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
app.use('/submit.html', isAuthenticated, express.static('public/submit.html'));
app.use('/admin.html', isAuthenticated, express.static('public/admin.html'));
app.use('/api/submit', isAuthenticated, require('./api/submit'));
app.use('/api/admin', isAuthenticated, require('./api/admin'));
app.use('/api/invite', isAuthenticated, require('./api/invite'));

app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
