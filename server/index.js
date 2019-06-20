const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const nusmods = require('./nusmods');
const utils = require('../utils/timetable');
const db = require('./database');
const timetables = require('./models/timetables');
const users = require('./models/users');

const ENV = process.env.NODE_ENV;
const PORT = process.env.PORT || 5000;

// Testing variables
const SEMESTER = 2;
const YEAR = '2018-2019';

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
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

app.get('/api/nusmods/:url', async (req, res, next) => {
    const url = req.params.url;
    console.log(`Received url ${url}`);

    // To reduce API calls to NUSMods, app will cache timetables in the database
    // First check if timetable already exists in database
    var timetable;
    try {
        timetable = await timetables.getTimetable(url);
    }
    catch {
        console.log(`${url} does not exist in database.`);
        timetable = null;
    }
    
    if(timetable) {
        // Timetable exists in app database.
        console.log('URL exists in database.');
    }
    else { 
        // Timetable does not exist in app database yet.
        // Follow the short shareURL and extract the serialized timetable
        // from the redirect URL's query
        var serializedTimetable;
        try {
            serializedTimetable = await nusmods.getSerializedTimetable(url);
        }
        catch(err) {
            res.status(404).send(`The url '${url}' is not valid.`);
            console.error(err);
            return;
        }
        console.log(`Serialized to ${serializedTimetable}`);
        const codedTimetable = utils.deserializeTimetable(serializedTimetable);
        if(!codedTimetable) {
            res.status(404).send(`Error deserializing '${url}'`);
            return;
        }
        
        // Serialized timetable has been obtained, but it only contains module
        // codes, not module info. Call NUSMods API to retrieve each module's info
        timetable = {};
        let promises = [];
        for(const [moduleCode, codedTimes] of Object.entries(codedTimetable)) {
            modPromise = nusmods.getModule(YEAR, moduleCode)
                .then((moduleData) => { 
                    timetable[moduleCode] = utils.decodeTimes(moduleData, SEMESTER, codedTimes);
                });
            promises.push(modPromise);
        }
        try {
            await Promise.all(promises);
        }
        catch(err) {
            res.status(404).send("Error fetching module data.");
            console.error(err);
            return;
        }

        // Insert timetable into app database so it can be retrieved 
        // by future queries to this URL
        timetables.insertTimetable(url, timetable);
    }

    // Finally, send the full timetable to the client
    res.send(timetable);
    console.log(timetable);
});

module.exports = app;