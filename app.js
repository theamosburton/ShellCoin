const express = require('express');
const path = require('path');
const passport = require('passport');
const axios = require('axios');
// const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cookieSession = require('cookie-session');
const app = express();
const port = process.env.PORT || 8080;
const { connect, client } = require('./controller/db');


app.use(cookieSession({
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

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

const clientID = 'Ov23libe9d8wlQxjU4XO';
const clientSecret = '691a27b14a17474f03142ba6c63347ab9a9f592d';
app.get('/auth/github', async (req, res) => {
    const requestToken = req.query.code;
    const tokenResponse = await axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    const userResponse = await axios({
        method: 'get',
        url: 'https://api.github.com/user',
        headers: {
            Authorization: `token ${accessToken}`
        }
    });

    res.json(userResponse.data);
});


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

// 691a27b14a17474f03142ba6c63347ab9a9f592d