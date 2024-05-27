const express = require('express');
const path = require('path');
const passport = require('passport');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const app = express();
const port = process.env.PORT || 8080;
const { connect, client } = require('./controller/db');


app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
  }));


app.use(express.static(path.join(__dirname, 'public')));

app.use(express.static(path.join(__dirname, 'src')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});