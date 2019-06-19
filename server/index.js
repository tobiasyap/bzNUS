const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');

const scrape = require('./scrape');
const utils = require('../utils/timetable');

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

app.get('/api/nusmods/:url', async (req, res, next) => {
    console.log(`Received url ${req.params.url}`);
    const serializedTimetable = await scrape.getSerializedTimetable(req.params.url);
    console.log(`Serialized to ${serializedTimetable}`);
    const codedTimetable = utils.deserializeTimetable(serializedTimetable);
    if(!codedTimetable) {
        res.status(404).send(`The url '${req.params.url}' is not valid.`);
        return;
    }

    const timetable = {};
    let promises = [];
    for(const [moduleCode, codedTimes] of Object.entries(codedTimetable)) {
        modPromise = scrape.getModule(YEAR, moduleCode)
            .then((moduleData) => { 
                timetable[moduleCode] = utils.decodeTimes(moduleData, SEMESTER, codedTimes);
            });
        promises.push(modPromise);
    }
    Promise.all(promises)
        .then((values) => {
            res.send(timetable);
            console.log(timetable);
        })
        .catch((err) => {
            res.status(404).send("Error fetching module data.");
        });
});

module.exports = app;