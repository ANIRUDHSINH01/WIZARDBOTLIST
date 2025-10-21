require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const passport = require('passport');
const connectDB = require('./db');
const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

const MongoStore = require('connect-mongo');
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: 'sessions'
  }),
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

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
  res.status(401).json({ error: 'User not authenticated' });
}

app.use('/api/auth', require('./api/auth'));
app.use('/api/bots', require('./api/bots'));
app.use('/api/submit', isAuthenticated, require('./api/submit'));
app.use('/api/admin', isAuthenticated, require('./api/admin'));
app.use('/api/invite', isAuthenticated, require('./api/invite'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'));
  });
}

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
