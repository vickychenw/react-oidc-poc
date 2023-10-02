//BFF entrypoint

const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 5000; // or any other port you prefer

const googleClientId = '418017177806-le9ucqkrk25kq6pfme26pab4mhid0bdm.apps.googleusercontent.com';
const googleClientSecret = 'JjJJ1bEGAlinCmkzGHa1gQUE';
const googleRedirectUrl = '/api/auth/google/callback';


app.use(cors());//to handle Cross-Origin Resource Sharing

// Initialize session middleware
app.use(
  session({
    secret: 'vichevska',
    resave: true,
    saveUninitialized: true,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Configure Google Strategy for Passport.js
passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: googleRedirectUrl,
    },
    (accessToken, refreshToken, profile, cb) => {
      // Here you can customize the user data stored in the session or perform additional operations
      return cb(null, profile);
    }
  )
);

// Serialize and Deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Routes
//Called from UI to log user in
app.get('/api/auth/google', passport.authenticate('google', { scope: ['profile'] }));

//Callback from provider when authentication fails or succeeds
app.get(
  '/api/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  (req, res) => {
    res.redirect('http://localhost:3000/pokemon');
  }
);

app.get('/api/auth/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

app.get('/api/user', (req, res) => {
  res.send(req.user);
});


app.get('/api/data', async (req, res) => {
  try {
    const response = await axios.get('https://pokeapi.co/api/v2/pokemon/ditto'); // Replace with your actual API endpoint
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`BFF server is running on http://localhost:${PORT}`);
});
