const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('@passport-next/passport');
const cors = require('cors');

const DbUtilities = require('./models/Utilities');
const Global = require('./config/Global');

const nusmodsRouter = require('./routes/api/nusmods');
const apiRouter = require('./routes/api/api');
const authRouter = require('./routes/auth');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

// Serve client files
let CLIENT_HOME_PAGE_URL = Global.CLIENT_HOME_PAGE_URL;
if(ENV === 'production') {
    CLIENT_HOME_PAGE_URL = '/';
    app.use(express.static(path.join(__dirname, '../client/build')));
    /*
    app.use((req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'));
    });
    */
}

// Set up cors to allow us to accept requests from our client
app.use(cors({
    origin: "http://localhost:3000", // Allow server to accept request from different origin
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // Allow session cookie from browser to pass through
}));

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
app.use('/', authRouter);

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
    let time;
    try {
        time = await DbUtilities.getNow();
    }
    catch(err) {
        console.error('Error connecting to PostgreSQL!');
        console.error(err);
        return;
    }
    console.log(`PostgreSQL connected: ${time.now}`);
})();

app.use('/api/nusmods/', nusmodsRouter);
app.use('/api/', apiRouter);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});

module.exports = app;
