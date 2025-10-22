require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const connectDB = require('./db');
const Bot = require('./models/Bot');
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Set up view engine and static files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.SESSION_SECRET || 'default_session_secret',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

app.use(passport.initialize());
app.use(passport.session());

function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
}

const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || '').split(',');
function isAdmin(req, res, next) {
  if (req.isAuthenticated() && ADMIN_USER_IDS.includes(req.user.id)) {
    return next();
  }
  res.status(403).send('Access denied');
}

// API Routes
app.use('/api/auth', require('./api/auth'));
app.use('/api/bots', require('./api/bots'));
app.use('/api/submit', isAuthenticated, require('./api/submit'));
app.use('/api/admin', isAuthenticated, require('./api/admin'));
app.use('/api/invite', isAuthenticated, require('./api/invite'));

// Page Routes
app.get('/', (req, res) => {
  res.render('index', { user: req.user });
});

app.get('/login', (req, res) => {
  res.render('login', { user: req.user });
});

app.get('/bots', async (req, res) => {
  const bots = await Bot.find({ status: 'approved' });
  res.render('bots', { user: req.user, bots });
});

app.get('/bots/:id', async (req, res) => {
  const bot = await Bot.findOne({ id: req.params.id, status: 'approved' });
  res.render('bot', { user: req.user, bot });
});

app.get('/submit', isAuthenticated, (req, res) => {
  res.render('submit', { user: req.user });
});

app.get('/admin', isAdmin, async (req, res) => {
  const bots = await Bot.find({ status: 'pending' });
  res.render('admin', { user: req.user, bots });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
