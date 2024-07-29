const express = require('express');
const router = express.Router();
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;

passport.use(new DiscordStrategy({
clientID: process.env.DISCORD_CLIENT_ID,
clientSecret: process.env.DISCORD_CLIENT_SECRET,
callbackURL: process.env.DISCORD_REDIRECT_URI,
scope: ['identify']
},
function(accessToken, refreshToken, profile, done) {
// Save user profile to session
return done(null, profile);
}
));

passport.serializeUser((user, done) => {
done(null, user);
});

passport.deserializeUser((obj, done) => {
done(null, obj);
});

router.use(passport.initialize());
router.use(passport.session());

router.get('/login', passport.authenticate('discord'));

router.get('/callback', passport.authenticate('discord', {
failureRedirect: '/login.html'
}), (req, res) => {
// Successful authentication, redirect to home.
req.session.user = req.user;
res.redirect('/');
});

router.get('/logout', (req, res) => {
req.logout();
req.session.destroy();
res.redirect('/');
});

router.get('/userinfo', (req, res) => {
if (req.isAuthenticated()) {
res.json(req.user);
} else {
res.status(401).send('Unauthorized');
}
});

module.exports = router;
