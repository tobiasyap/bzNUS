const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const NusStrategy = require('passport-nus-openid').Strategy;

const nusmods = require('./nusmods');
const utils = require('../utils/timetable');
const db = require('./database');
const Timetable = require('./models/Timetable');
const User = require('./models/User');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

// Testing variables
const SEMESTER = 2;
const YEAR = '2018-2019';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve client files
if(ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
}

// Configure express-session
app.use(session({
    secret: 'myveryimportsecret',
    resave: false,
    saveUninitialized: false
}));

passport.use(new NusStrategy({
        returnURL: 'http://localhost:3000/auth/nus/return',
        realm: 'http://localhost:3000/',
        profile: true
    },
    async (identifier, done) => {
        var user = null, err = null;
        try {
            user = await User.findByNusnetID(identifier);
        }
        catch(e) {
            err = e;
        }
        done(err, user); 
    }
));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/nus', passport.authenticate('nus-openid'));

app.get('/auth/nus/return',
    passport.authenticate('nus-openid', { failureRedirect: '/login'}),
    (req, res) => {
        // TODO: sucessful authentication, redirect home.
        // res.redirect('/');
        res.send(`Authenticated successfully. Your session is:\n${req.session}`);
    }
);

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

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
