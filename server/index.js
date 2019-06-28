const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('@passport-next/passport');

const nusmods = require('./nusmods');
const utils = require('../utils/timetable');
const db = require('./database');
const Timetable = require('./models/Timetable');
const User = require('./models/User');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve client files
var CLIENT_HOME_PAGE_URL = 'http://localhost:3000';
if(ENV === 'production') {
    CLIENT_HOME_PAGE_URL = '/';
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Configure express-session
app.use(session({
    secret: 'myveryimportantsecret',
    resave: false,
    saveUninitialized: false
}));

// Passport config
require('./config/passport-setup')(passport);
app.use(passport.initialize());
app.use(passport.session());

// Set up authentication routes
app.get('/auth/nus', passport.authenticate('nus-openid'));

// Redirect to client homepage after sucessful authentication
app.get('/auth/nus/return',
    passport.authenticate('nus-openid', {
        successRedirect: CLIENT_HOME_PAGE_URL,
        failureRedirect: '/auth/login/failed'
    })
);

// Allow retrival of user info when login is successful
app.get('/auth/login/success', (req, res) => {
    // req.user only exists if passport has authenticated
    if(req.user) {
        res.json({
            success: true,
            message: 'user is authenticated',
            user: req.user,
        });
    }
    else {
        res.redirect(req.baseUrl + '/auth/login/failed');
    }
});

app.get('/auth/login/failed', (req, res) => {
    res.status(401).json({
        success: false,
        message: 'user failed to authenticate'
    });
});

// After logging out, redirect back to client
app.get('/auth/logout', (req, res) => {
    req.logout();
    res.redirect(CLIENT_HOME_PAGE_URL);
});

// Specify middleware to block access if user is not authenticated
const ensureAuthenticated = (req, res, next) => {
    if(!req.user) {
        res.status(401).json({
            authenticated: false,
            message: 'user has not been authenticated'
        });
    }
    else {
        next();
    }
};

// Attach middleware to frontend
app.get('/', ensureAuthenticated, (req, res) => {
    res.status(200).json({
        authenticated: true,
        message: 'user successfully authenticated',
        user: req.user,
    });
});

// Test connectivity to PostgreSQL database
(async () => {
    var time;
    try {
        time = await db.one('SELECT NOW()');
    }
    catch(err) {
        console.error('Error connecting to PostgreSQL!');
        console.error(err);
        return;
    }
    console.log(`PostgreSQL connected: ${time.now}`);
})();

app.use('/api/nusmods/', require('./routes/api/nusmods.js'));
app.use('/api/', require('./routes/api/api.js'));

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
