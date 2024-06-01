const express = require('express');
const session = require('cookie-session');
const cookieParser = require('cookie-parser');
const cookieOnly = require('cookie');
const path = require('path');
require('dotenv').config();
const authGithub = require('./API/githubAuth');
const {Login} = require('./controller/login');
const {Visit} = require('./controller/Visit');
const { Database } = require('./controller/db');
const { checkReferal } = require('./API/referal');
const port = process.env.PORT || 8080;
const app = express();
app.use(cookieParser());


app.use(session({
    secret: process.env.sessionSecret, // Replace with your own secret key
    resave: false,           // Prevents resaving session if unmodified
    saveUninitialized: true, // Save new but unmodified sessions
    cookie: { secure: false } // Set to true if using HTTPS
}));
const commonFunctions = async (req, res, next) => {
    await Visit.initialize(req, res);
    next();
};

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'src')));
app.use(express.urlencoded());
app.use(express.json());

app.use(commonFunctions);





// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'home.html'));
});
app.get('/account', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'account.html'));
});

app.get('/login', (req, res) => {
    // Login.preLogin(req, res);
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/API/js', (req, res) => {
    res.json({
     gt_client: process.env.gt_client,
     redirect: process.env.redirect,
    });
});

app.get('/API/checkReferal', (req, res) => {
    var referalStatus = checkReferal(req, res);
    res.json({
        referalStatus: referalStatus,
       });
});

app.get('/auth/github', async (req, res) => {
    const userInfo = await authGithub(req, process.env.gt_client, process.env.gt_secret);
    res.json(userInfo);
});

app.post('/auth/google', async (req, res) => {
    const userInfo = req.body;
});


// Starting Server
app.listen(port, () => {
    
    console.log(`Server is running on http://localhost:${port}`);
});